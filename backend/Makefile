ifdef ComSpec
	RMRF=powershell function rmrf ($$path) { if (Test-Path $$path) { Remove-Item -Recurse -Force $$path } }; rmrf
else
	RMRF=rm -rf
endif

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

node_modules: package.json npm-shrinkwrap.json
	npm install

clean:
	npm prune
	${RMRF} build
	${RMRF} dist

distclean: clean
	${RMRF} node_modules

.PHONY: all run check clean distclan install