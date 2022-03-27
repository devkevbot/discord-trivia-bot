const Messenger = require('./Messenger');

class TriviaMessenger extends Messenger {
  constructor(interaction) {
    super(interaction);
  }

  async collect(answers, durationInSeconds, delayInSeconds) {
    const collector = this.interaction.channel.createMessageCollector({
      filter: (response) =>
        answers.some(
          (answer) => answer.toLowerCase() === response.content.toLowerCase()
        ),
      time: durationInSeconds * 1000,
      max: 1,
    });

    let correctGuesser = '';

    collector.on('collect', (m) => {
      correctGuesser = m.author;
      console.log(`Collected ${m.content}`);
    });

    collector.on('end', (collected) => {
      console.log(`Collected ${collected.size} items`);
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(correctGuesser);
      }, delayInSeconds * 1000);
    });
  }
}

module.exports = TriviaMessenger;
