class TriviaSession {
  #interaction;
  #questions;
  #currentQuestionNum;
  #leaderboard;

  constructor(interaction, questions) {
    this.#interaction = interaction;
    this.#questions = questions;
    this.#currentQuestionNum = 1;
    this.#leaderboard = {};
  }

  #currentQuestion() {
    return this.#questions[this.#currentQuestionNum - 1].question;
  }

  #currentAnswer() {
    return [...this.#questions[this.#currentQuestionNum - 1].answers];
  }

  #incrementCurrentQuestionNum() {
    this.#currentQuestionNum += 1;
  }

  /**
   * Checks whether a user's answer to the current question is correct.
   * @param {string} response A user's response to the current question.
   * @returns {boolean} The correctness of the user's answer.
   */
  #filter = (response) => {
    return this.#currentAnswer().some(
      (answer) => answer.toLowerCase() === response.content.toLowerCase()
    );
  };

  async #collectUserAnswers() {
    const collected = await this.#interaction.channel.awaitMessages({
      filter: this.#filter,
      max: 1,
      time: 5000,
      errors: ['time'],
    });
    return collected;
  }

  /**
   * Sends a message to the channel indicating which user got an answer.
   * @param {string} author The user who submitted the correct answer
   * @param {string} answerTimeInSeconds The time taken to answer the question, in seconds.
   */
  async #postCorrectAnswerMessage(author, answerTimeInSeconds) {
    await this.#interaction.followUp(
      `${author} got the correct answer in ${answerTimeInSeconds}s!`
    );
  }

  /**
   * Sends a message to the channel indicating that no user got an
   * answer and what the correct answer(s) are.
   */
  async #postTimeIsUpMessage() {
    this.#interaction.followUp(
      `Time is up! Correct answer(s): \n${this.#currentAnswer()
        .map((a) => `- ${a}`)
        .join('\n')}`
    );
  }

  /**
   * Checks if another question is available for the trivia session.
   * @returns {boolean} Whether the trivia session has another question.
   */
  hasNextQuestion() {
    return this.#currentQuestionNum - 1 < this.#questions.length;
  }

  /**
   * Asks the next trivia session question. Callers should use
   * `hasNextQuestion` to ensure that a question exists.
   */
  async askQuestion() {
    await this.#interaction.channel.send(
      `Question #${this.#currentQuestionNum} of ${
        this.#questions.length
      }: ${this.#currentQuestion()}`
    );

    const answerTimeCounter = process.hrtime();

    try {
      const userAnswers = await this.#collectUserAnswers();
      const answerTimeInSeconds = process.hrtime(answerTimeCounter)[0];
      await this.#postCorrectAnswerMessage(
        userAnswers.first().author,
        answerTimeInSeconds
      );
    } catch {
      await this.#postTimeIsUpMessage();
    } finally {
      this.#incrementCurrentQuestionNum();
    }
  }
}

module.exports = TriviaSession;
