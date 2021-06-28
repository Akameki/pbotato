const quote = "talented, brilliant, incredible, amazing, show stopping, spectacular, never the same, totally unique, completely not ever been done before, unafraid to reference or not reference, put it in a blender, shit on it, vomit on it, eat it, give birth to it "

module.exports = {
	name: 'talented',
	execute(message, args) {
		message.channel.send(quote);
	},
};