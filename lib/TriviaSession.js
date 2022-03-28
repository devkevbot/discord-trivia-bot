const Queue = require('./Queue');
const TriviaMessenger = require('./TriviaMessenger');
const Leaderboard = require('./Leaderboard');

class TriviaSession {
  constructor(interaction, questions, durationInSeconds, delayInSeconds) {
    this.queue = new Queue(questions);
    this.messenger = new TriviaMessenger(interaction);
    this.leaderboard = new Leaderboard();
    this.active = false;
    this.durationInSeconds = durationInSeconds;
    this.delayInSeconds = delayInSeconds;
  }

  curentQuestionNum() {
    return this.queue.capacity - this.queue.length;
  }

  async handleCorrectAnswer(player) {
    this.leaderboard.updatePlayerScore(player);
    await this.messenger.send(`${player} got the correct answer!`);
  }

  async handleNoCorrectAnswer(correctAnswers) {
    await this.messenger.send(
      `Time's up! Possible answers:\n- ${correctAnswers.join('\n- ')}`
    );
  }

  async askQuestion() {
    const next = this.queue.front();
    if (!next) {
      this.active = false;
      return;
    }

    await this.messenger.send(
      `Question (${this.curentQuestionNum()} of ${this.queue.capacity}): ${
        next.question
      }`
    );

    const firstCorrectPlayer = await this.messenger.collect(
      next.answers,
      this.durationInSeconds
    );

    firstCorrectPlayer
      ? await this.handleCorrectAnswer(firstCorrectPlayer)
      : await this.handleNoCorrectAnswer(next.answers);
  }

  async pauseBetweenQuestions() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.delayInSeconds * 1000);
    });
  }

  async start() {
    this.active = true;
    while (this.active) {
      await this.askQuestion();
      await this.pauseBetweenQuestions();
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
