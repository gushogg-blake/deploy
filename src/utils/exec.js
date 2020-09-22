let {exec} = require("child_process");

module.exports = function(command) {
	return new Promise(function(resolve, reject) {
		exec(command, function(error, stdout) {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}
