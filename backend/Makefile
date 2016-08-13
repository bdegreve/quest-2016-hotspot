all: node_modules
	npm start

check: node_modules
	npm test

node_modules: package.json npm-shrinkwrap.json
	npm install

clean:
	npm prune
	rm -rf build
	rm -rf dist

distclean: clean
	rm -rf node_modules