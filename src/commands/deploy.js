#!/usr/bin/env node

let fs = require("flowfs");
let yargs = require("yargs");
let error = require("../utils/error");
let Local = require("../Local");
let Remote = require("../Remote");
let {ECOSYSTEM} = require("../filenames");
let ecosystem = require("../ecosystem");
let project = require("../package").name;

/*
assumes:

- project created
- database created
- nginx vhost created
*/

(async function() {
	let [deployment, ref="master"] = yargs.argv._;
	let appName = project + "-" + deployment;
	let local = new Local(project, deployment);
	let remote = new Remote(project, deployment, ref);
	
	if (!ecosystem.apps.some(app => app.name === appName)) {
		error("No app " + appName + " found in " + ECOSYSTEM);
	}
	
	await local.hook("pre-deploy");
	
	await remote.checkout();
	
	await local.copySecrets();
	
	await local.copy(ECOSYSTEM);
	
	await remote.command("npm install");
	
	await remote.hook("pre-deploy");
	
	await remote.startOrRestart();
})();
