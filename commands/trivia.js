const {SlashCommandBuilder} = require('@discordjs/builders');
const SessionManager = require('../lib/SessionManager');
const PoolManager = require('../lib/PoolManager');

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

    sessionManager.createSession(interaction.user.id);

    await interaction.reply('Starting session!');

    const category = interaction.options.getString('category');
    const count = interaction.options.getNumber('count');
    const questionPool = PoolManager.generateBatch(category, count);

    let questionNumber = 1;

    for (const selected of questionPool) {
      await askQuestion(
        interaction,
        selected,
        questionNumber,
        questionPool.length
      );
    }

    sessionManager.deleteSession(interaction.user.id);
  },
};

async function askQuestion(
  interaction,
  selected,
  questionNumber,
  questionCount
) {
  const filter = (response) => {
    return selected.answers.some(
      (answer) => answer.toLowerCase() === response.content.toLowerCase()
    );
  };

  await interaction.channel.send(
    `Question #${questionNumber} of ${questionCount}: ${selected.question}`
  );

  const answerTime = process.hrtime();

  try {
    const collected = await interaction.channel.awaitMessages({
      filter,
      max: 1,
      time: 5000,
      errors: ['time'],
    });
    const timeTaken = process.hrtime(answerTime)[0];
    await interaction.followUp(
      `${collected.first().author} got the correct answer in ${timeTaken}s!`
    );
  } catch {
    interaction.followUp(
      `Time is up! Correct answer(s): \n${selected.answers
        .map((a) => `- ${a}`)
        .join('\n')}`
    );
  }
}
