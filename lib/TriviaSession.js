const Queue = require('./Queue');
const TriviaMessenger = require('./TriviaMessenger');
const Leaderboard = require('./Leaderboard');

class TriviaSession {
  constructor(interaction, questions, durationInSeconds, delayInSeconds) {
    this.questionQueue = new Queue(questions);
    this.messenger = new TriviaMessenger(interaction);
    this.leaderboard = new Leaderboard();
    this.active = false;
    this.durationInSeconds = durationInSeconds;
    this.delayInSeconds = delayInSeconds;
  }

  async askQuestion() {
    const next = this.questionQueue.front();
    if (next) {
      await this.messenger.send(next.question);
      const correctGuesser = await this.messenger.collect(
        next.answers,
        this.durationInSeconds,
        this.delayInSeconds
      );
      if (correctGuesser) {
        this.leaderboard.updatePlayerScore(correctGuesser);
        await this.messenger.send(`${correctGuesser} got the correct answer!`);
      }
    } else {
      this.active = false;
    }
  }

  async start() {
    this.active = true;
    while (this.active) {
      await this.askQuestion();
    }
    await this.end();
  }

  async end() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2500);
    });
    await this.messenger.send(this.leaderboard.formattedStandings());
  }

  async kill() {
    this.active = false;
  }
}

module.exports = TriviaSession;
