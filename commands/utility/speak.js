const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('make me speak')
		.addIntegerOption(option =>
			option
        .setName('amount')
        .setDescription('how much should i speak?')
    ),
	async execute(interaction) {
		const times = Math.min(interaction.options.getInteger('amount') ?? 1, 997);
    await interaction.reply('u' + 'wu'.repeat(times) + ' :3');
	},
};