let {spawn} = require("child_process");
let {default: parseCommand} = require("string-argv");

module.exports = function(cmd, stdin=null) {
	let [command, ...args] = parseCommand(cmd.replace(/\n/g, " "));
	
	return new Promise(function(resolve, reject) {
		console.log(cmd);
		
		let child = spawn(command, args, {
			stdio: ["pipe", "inherit", "inherit"],
		});
		
		if (stdin) {
			child.stdin.write(stdin);
		}
		
		child.stdin.end();
		
		child.on("exit", function(code) {
			if (code === 0) {
				resolve();
			} else {
				reject(code);
			}
		});
	});
}
