let {ECOSYSTEM} = require("../filenames");
let findAppConfig = require("./findAppConfig");
let error = require("./error");

module.exports = {
	appInEcosystem(project, deployment) {
		if (project.ecosystem && !findAppConfig(project, deployment)) {
			error(`No app ${project.name}-${deployment} found in ${ECOSYSTEM}`);
		}
	},
};
