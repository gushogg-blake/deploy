let {ECOSYSTEM} = require("../filenames");
let error = require("./error");

module.exports = {
	appInEcosystem(project, deployment) {
		let appName = project.name + "-" + deployment;
		
		if (!project.ecosystem.apps.some(app => app.name === appName)) {
			error("No app " + appName + " found in " + ECOSYSTEM);
		}
	},
};
