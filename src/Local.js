let Functions = require("./Functions");

module.exports = function(project, deployment) {
	let {
		localHook,
		copy,
	} = Functions(project, deployment);
	
	async function hook(name) {
		await localHook(name);
	}
	
	return {
		hook,
		copy,
	};
}
