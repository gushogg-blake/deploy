let fs = require("flowfs");
let {ECOSYSTEM} = require("./filenames");
let Functions = require("./Functions");

module.exports = function(server, project, deployment) {
	let here = fs(__dirname);
	
	let {
		remoteHook,
		remoteScript,
		ssh,
	} = Functions(server, project, deployment);
	
	async function checkout(ref) {
		console.log(`Remote: checkout ${ref}`);
		
		await remoteScript(here.child("remoteScripts", "checkout").path, function(path) {
			return ssh(`${path} ${project.name} ${deployment} ${ref}`);
		});
	}
	
	async function hook(name) {
		await remoteHook(name);
	}
	
	async function run(command) {
		await ssh(command);
	}
	
	async function startOrRestart() {
		if (!project.ecosystem) {
			return;
		}
		
		await ssh(`pm2 startOrRestart ${ECOSYSTEM} --only ${project.name}-${deployment}`);
	}
	
	return {
		hook,
		cmd: run,
		checkout,
		startOrRestart,
	};
}
