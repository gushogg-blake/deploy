#!/usr/bin/env node

let yargs = require("yargs");
let verify = require("../utils/verify.js");
let getCurrentBranch = require("../utils/getCurrentBranch");
let project = require("../__project");
let {ECOSYSTEM} = require("../filenames");
let Local = require("../Local");
let Remote = require("../Remote");

/*
assumes:

- project created
- database created
- nginx vhost created
*/

(async function() {
	let [server, deployment] = yargs.argv._;
	let ref = await getCurrentBranch();
	
	verify.appInEcosystem(project, deployment);
	
	let local = Local(server, project, deployment);
	let remote = Remote(server, project, deployment);
	
	await local.hook("pre-deploy");
	
	await remote.checkout(ref);
	
	await local.copySecrets();
	await local.copy(".env");
	
	if (project.ecosystem) {
		await local.copy(ECOSYSTEM);
	}
	
	await remote.cmd("npm install");
	
	await local.hook("post-checkout");
	
	await remote.hook("pre-deploy");
	
	await remote.startOrRestart();
	
	await remote.hook("post-deploy");
	
	await local.hook("post-deploy");
})();
