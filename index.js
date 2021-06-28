const fs = require('fs');
require('dotenv').config()
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { aliases } = require('./commands/fun/pic');

const client = new Discord.Client();
client.commands = new Discord.Collection();



/* SLASH COMMANDS STUFFS */
const getApp = (guildId) => {
  const app = client.api.applications(client.user.id);
  if (guildId) app.guilds(guildId);
  return app;
}

let testGuildId = undefined;
testGuildId = '246394993151967233'; // p
// testGuildId = '855733554942836736'; // shxt
client.once('ready', async () => {
  console.log('ready!!');

  const commands = await getApp(testGuildId).commands.get();
  // console.log(commands);
  // await getApp(testGuildId).commands('858564287885738004').delete(); // DELETE COMMAND
  await getApp(testGuildId).commands.post({
    data: {
      name: 'spot',
      description: 'make ur spotify url beautiful!',
      options: [
        {
          name: 'spotify-url',
          description: 'uwu',
          required: true,
          type: 3
        }
      ]
    }
  })

  const reply = (interaction, res) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: res
        }
      }
    })
  }

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const { name, options } = interaction.data
    const command = name.toLowerCase();

    // set up args object to hold args
    const args = {};
    if (options) {
      for (const option of options) {
        const { name: name, value } = option;
        args[name] = value;
      }
    }
    // console.log(args);

    if (command === 'spot') {
      const URL_REGEX = /^https:\/\/open.spotify.com\/.+\/.+$/;
      const dirtyURL = args['spotify-url'];
      if (dirtyURL.match(URL_REGEX)) {
        const cleanURL = dirtyURL.split('?si=')[0];
        const discordURI = `<${cleanURL.replace('https://open.spotify.com/', 'spotify://')}>`;
        reply(interaction, `${discordURI} • ${cleanURL}`);
      } else {
        reply(interaction, `wtf is '${dirtyURL}'??`);
      }
    }
  })
});

/* COMMAND HANDLING */
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)
      || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // aliases

  if (!command) return; // message was not a bot command?
  console.log(`${message.author.username} called ${command.name} in a ${message.channel.type} channel at ${message.createdAt.toLocaleDateString()} ${message.createdAt.toLocaleTimeString()}`)

  if (command.guildOnly && message.channel.type === 'dm') return message.reply('type this in a server pls c:'); // guild only?
  if (command.args && !args.length) { // no arg provided when needed?
    let reply = `u didn't provide any arguments !! `;
    if (command.usage) reply += `use me like this: \`${prefix}${command.name} ${command.usage}\``
    return message.reply(reply);
  }
  
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('i broke :(');
	}
});




client.login(process.env.TOKEN);