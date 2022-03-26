const {SlashCommandBuilder} = require('@discordjs/builders');
const SessionManager = require('~/lib/SessionManager');
const TriviaSession = require('~/lib/TriviaSession');
const PoolManager = require('~/lib/PoolManager');

const sessionManager = new SessionManager();

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
    ),
  async execute(interaction) {
    if (sessionManager.sessionExists(interaction.user.id)) {
      await interaction.reply(
        'Woah! Please finish your current trivia session before attempting to start another.',
        {fetchReply: true}
      );
      return;
    }

    await interaction.reply('Starting session!');
    sessionManager.createSession(interaction.user.id);

    const category = interaction.options.getString('category');
    const count = interaction.options.getNumber('count');
    const questions = PoolManager.generateBatch(category, count);

    const triviaSession = new TriviaSession(interaction, questions);
    while (triviaSession.hasNextQuestion()) {
      await triviaSession.askQuestion();
    }

    await triviaSession.endSession();
    sessionManager.deleteSession(interaction.user.id);
  },
};
