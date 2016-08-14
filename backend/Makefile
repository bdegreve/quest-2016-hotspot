all: node_modules

check: node_modules
	npm test

run: node_modules
	npm start

install: node_modules
	cp quest-api.service /etc/systemd/system/quest-api.service
	systemctl enable quest-api
	systemctl daemon-reload # is this required?
	systemctl start quest-api

node_modules: package.json
	npm install

clean:
	npm prune
	rm -rf build
	rm -rf dist

distclean: clean
	rm -rf node_modules
