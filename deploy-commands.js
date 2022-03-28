const fs = require('fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
require('module-alias/register');
require('dotenv').config();

const commands = [];
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_BOT_TOKEN);

const env = process.argv[2];
if (env === 'production') {
  console.log('Deploying commands to production!');
} else {
  console.log('Deploying commands to development!');
}

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      env === 'production'
        ? process.env.PRODUCTION_GUILD_ID
        : process.env.DEVELOPMENT_GUILD_ID
    ),
    {
      body: commands,
    }
  )
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
