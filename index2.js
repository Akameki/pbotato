const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
client.cooldowns = new Collection();

const commandFolders = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => fs.statSync(path.join(__dirname, 'commands', file)).isDirectory());
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', folder, file));
    if (!command.data || !command.execute) {
      console.log(`[WARNING] ignoring commands/${file} because it does not have a data or execute property`);
    } else {
      client.commands.set(command.data.name, command);
    }
  }
}

const eventsFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventsFiles) {
  const event = require(path.join(__dirname, 'events', file));
  if (!event.name || !event.execute) {
    console.log(`[WARNING] ignoring events/${file} because it does not have a name or execute property`);
    continue;
  }
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.TOKEN);