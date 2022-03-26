const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {questions} = require('../data/questions.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Starts a new trivia game!')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('The category of questions')
        .setRequired(true)
        .addChoice('History', 'history')
    )
    .addNumberOption((option) =>
      option
        .setName('count')
        .setDescription('The number of questions')
        .setRequired(true)
        .addChoice('5', 5)
        .addChoice('10', 10)
    ),
  async execute(interaction) {
    const category = interaction.options.getString('category');
    // console.log(interaction.options.getString('category'));
    // console.log(interaction.options.getNumber('count'));
    const filteredQuestions = questions.filter((q) => q.category === category);
    // await interaction.channel.send();
    await interaction.reply({
      embeds: [
        createQuestionEmbed({
          category,
          question: filteredQuestions[0].question,
        }),
      ],
    });
  },
};

function createQuestionEmbed({category, question}) {
  return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Question X of Y')
    .setAuthor({
      name: 'Trivia Bot',
    })
    .setDescription(question)
    .addField('Category', category, true)
    .setTimestamp();
}

// function handleOption(interaction, optionName) {
//   const option = interaction.options.get(optionName);
// }

// client.commands = new Collection();
// const commandFiles = fs
//   .readdirSync('./commands')
//   .filter((file) => file.endsWith('.js'));

// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   client.commands.set(command.data.name, command);
// }
