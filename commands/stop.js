const {SlashCommandBuilder} = require('@discordjs/builders');
const SessionManager = require('~/lib/SessionManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription(
      'Stops the trivia session for the current channel, if there is one.'
    ),
  async execute(interaction) {
    const channelId = interaction.channelId;
    if (SessionManager.hasSessionFor(channelId)) {
      await interaction.reply(
        'Stopping active trivia session for the current channel.',
        {fetchReply: true}
      );
      await SessionManager.stop(channelId);
      return;
    }

    await interaction.reply(
      'No active trivia session for the current channel.',
      {fetchReply: true}
    );
  },
};
