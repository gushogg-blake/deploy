let fs = require("flowfs");
let {ECOSYSTEM} = require("./filenames");
let Functions = require("./Functions");

module.exports = function(server, project, deployment) {
	let here = fs(__dirname);
	
	let {
		remoteHook,
		remoteScript,
		ssh,
	} = Functions(project, deployment);
	
	async function checkout(ref) {
		await remoteScript(server, here.child("remoteScripts", "checkout").path, function(path) {
			return ssh(`${path} ${project.name} ${deployment} ${ref}`);
		});
	}
	
	async function hook(name) {
		await remoteHook(name);
	}
	
	async function run(command) {
		await ssh(server, command);
	}
	
	async function startOrRestart() {
		await ssh(`pm2 startOrRestart ${ECOSYSTEM} --only ${deployment}`);
	}
	
	return {
		hook,
		cmd: run,
		checkout,
		startOrRestart,
	};
}
