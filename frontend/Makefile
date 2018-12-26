ifdef ComSpec
	RMRF=powershell function rmrf ($$path) { if (Test-Path $$path) { Remove-Item -Recurse -Force $$path } }; rmrf
else
	RMRF=rm -rf
endif

HOST = pi@raspberrypi

all: node_modules
	npm run build
	
run: node_modules
	npm start

check: node_modules
	npm test

node_modules: package.json npm-shrinkwrap.json
	npm install
	
install: all
	scp dist/* $(HOST):www/

clean:
	npm prune
	${RMRF} build
	${RMRF} dist

distclean: clean
	${RMRF} node_modules
	${RMRF} app/media

.PHONY: all run check clean distclan install