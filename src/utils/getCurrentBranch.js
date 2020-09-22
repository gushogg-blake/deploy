let exec = require("./exec");

module.exports = async function() {
	return (await exec("git rev-parse --abbrev-ref HEAD")).trim();
}
