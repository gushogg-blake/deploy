let fs = require("flowfs");
let cmd = require("./utils/cmd");

module.exports = function(server, project, deployment) {
	let here = fs(__dirname);
	let root = fs(project.root);
	let serverRoot = "~/apps/" + project.name + "/" + deployment;
	
	async function remoteScript(script, run) {
		let remotePath = `/tmp/deploy-${fs(script).name}}`;
		
		await copy(script, remotePath);
		await ssh(`chmod +x ${remotePath}`);
		await run(remotePath);
		await ssh(`rm ${remotePath}`);
	}
	
	async function findHook(where, name) {
		let hook = root.child("hooks", where, name);
		
		if (await hook.exists()) {
			return hook.path;
		} else if (await hook.withExt(".js").exists()) {
			return hook.path + ".js";
		}
		
		return null;
	}
	
	async function localHook(name) {
		let hook = await findHook("local", name);
		
		if (hook) {
			await cmd(`${hook} ${deployment}`);
		}
	}
	
	async function remoteHook(name) {
		await remoteScript(here.child("remoteScripts", "run-hook").path, function(path) {
			return ssh(`${path} ${name} ${deployment}`);
		});
	}
	
	async function ssh(command) {
		await cmd(`ssh ${server} "cd ${serverRoot}; ${command}"`);
	}
	
	async function copy(local, remote=null) {
		await cmd(`scp -pr ${local} ${server}:${remote || serverRoot + "/"}`);
	}
	
	return {
		localHook,
		remoteHook,
		remoteScript,
		copy,
		ssh,
	};
}
