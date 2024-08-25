#!/usr/bin/env node

let fs = require("flowfs");
let yargs = require("yargs");
let verify = require("../utils/verify.js");
let findAppConfig = require("../utils/findAppConfig");
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
	
	let app = findAppConfig(project, deployment);
	let local = Local(server, project, deployment);
	let remote = Remote(server, project, deployment);
	
	await local.hook("pre-deploy");
	
	await remote.checkout(ref);
	
	console.log("Creating .env file");
	
	let env = Object.entries(app.env).map(entry => entry.join("=")).join("\n") + "\n";
	
	await fs("/tmp/.env").write(env);
	
	await local.copy("/tmp/.env");
	
	await local.copySecrets();
	
	await local.copy(ECOSYSTEM);
	
	await remote.cmd("npm install");
	
	await local.hook("post-checkout");
	
	await remote.hook("pre-deploy");
	
	await remote.startOrRestart();
	
	await remote.hook("post-deploy");
	
	await local.hook("post-deploy");
})();
