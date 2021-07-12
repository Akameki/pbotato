module.exports = {
	name: 'talk',
	execute(message, args) {
		let times = 1;
		let uwu = "uw";
		if (Number(args[0])) {
			times = Math.min(900, Number(args[0]));
			for (let i = 0; i < times; i++) {
				uwu += "uw";
			}
		}
		message.channel.send(uwu+"u");
	},
};