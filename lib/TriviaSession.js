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
      const questionCount =
        this.questionQueue.capacity - this.questionQueue.length;
      await this.messenger.send(
        `Question (${questionCount} of ${this.questionQueue.capacity}): ${next.question}`
      );
      const correctGuesser = await this.messenger.collect(
        next.answers,
        this.durationInSeconds,
        this.delayInSeconds
      );
      if (correctGuesser) {
        this.leaderboard.updatePlayerScore(correctGuesser);
        await this.messenger.send(`${correctGuesser} got the correct answer!`);
      } else {
        await this.messenger.send(
          `Time's up! Possible answers:\n- ${next.answers.join('\n- ')}`
        );
      }
    } else {
      this.active = false;
    }
  }

  async start() {
    this.active = true;
    while (this.active) {
      await this.askQuestion();
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, this.delayInSeconds * 1000);
      });
    }
    await this.end();
  }

  async end() {
    await this.messenger.send(this.leaderboard.formattedStandings());
  }

  async kill() {
    this.active = false;
  }
}

module.exports = TriviaSession;
