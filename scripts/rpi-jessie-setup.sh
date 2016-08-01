# based on raspbian jessie lite image, downloaded from
# https://www.raspberrypi.org/downloads/raspbian/

# see https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/install-software

sudo apt-get update

# what the hell! https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=119410
# alternative isc-dhcp-client seems to be installed already
sudo apt-get remove -y dhcpcd5

sudo apt-get install -y hostapd dnsmasq isc-dhcp-client nginx dnsutils git

sudo cp /etc/hosts /etc/hosts.old
sudo patch /etc/hosts << EOF
@@ -3,4 +3,5 @@
 ff02::1	ip6-allnodes
 ff02::2 	ip6-allrca outers

-127.0.1.1      raspberrypi
+127.0.1.1      degraal
+168.192.1.36    git.chateau.bramz.net
EOF

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

sudo tee /etc/dnsmasq.d/degraal.conf << EOF
# If you don't want dnsmasq to read /etc/resolv.conf or any other
# file, getting its servers from this file instead (see below), then
# uncomment this.
#no-resolv

# Add domains which you want to force to an IP address here.
# The example below send any host in double-click.net to a local
# web-server.
#address=/double-click.net/127.0.0.1
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


# --- HOSTAPD

sudo mkdir -p /etc/hostapd 
sudo tee /etc/hostapd/hostapd.conf << EOF
interface=wlan0
driver=rtl871xdrv
ssid=DeGraal
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=BernadetteSoubirous
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
 #      -d   show more debug messages (-dd for even more)
EOF


# PATCHED HOSTAPD

wget http://adafruit-download.s3.amazonaws.com/adafruit_hostapd_14128.zip
unzip adafruit_hostapd_14128.zip
sudo mv /usr/sbin/hostapd /usr/sbin/hostapd.orig
sudo mv hostapd /usr/sbin
sudo chown root:root /usr/sbin/hostapd
sudo chmod 755 /usr/sbin/hostapd



# --- CONFIGURING NGINX
# http://serverfault.com/questions/679393/captive-portal-popups-the-definitive-guide

sudo tee /etc/nginx/sites-available/degraal << EOF
server {
	listen 80;
	listen [::]:80;

	server_name quest.ksadegraal.be;

	root /home/pi/www;
	index index.html;

	location / {
		try_files $uri $uri/ =404;
	}

  location /generate_204 {
    return 302 http://quest.ksadegraal.be
  }

}
EOF
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/degraal /etc/nginx/sites-enabled/degraal



# --- finally, set hostname and reboot

sudo hostnamectl set-hostname degraal
sudo reboot
