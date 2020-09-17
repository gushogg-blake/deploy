#!/usr/bin/env node

let fs = require("flowfs");
let yargs = require("yargs");
let verify = require("../utils/verify.js");
let findAppConfig = require("../utils/findAppConfig");
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
	let [server, deployment, ref="master"] = yargs.argv._;
	
	verify.appInEcosystem(project, deployment);
	
	let app = findAppConfig(project, deployment);
	let local = Local(server, project, deployment);
	let remote = Remote(server, project, deployment);
	
	console.log("Pre-deploy hook");
	
	await local.hook("pre-deploy");
	
	console.log("Remote: checking out repo");
	
	await remote.checkout(ref);
	
	console.log("Creating .env file");
	
	let env = Object.entries(app.env).map(entry => entry.join("=")).join("\n") + "\n";
	
	await fs("/tmp/.env").write(env);
	
	console.log("Copying .env file");
	
	await local.copy("/tmp/.env");
	
	if (await fs("deploy/secrets").exists()) {
		console.log("Copying secrets");
		
		await local.copy("deploy/secrets", "secrets/" + project.name);
	}
	
	console.log("Copying ecosystem file");
	
	await local.copy(ECOSYSTEM);
	
	console.log("Remote: npm install");
	
	await remote.cmd("npm install");
	
	console.log("Post-checkout hook");
	
	await local.hook("post-checkout");
	
	console.log("Remote: pre-deploy hook");
	
	await remote.hook("pre-deploy");
	
	console.log("Remote: start/restart");
	
	await remote.startOrRestart();
})();
