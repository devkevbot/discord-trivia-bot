const Messenger = require('./Messenger');

class TriviaMessenger extends Messenger {
  constructor(interaction) {
    super(interaction);
  }

  async collect(acceptedAnswers, durationInSeconds) {
    const userAnswers = await this.interaction.channel.awaitMessages({
      filter: (response) =>
        acceptedAnswers.some(
          (answer) => answer.toLowerCase() === response.content.toLowerCase()
        ),
      time: durationInSeconds * 1000,
      max: 1,
    });
    return userAnswers.first()?.author ?? '';
  }
}

module.exports = TriviaMessenger;
