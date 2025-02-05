const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    console.log(interaction);
    if (!interaction.isChatInputCommand()) return;
  
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({ content: `command ${interaction.commandName} does not exist!`, ephemeral: true });
    }
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
};