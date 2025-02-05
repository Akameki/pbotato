const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const commands = [];

const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', folder, file));

    /* all commands */
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    }

    /* specific command */
    // if (command?.data?.name === 'ping') {
    //   commands.push(command.data.toJSON());
    // }
  }
}

const rest = new REST().setToken(process.env.TOKEN);

const guildId = "SERVER ID HERE";

(async () => {
  try {

    /* guild commands, avoid duplicating with global commands? */
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
      { body: commands },
    );

    /* global commands */
    // await rest.put(
    //   Routes.applicationCommands(clientId),
    //   { body: commands },
    // )

    console.log(`Successfully reloaded/deployed ${commands.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
