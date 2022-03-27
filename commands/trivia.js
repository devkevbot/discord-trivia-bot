const {SlashCommandBuilder} = require('@discordjs/builders');
const SessionManager = require('~/lib/SessionManager');
const TriviaSession = require('~/lib/TriviaSession');
const PoolManager = require('~/lib/PoolManager');
const questions = require('~/data/questions.json');
const _ = require('lodash');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Starts a new trivia game!')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('The category of questions')
        .setRequired(true)
        .addChoices([
          ...Object.keys(_.groupBy(questions, 'category')).map((category) => [
            _.startCase(category),
            category,
          ]),
        ])
    )
    .addNumberOption((option) =>
      option
        .setName('count')
        .setDescription('The number of questions')
        .setRequired(true)
        .addChoice('5', 5)
    )
    .addNumberOption((option) =>
      option
        .setName('duration')
        .setDescription(
          'The amount of time given to answer a question, in seconds'
        )
        .setRequired(true)
        .addChoices([
          ['10', 10],
          ['20', 20],
          ['30', 30],
        ])
    )
    .addNumberOption((option) =>
      option
        .setName('delay')
        .setDescription('The time between questions, in seconds')
        .setRequired(true)
        .addChoices([
          ['10', 10],
          ['20', 20],
          ['30', 30],
        ])
    ),
  async execute(interaction) {
    const channelID = interaction.channelId;
    if (SessionManager.hasSessionFor(channelID)) {
      await interaction.reply(
        'Woah! This channel already has an active trivia session.',
        {fetchReply: true}
      );
      return;
    }

    await interaction.reply('Starting session!');

    const [category, count, answerTimeInSeconds, questionDelayInSeconds] =
      getInputArguments(interaction);

    const triviaSession = new TriviaSession(
      interaction,
      PoolManager.generateBatch(category, count),
      answerTimeInSeconds,
      questionDelayInSeconds
    );
    await SessionManager.create(channelID, triviaSession);
    await SessionManager.delete(channelID);
  },
};

function getInputArguments(interaction) {
  return [
    interaction.options.getString('category'),
    interaction.options.getNumber('count'),
    interaction.options.getNumber('duration'),
    interaction.options.getNumber('delay'),
  ];
}
