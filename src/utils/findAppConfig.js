module.exports = function(project, deployment) {
	return project.ecosystem.apps.filter(function(app) {
		return app.name === project.name + "-" + deployment;
	})[0];
}
