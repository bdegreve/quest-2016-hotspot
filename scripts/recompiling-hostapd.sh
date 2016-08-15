# https://github.com/pritambaral/hostapd-rtl871xdrv

sudo apt-get install -y libnl-dev libssl-dev
apt-get source hostapd
git clone https://github.com/pritambaral/hostapd-rtl871xdrv.git

cd ~/wpa-2.3
patch -Np1 -i ~/hostapd-rtl871xdrv/rtlxdrv.patch
cp ~/hostapd-rtl871xdrv/driver_rtl.h src/drivers/
cp ~/hostapd-rtl871xdrv/driver_rtw.c src/drivers/
cp ~/hostapd-rtl871xdrv/.config hostapd/

cd ~/wpa-2.3/hostapd
cp defconfig .config
patch .config << EOF
@@ -315,3 +315,7 @@
 # http://wireless.kernel.org/en/users/Documentation/acs
 #
 #CONFIG_ACS=y
+
+# Driver for rtl871xdrv
+CONFIG_DRIVER_RTW=y
+
EOF
make
sudo cp -f hostapd /usr/sbin/hostapd
