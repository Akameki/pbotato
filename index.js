const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
require('discord-reply');
const { prefix, token } = require('./config.json');
const { aliases } = require('./commands/fun/pic');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const priv = '246394993151967233';  // p
const shxt = '855733554942836736';  // shxt

// SLASH COMMANDS STUFFS 
const getApp = (guildId) => { const app = client.api.applications(client.user.id); if (guildId) app.guilds(guildId); return app; }


client.once('ready', async () => {
  console.log('ready!!');
  const displayCommands = async id => { const commands = await getApp(id).commands.get(); for (const { id, name, description } of commands) { console.log(` ${id} ${name} - '${description}'`); } }

  // await getApp().commands('858579920862707722').delete(); // DELETE COMMAND
  // await getApp(priv).commands('858570758148980767').delete(); // DELETE COMMAND
  // await getApp(priv).commands('859817698326216744').delete(); // DELETE COMMAND


  {
    // const ggg = null;
    // await getApp(ggg).commands.post({
    //   data: {
    //     name: 'cspot',
    //     description: 'copy paste some beautiful spotify url!',
    //     options: [
    //       {
    //         name: 'spotify-urls',
    //         description: 'uwu',
    //         required: true,
    //         type: 3
    //       },
    //     ]
    //   }
    // })
    // await getApp(ggg).commands.post({
    //   data: {
    //     name: 'spot',
    //     description: 'make ur spotify url beautiful!',
    //     options: [
    //       {
    //         name: 'spotify-urls',
    //         description: 'uwu',
    //         required: true,
    //         type: 3
    //       },
    //     ]
    //   }
    // })
    // 
    // console.log("GLOBAL");
    // await displayCommands();
    // console.log("PRIV");
    // await displayCommands(priv);
    // console.log("SHXT");
    // await displayCommands(shxt);
  }

  const reply = (interaction, msg) => { client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: { content: msg } } }) }

  /* SLASH COMMAND HANDLER */

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const { name, options } = interaction.data
    // console.log(interaction);
    const command = name.toLowerCase();

    // set up args object to hold args
    const args = {};
    if (options)
      for (const option of options)
        args[option.name] = option.value;

    // console.log(args);

    if (command === 'spot' || command === 'cspot') {
      // console.log(author);
      console.log(`someone called /${command}`)
      const code = command === 'cspot';
      const URL_REGEX = /^https:\/\/open.spotify.com\/.+\/.+$/;
      let text = [];
      for (const dirtyURL of args['spotify-urls'].split(' ')) {
        if (!dirtyURL) continue;
        if (dirtyURL.match(URL_REGEX)) {
          const cleanURL = dirtyURL.split('?si=')[0];
          const discordURI = `<${cleanURL.replace('https://open.spotify.com/', 'spotify://')}>`;
          text.push(`${discordURI} • ${cleanURL}`)
        } else {
          text.push(`wtf is '${dirtyURL}'?`);
        }
      }
      text = text.join('\n');
      if (code) text = "```" + text + "```";
      reply(interaction, text);
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

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  /* NEW djs 13 stuff not yet available 

  if (!client.application?.owner) await client.application?.fetch(); // idk what this is

  if (message.content.toLowerCase() === '$deploy' && message.author.id === client.application?.owner.id) {
    const data = [
      {
        name: 'cspot',
        description: 'copy paste some beautiful spotify url!',
        options: [
          {
            name: 'spotify-url(s)',
            description: 'uwu',
            required: true,
            type: 3
          },
        ]
      },
      {
        name: 'spot',
        description: 'makes ur spotify url beautiful!',
        options: [
          {
            name: 'spotify-url(s)',
            description: 'uwu',
            required: true,
            type: 3
          },
        ]
      },
    ];

    const command = await client.guilds.cache.get(priv)?.commands.set(data);
    // const command = await client.application?.commands.create(data);
    console.log(command);

    */

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
    message.cmd = commandName;
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('i broke :(');
  }
});




client.login(process.env.TOKEN);