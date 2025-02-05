module.exports = function(project, deployment) {
	return project.ecosystem?.apps.find(function(app) {
		return app.name === project.name + "-" + deployment;
	});
}
