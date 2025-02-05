const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

// read all files in subdirectories of command directory
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', folder, file));
    if (command.data) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] ignoring ${file} because it does not have a data property`);
    }
  }
}

client.once(Events.ClientReady, (x) => {
  console.log(`ready, logged in as ${x.user.tag}`);
});

client.login(process.env.TOKEN);