const { prefix } = require('../../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'h'],
	usage: '[command name]',
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push("here's what aki taught me uwu");
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\`${prefix}help [command name]\` to get juicy details!`);

			// return message.author.send(data, { split: true })
			// 	.then(() => {
			// 		if (message.channel.type === 'dm') return;
			// 		message.reply('I\'ve sent you a DM with all my commands!');
			// 	})
			// 	.catch(error => {
			// 		console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
			// 		message.reply('it seems like I can\'t DM you!');
			// 	});
      return message.channel.send(data)
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**name:** ${command.name}`);
		if (command.aliases) data.push(`**aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**description:** ${command.description}`);
		if (command.usage) data.push(`**usage:** \`${prefix}${command.name} ${command.usage}\``);
		if (command.cooldown) data.push(`**cooldown:** ${command.cooldown} second(s)`);

		message.channel.send(data, { split: true });
	},
};