# based on raspbian jessie lite image 2016-05-10-raspbian-jessie-lite.img
# downloaded from https://www.raspberrypi.org/downloads/raspbian/

# see:
# - https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/install-software
# - http://serverfault.com/questions/679393/captive-portal-popups-the-definitive-guide


# --- Step 1: let's install some software

sudo apt-get update

# what the hell! https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=119410
# alternative isc-dhcp-client seems to be installed already
sudo apt-get remove -y dhcpcd5

sudo apt-get install -y hostapd dnsmasq isc-dhcp-client nginx dnsutils git nodejs-legacy npm


# --- Step 2: Fix our network interfaces:
# - assign static IP 192.168.42.1 on wlan0 for our hotspot
# - we got rid of dhcpcd5 madness and must do DHCP on eth0 the normal way.
# - get rid of wlan1, we don't need it.

sudo cp /etc/network/interfaces /etc/network/interfaces.old
sudo patch /etc/network/interfaces << EOF
@@ -9,12 +9,11 @@
 auto lo
 iface lo inet loopback

-iface eth0 inet manual
+auto eth0
+iface eth0 inet dhcp

-allow-hotplug wlan0
-iface wlan0 inet manual
-    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
+auto wlan0
+iface wlan0 inet static
+  address 192.168.42.1
+  netmask 255.255.255.0

-allow-hotplug wlan1
-iface wlan1 inet manual
-    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
EOF


# --- Step 3: Configure hostapd, to turn on acces point.
# - Use at least 8 characters for wpa_passphrase
# - driver=rtl871xdrv because our wifi modules have realtek chipsets, but YMMV.
#
# IF YOU USE ANOTHER DRIVER THAN rtl871xdrv, YOU DON'T WANT TO USE THE PATCHED
# HOSTAPD (SEE BELOW)

sudo mkdir -p /etc/hostapd 
sudo tee /etc/hostapd/hostapd.conf << EOF
interface=wlan0
driver=rtl871xdrv
ssid=BernadetteSoubirous
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=jacomet123
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF

sudo cp /etc/default/hostapd /etc/default/hostapd.old
sudo patch /etc/default/hostapd << EOF
@@ -7,7 +7,7 @@
 # file and hostapd will be started during system boot. An example configuration
 # file can be found at /usr/share/doc/hostapd/examples/hostapd.conf.gz
 #
-#DAEMON_CONF=""
+DAEMON_CONF="/etc/hostapd/hostapd.conf"
 
 # Additional daemon options to be appended to hostapd command:-
 # 	-d   show more debug messages (-dd for even more)
EOF

# -- PATCHING HOSTAPD
# Debian's version of hostapd installed with apt-get install hostapd
# doesn't support the realteck rtl871xdrv driver.
# As per https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/install-software#configure-access-point
# we replace it by a patched version
#
# remark: this patched version is quite old (version )
# while debian's version is more recent.
# If you want, you can also compile a patched version that's more recent
# See here: 

wget http://adafruit-download.s3.amazonaws.com/adafruit_hostapd_14128.zip
unzip adafruit_hostapd_14128.zip
sudo mv /usr/sbin/hostapd /usr/sbin/hostapd.orig
sudo mv hostapd /usr/sbin
sudo chown root:root /usr/sbin/hostapd
sudo chmod 755 /usr/sbin/hostapd


# --- Step 4: Configuring dnsmasq: DHCP and DNS server

sudo tee /etc/dnsmasq.d/quest.conf << EOF
# Add domains which you want to force to an IP address here.
# Using # as domain name is a wildcard.
# This this says: respond to any DNS request for any domain with the same
# IP address 192.168.42.1. This will make sure the connected smartphones will
# contact the raspberry webserver for any website they try to visit.
address=/#/192.168.42.1

# If you want dnsmasq to listen for DHCP and DNS requests only on
# specified interfaces (and the loopback) give the name of the
# interface (eg eth0) here.
# Repeat the line for more than one interface.
#interface=
interface=wlan0

# Or you can specify which interface _not_ to listen on
#except-interface=
except-interface=lo

# Set this (and domain: see below) if you want to have a domain
# automatically added to simple names in a hosts-file.
expand-hosts

# Set the domain for dnsmasq. this is optional, but if it is set, it
# does the following things.
# 1) Allows DHCP hosts to have fully qualified domain names, as long
#     as the domain part matches this setting.
# 2) Sets the "domain" DHCP option thereby potentially setting the
#    domain of all systems configured by DHCP
# 3) Provides the domain part for "expand-hosts"
domain=ksadegraal.be

# Uncomment this to enable the integrated DHCP server, you need
# to supply the range of addresses available for lease and optionally
# a lease time. If you have more than one network, you will need to
# repeat this for each network on which you want to supply DHCP
# service.
dhcp-range=192.168.42.50,192.168.42.250,1h

# Send an empty WPAD option. This may be REQUIRED to get windows 7 to behave.
dhcp-option=252,"\n"

# For debugging purposes, log each DNS query as it passes through
# dnsmasq.
log-queries

# Log lots of extra information about DHCP transactions.
log-dhcp

log-facility=/var/log/dnsmasq.log
EOF

# Even though we excluded the loopback lo interface above, resolv.conf will
# still mention 127.0.0.1 as DNS server. This prevents from making outbound
# connections over the ethernet cable (since we told dnsmasq to resolve
# any DNS query to itself). Therefor, explicitly blacklist 127.0.0.1 as
# DNS server on this machine.

sudo cp /etc/resolvconf.conf /etc/resolvconf.conf.old
sudo patch /etc/resolvconf.conf << EOF
@@ -11,3 +11,7 @@
 dnsmasq_resolv=/var/run/dnsmasq/resolv.conf
 pdnsd_conf=/etc/pdnsd.conf
 unbound_conf=/var/cache/unbound/resolvconf_resolvers.conf
+
+# exclude local dns server ;-)
+# local dns server is for clients on wlan0
+name_server_blacklist=127.0.0.1
EOF


# --- Step 5: Configuring nginx: webserver

# Two tasks
# - redirect any HTTP request quest.ksadegraal.be with a 307 temporary redirect.
#   This will trigger the captive portal alert on most smartphones: the
#   smartphone will detect its not directly connected to the internet, and
#   will show an alert that the user still needs to login before he/she can
#   proceed. This allows us to send them to quest.ksadegraal.be
# 
# - serve quest.ksadegraal.be:
#   - it's mostly static assets (files are stored in /home/pi/www), 
#     so try_files on /
#   - /api/* paths are for the dynamic REST API. The need to be proxied to our
#     backend server, running on localhost:3000.
#     (final slash on both /api/ and localhost:3000/ so that /api/foo will
#      be proxied to localhost:3000/foo).

sudo tee /etc/nginx/sites-available/quest << EOF
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	listen 443 ssl default_server;
	listen [::]:443 ssl default_server;

	return 307 http://quest.ksadegraal.be;
}

server {
	listen 80;
	listen [::]:80;

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
EOF
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/quest /etc/nginx/sites-enabled/quest


# --- Step 6: install backend server (REST API), written in node.js

cd ~
git clone https://github.com/bdegreve/quest-2016-hotspot.git
cd ~/quest-2016-hotspot/backend
# first "build" it as user pi (this will download all npm dependencies)
make
# then install it as a systemd service. It'll be called quest-api
sudo make install
