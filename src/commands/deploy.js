#!/usr/bin/env node

let fs = require("flowfs");
let yargs = require("yargs");
let project = require("../__project");
let Local = require("../Local");
let Remote = require("../Remote");
let {ECOSYSTEM} = require("./filenames");

/*
assumes:

- project created
- database created
- nginx vhost created
*/

(async function() {
	let [server, deployment, ref="master"] = yargs.argv._;
	
	verify.appInEcosystem(project, deployment);
	
	let local = Local(project, deployment);
	let remote = Remote(server, project, deployment);
	
	await local.hook("pre-deploy");
	
	await remote.checkout();
	
	await local.copy(server, "secrets");
	
	await local.copy(server, ECOSYSTEM);
	
	await remote.cmd("npm install");
	
	await remote.hook("pre-deploy");
	
	await remote.startOrRestart();
})();
