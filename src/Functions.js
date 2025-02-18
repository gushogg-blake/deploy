let fs = require("flowfs");
let cmd = require("./utils/cmd");

module.exports = function(server, project, deployment) {
	let here = fs(__dirname);
	let root = fs(project.root);
	let serverRoot = "~/apps/" + project.name + "/" + deployment;
	
	async function remoteScript(script, run) {
		let remotePath = `/tmp/deploy-${fs(script).name}`;
		
		await copy(script, remotePath);
		await ssh(`chmod +x ${remotePath}`);
		await run(remotePath);
		await ssh(`rm ${remotePath}`);
	}
	
	async function findHook(name) {
		let hook = root.child("deploy/hooks/local", name);
		
		if (await hook.exists()) {
			return hook.path;
		} else if (await hook.withExt(".js").exists()) {
			return hook.path + ".js";
		}
		
		return null;
	}
	
	async function localHook(name) {
		let hook = await findHook(name);
		
		if (hook) {
			await cmd(`bash ${hook} ${server} ${project.name} ${deployment}`);
		}
	}
	
	async function remoteHook(name) {
		await remoteScript(here.child("remoteScripts", "hook").path, function(path) {
			return ssh(`${path} ${name} ${project.name} ${deployment}`);
		});
	}
	
	async function ssh(command) {
		await cmd(`ssh ${server} "cd ${serverRoot}; ${command}"`);
	}
	
	async function copy(local, remote=null) {
		if (!await fs(local).exists()) {
			console.log(`Copy: not found: ${local}`);
			
			return;
		}
		
		if (!remote) {
			remote = serverRoot + "/";
		}
		
		await cmd(`scp -pr ${local} ${server}:${remote}`);
	}
	
	return {
		localHook,
		remoteHook,
		remoteScript,
		copy,
		ssh,
	};
}
