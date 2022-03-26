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
    )
    .addNumberOption((option) =>
      option
        .setName('duration')
        .setDescription(
          'The amount of time given to answer a question, in seconds'
        )
        .setRequired(true)
        .addChoice('10', 10)
        .addChoice('20', 20)
        .addChoice('30', 30)
    )
    .addNumberOption((option) =>
      option
        .setName('delay')
        .setDescription('The time between questions, in seconds')
        .setRequired(true)
        .addChoice('10', 10)
        .addChoice('20', 20)
        .addChoice('30', 30)
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

    const [category, count, answerTimeInSeconds, questionDelayInSeconds] =
      getInputArguments(interaction);

    const questions = PoolManager.generateBatch(category, count);

    const triviaSession = new TriviaSession(
      interaction,
      questions,
      answerTimeInSeconds
    );

    while (triviaSession.hasNextQuestion()) {
      await triviaSession.askQuestion();
      await wait(questionDelayInSeconds);
    }

    await triviaSession.endSession();
    sessionManager.deleteSession(interaction.user.id);
  },
};

/**
 * Wait for s seconds.
 * @param {number} s The amount of seconds to wait
 */
function wait(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

function getInputArguments(interaction) {
  return [
    interaction.options.getString('category'),
    interaction.options.getNumber('count'),
    interaction.options.getNumber('duration'),
    interaction.options.getNumber('delay'),
  ];
}
