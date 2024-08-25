let fs = require("fs");
let flowfs = require("flowfs");
let error = require("./utils/error");
let {PACKAGE, ECOSYSTEM} = require("./filenames");

let dir = flowfs();

while (!fs.existsSync(dir.child(PACKAGE).path)) {
	if (dir.isRoot) {
		error("No " + PACKAGE + " found");
	} else {
		dir = dir.parent;
	}
}

let root = dir.path;
let ecosystem = fs.existsSync(dir.child(ECOSYSTEM).path) ? require(root + "/" + ECOSYSTEM) : null;
let package = require(root + "/" + PACKAGE);

module.exports =  {
	ecosystem,
	package,
	name: package.name,
	root,
};
