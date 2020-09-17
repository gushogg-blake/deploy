let Functions = require("./Functions");

module.exports = function(server, project, deployment) {
	let {
		localHook,
		copy,
	} = Functions(server, project, deployment);
	
	async function hook(name) {
		await localHook(name);
	}
	
	return {
		hook,
		copy,
	};
}
