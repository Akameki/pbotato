const { Events, MessageFlags } = require('discord.js');
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered interaction ${interaction.commandName ?? ''}`);
    if (!interaction.isChatInputCommand()) return;
  
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({ content: `command ${interaction.commandName} does not exist!`, ephemeral: true });
    }

    if (command.cooldown) {
      const { cooldowns } = interaction.client;
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const cooldownAmount = command.cooldown * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({ content: `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`, ephemeral: true });
        } else {
          timestamps.set(interaction.user.id, now);
          setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        }
      }
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