all: base

base:
	ssh -o StrictHostKeyChecking=no pi@raspberrypi < scripts/rpi-jessie-setup.sh