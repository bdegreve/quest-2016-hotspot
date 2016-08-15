HOST = pi@10.42.0.69

all: node_modules
	NODE_ENV=production npm run build
	
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
	rm -rf build
	rm -rf dist

distclean: clean
	rm -rf node_modules