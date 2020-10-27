let fs = require("flowfs");
let Functions = require("./Functions");

module.exports = function(server, project, deployment) {
	let {
		localHook,
		copy,
		ssh,
	} = Functions(server, project, deployment);
	
	let serverRoot = "~/apps/" + project.name + "/" + deployment;
	
	async function hook(name) {
		await localHook(name);
	}
	
	async function copySecrets() {
		if (await fs("deploy/secrets").exists()) {
			await ssh(`rm -rf ${serverRoot}/deploy/secrets`);
			await copy("deploy/secrets", serverRoot + "/deploy/secrets");
		}
	}
	
	return {
		hook,
		copy,
		copySecrets,
	};
}
