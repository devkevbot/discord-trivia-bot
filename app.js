const fs = require('fs');
const {Client, Collection, Intents} = require('discord.js');
require('module-alias/register');
require('dotenv').config();

function initClient() {
  return new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });
}

function registerCommands(client) {
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  }
}

function registerEventHandlers(client) {
  const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

function runStartHooks(hooks) {
  hooks.forEach((hook) => hook());
}

function run() {
  const client = initClient();
  registerCommands(client);
  registerEventHandlers(client);
  runStartHooks([() => client.login(process.env.DISCORD_BOT_TOKEN)]);
}

module.exports = {run};
