Quest Lourdes 2016 WiFi Hotspot
===============================

This repository contains all code used for the WiFi hotspot used in the Quest
made by made by [KSA De Graal](https://ksadegraal.be) for the Lourdes 2016 
summer camp of [KSA Noordzeegouw](https://www.ksa.be/werkkringen/ksa-noordzeegouw).

Missing from this repository is the video material used by the frontend.


License
-------

ISC, see [LICENSE](./LICENSE) file.


Requirements
------------

*   Raspberry Pi (I've used a 1st generation model B)
*   USB WiFi module:
    +   I've successfully used two different models, both having Realtek 
        chipsets:
        -   [LB-Link BL-LW05-AR2](https://www.adafruit.com/product/1030)
        -   [Trendnet TEW-624UB](https://www.trendnet.com/products/wifi/N-adapters/N300/TEW-624UB)
    +   If you're using another model which also has a Realtek chipset, changes
        are things will work as scripted. But YMMV.
    +   If you're using one with another chipset, check out the section on 
        `hostapd` in `scripts/rpi-jessie-setup.sh`.
*   SD Card (4GB is fine, 2GB might work too)
*   Battery pack to power the hotspot
*   Linux PC (I used Ubuntu 16.04) with Node.js (v10 LTS recommended) to build
    the frontend:
    +   [Instructions to install Node.js for various linuxes](https://github.com/nodesource/distributions/blob/master/README.md)
    +   [Other ways to download and install Node.js](https://nodejs.org/en/download/)
    +   Windows will work too if you know what you're doing.


Caution
-------

The WiFi modules can run _extremely_ hot, and easily stop functioning. Adding 
some heat sinks and fan are probably a good idea (tm). Especially if a lot of
people try to connect at the same time. But for us, it was too late. Having to 
operate in open air summer conditions with temperatures soaring above 30°C, we
tried to keep things cool by wrapping it some instant cold packs we've got from
the local pharmacy.


How it works
------------

On the Raspberry Pi, the following processes are running:

1.  [`hostapd`](http://w1.fi/hostapd/) puts the WiFi module in AP mode, so that 
    the Raspberry Pi starts broadcasting, and players can connect to it with
    their smartphone. It defines the SSID name, password, and other hotspot 
    specifics.
    
    **NOTE**: Debian's stock version of `hostapd` didn't work for me, because it
    doesn't support the Realtek driver that I needed. Se below for more details.

2.  Once connected, they hit [`dnsmasq`](http://www.thekelleys.org.uk/dnsmasq/doc.html)
    acting as both a DHCP and a DNS server: 
    -   As DHCP server, it will give them an IP address.
    -   As DNS server, it will resolve domain names to IP addresses, and this 
        little gem in its configuration tells it to answer to _any_ request with
        its _own_ IP address:
        ```
        address=/#/192.168.42.1
        ```
        This will make sure that the raspberry pi will tell to the smartphone:
        "whatever random website you're trying to access, I'm the webhost 
        serving it. I'm king of the world, I contain the entire internet." 
        And so the smartphone will send all its HTTP requests to the Raspberry
        Pi itself.
  
    **NOTE**: `dnsmasq` should only listen on `wlan0`, and not on the loopback 
    `lo`, because otherwise, you won't be able to reach out from the Raspberry 
    Pi via the ethernet connection (and you won't be able to download or 
    `apt-get` anything). Getting _that_ right also involved adding 
    `name_server_blacklist=127.0.0.1` to `/etc/resolvconf.conf` (just so you 
    know).

3.  When the players send an HTTP request to the raspberry pi, _any_ HTTP
    request will do, they hit [`nginx`](https://www.nginx.com/) which acts as
    webserver:
   
    *   Any request for a domain other that `quest.ksadegraal.be`, is responded
        to with a 307 temporary redirect to `quest.ksadegraal.be`. This makes 
        sure that whatever random website the player tries to access, they will
        be redirected to our game.
        ```
        server {
            listen 80 default_server;
            return 307 http://quest.ksadegraal.be;
        }
        ```
     
    *   HTTP requests for `quest.ksadegraal.be` are fully handled:
        +   It's mostly static files stored in `/home/pi/www`.
        +   A reverse proxy on `/api/` makes sure requests to the REST API are 
            properly forwarded to the node.js process running on local port 
            3000.
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
  
4.  `http://quest.ksadegraal.be` is finally loaded on the player's phone. 
    It's a single page webapp written in JavaScript using 
    [React](https://facebook.github.io/react/) and 
    [Redux](http://redux.js.org/). Some dynamic data (start time, list of 
    players, ranking) is served by a backend [node.js](https://nodejs.org/) 
    process, exposed via a REST API mounted on 
    `http://quest.ksadegraal.be/api/`.
  
    *   The application shows a puzzle the player must solve, and a (ticking) 
        clock that shows how long they're already playing.
    *   Once they solve the puzzle, the clock is stopped (and logged in the 
        backend), and the secret content is unlocked. A ranking of all players 
        is also shown.


Installation
------------

### I. Prepare base system

1.  Download Raspbian Jessie Lite image and unzip it to get an `.img` file.
    *   I've used [2016-05-10-raspbian-jessie-lite.img](https://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2016-05-13/2016-05-10-raspbian-jessie-lite.zip)
        and the instructions below are all based on that image.
        ```
        $ wget https://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2016-05-13/2016-05-10-raspbian-jessie-lite.zip
        $ unzip 2016-05-10-raspbian-jessie-lite.zip
        ```
    *   If you're looking for the most recent version instead, 
        [look here](https://www.raspberrypi.org/downloads/raspbian/).
 
2.  Install the image on the SD card.
    *   **IF** youre SD card reader device is `/dev/mmcblk0`, **AND** you know 
        what I'm taking about, do this:
        
        **WARNING**: `dd` stands for _disk destroyer_, so if you're not sure what 
        the above means, follow the [official installation instructions](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md)
        instead.
        ```
        $ sudo umount /dev/mmcblk0*
        $ sudo dd bs=4M if=2016-05-10-raspbian-jessie-lite.img of=/dev/mmcblk0
        $ sync
        ```
    *   **Otherwise**, follow the [official installation instructions](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md).
 
3.  Put the SD card in the Raspberry Pi and boot.

### Change default password, and enable passwordless login.

1.  **DO** change the default password:
    ```
    $ ssh pi@raspberrypi 'passwd'
    ```
    You'll be prompted twice for the current password (it's `raspberry`, just so
    you know), once to login over SSH, and once to change the password.
 
2.  For the installation scripts to properly work, you'll need [passwordless login](https://linuxconfig.org/passwordless-ssh).
    ```
    $ ssh-copy-id pi@raspberrypi
    ```
 
### II. Install backend

Install and configure all software on Raspberry Pi. You'll find a script
to do so in `scripts/rpi-jessie-setup.sh`.

**NOTE**: It's **not** generic nor fault tolerant. It works in my case, but 
YMMV:
*   It's based on `2016-05-10-raspbian-jessie-lite.img`
*   It assumes a Realtek chipset for the WiFi module:
    +   It will configure `driver=rtl871xdrv` in `/etc/hostapd/hostapd.conf`
    +   It will replace `/usr/sbin/hostapd` by a patched version from 
        [Adafruit](https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/install-software#configure-access-point)
    +   If you need another chipset, you will need to change the section on
        `hostapd` in `scripts/rpi-jessie-setup.sh`

There's a top-level Makefile that will execute the script over SSH:
```
$ make base
```

### III. Prepare the database file

The backend requires a json file as database, which you need to manually create.
It needs to be placed in the `backend/` folder, and be named `db.json`. On the
raspberry pi, that would be `~/quest-2016-hotspot/backend/db.json`. It's content
is quite simple: it contains the start time of the game, and a list of all the
player's names:

```
{
  "started": 1545845530059,
  "players": [
    {
      "name": "player 1"
    },
    {
      "name": "player 2"
    },
    {
      "name": "player 3"
    },
    ...
  ]
}
```

The start time, you can easily set to the current time, using a little script
included in the repository:

```
$ scripts/set-start-time.sh
```

Once players have solved the puzzle, their end time will be recored in this
file as well:

```
{
  "started": 1545845530059,
  "players": [
    {
      "name": "player 1",
      "stopped": 1545845858498
    },
    ...
  ]
}
```

### IV. Build the frontend

Instead of building the frontend on the raspberry pi, I used my dev machine 
and uploaded the assets instead.  In the frontend folder, you simply do:
```
frontend$ make install
```
The makefile assumes it needs to upload the assets to `pi@raspberrypi`, which
you can change by modifying the `HOST` variable.

But first, you'll need to (re)create the video material needed by 
`frontend/app/components/video`. It will try to serve to video files:
`filmpje.mp4` and `filmpje.webm`. I've used ffmpeg to generate them from the
source material, using the script which you can fined in this repository:
```
$ scripts/prep-video.sh [filename]
```

In addition, it also assumes to have one
image `filmpje.png` as poster, which you have to create yourself.