Quest Lourdes 2016 WiFi Hotspot
===============================

This repository contains all code used for the WiFi hotspot used in the 
Lourdes Quest 2016.

Missing from this repository is the video material.

Requirements
------------

- Raspberry Pi (I used a 1st generation model B)
- USB WiFi module:
  - I successfully used two different models, both having Realtek chipsets:
    - [LB-Link BL-LW05-AR2](https://www.adafruit.com/product/1030)
    - [Trendnet TEW-624UB](https://www.trendnet.com/products/wifi/N-adapters/N300/TEW-624UB)
  - If you're using another model which also has a Realtek chipset, changes are
   things will work as scripted. But YMMV.
  - If you're using one with another chipset, check out the bit on `hostapd`
   in `scripts/rpi-jessie-setup.sh`.
- SD Card (4GB is fine, 2GB might work too)
- Battery pack to power the hotspot
- Linux PC (I used Ubuntu 16.04) with Node.js (>= 4.x) to build frontend:
  - `sudo apt-get install nodejs-legacy npm`.
  - Windows will work too if you know what you're doing, but you won't be able
   to use the makefiles.

How it works
------------

On the Raspberry Pi run following processes:

1. [`hostapd`](http://w1.fi/hostapd/) puts the WiFi module in AP mode, so the 
  Raspberry Pi starts broadcasting and players can connect to it with their 
  smartphone. It defines the SSID name, password, and other hotspot specifics.
  
  **NOTE**: Debian's stock version of `hostapd` didn't work for me, because it 
  doesn't support the Realtek driver I needed. Se below for more details.

2. Once connected, they hit [`dnsmasq`](http://www.thekelleys.org.uk/dnsmasq/doc.html)
  acting both as DHCP and DNS server: 
  - As DHCP server, it will give them an IP address.
  - As DNS server will resolve domain names to IP addresses, and this little
   gem in its configuration tells it to answer to any request with its own
   IP address:
   ```
   address=/#/192.168.42.1
   ```
   This will make sure that the raspberry pi will tell to the smartphone:
   "whatever random website you're trying to access, I'm the webhost serving it.
   I'm king of the world, I contain the entire internet." And so the smartphone
   will send all its HTTP requests to the raspberry pi itself.
  
  **NOTE**: `dnsmasq` should only listen on `wlan0`, and not on the loopback 
  `lo`, because otherwise, you won't be able to reach out from the raspberry pi
  via the ethernet connection (and you won't be able to download or `apt-get` 
  anything).
  Getting _that_ right also involved adding `name_server_blacklist=127.0.0.1` to
  `/etc/resolvconf.conf` (just so you know).

3. When they do, they hit [`nginx`](https://www.nginx.com/) which is the 
   webserver that will respond to all HTTP requests:
   
  - Any request for a domain other that `quest.ksadegraal.be`, is responded to
   with 307 temporary redirect to `quest.ksadegraal.be`. This makes sure that 
   whatever random website the player tries to access, they will be redirected
   to our game.
   
     ```
     server {
       listen 80 default_server;
       return 307 http://quest.ksadegraal.be;
     }
     ```
     
  - HTTP requests for `quest.ksadegraal.be` are fully handled:
    - It's mostly static files stored in `/home/pi/www`.
    - A reverse proxy on `/api/` makes sure requests to the REST API are 
     properly forwarded to the node.js process running on local port 3000.

    ```
    server {
        listen 80;
        server_name quest.ksadegraal.be;
        root /home/pi/www;
        index index.html;        
        location / {
          try_files $uri $uri/ =404;
        }        
        location /api/ {
          proxy_pass http://localhost:3000/;
        }
    }
    ```
    
  **NOTE**: This is also what causes your phone to show the alert you need to 
  login to the hotspot. Basically, your Android phone tries to access 
  `http://clients3.google.com/generate_204` and expects a particular response.
  When it gets a different response (because it gets redirected to 
  `quest.ksadegraal.be`), it knows it can't yet access the internet, and the 
  hotspot must have a so called _captive portal_. More info can be found 
  [here](http://serverfault.com/questions/679393/captive-portal-popups-the-definitive-guide)
  and [there](http://www.chromium.org/chromium-os/chromiumos-design-docs/network-portal-detection).
  
4. `http://quest.ksadegraal.be` is finally loaded in the player's phone, and it's
  a single page webapp written in JavaScript using [React](https://facebook.github.io/react/)
  and [Redux](http://redux.js.org/). Some dynamic data (start time, list
  of players, ranking) is served by a backend [node.js](https://nodejs.org/) 
  process, exposed via a REST API mounted on `http://quest.ksadegraal.be/api/`.
  
  - The application shows a puzzle the player must solve, and a (ticking) clock
   that shows how long they're already playing.
  - Once they solve the puzzle, the clock is stopped (and logged on the backend),
   and the secret content is unlocked. A ranking of all players is also shown.

Installation
------------

### Prepare base system

1. Download Raspbian Jessie Lite image and unzip it to get an `.img` file.
 - I used [2016-05-10-raspbian-jessie-lite.img](https://downloads.raspberrypi.org/raspbian/images/raspbian-2016-05-13/2016-05-10-raspbian-jessie.zip)
  and the instructions below are based on that image.
 - If you're looking for the most recent version, [look here](https://www.raspberrypi.org/downloads/raspbian/).
 
 ```
 wget https://downloads.raspberrypi.org/raspbian/images/raspbian-2016-05-13/2016-05-10-raspbian-jessie.zip
 unzip 2016-05-10-raspbian-jessie.zip
 ```

2. Follow the [installation instructions](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md)
 to install the image on an SD card.

3. Put the SD card in the Raspberry Pi and boot.

### Change default password, and enable passwordless login.

1. **DO** change the default password:
 ```
 ssh pi@raspberrypi 'passwd'
 ```
 You'll be prompted twice for the current password (it's `raspberry`, just so
 you know), once to login over SSH, and once to change the password.
 
2. For the installation scripts to properly work, you'll need [passwordless login](https://linuxconfig.org/passwordless-ssh).
 ```
 ssh-copy-id pi@raspberrypi
 ```
 
### Install backend

Install and configure all software on Raspberry Pi. You'll find a script
to do so in `scripts/rpi-jessie-setup.sh`.

**NOTE**: It's **not** generic nor fault tolerant. It works in my case, but YMMV:
  - It's based on `2016-05-10-raspbian-jessie-lite.img
  - It assumes a Realtek chipset for the WiFi module:
    - It will configure `driver=rtl871xdrv` in `/etc/hostapd/hostapd.conf`
    - It will replace `/usr/sbin/hostapd` by a patched version from 
     [Adafruit](https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/install-software#configure-access-point)
    - If you need another chipset, you will need to change the section on
     `hostapd` in `scripts/rpi-jessie-setup.sh`

There's a top-level Makefile that will execute the script over SSH:
```
make base
```

