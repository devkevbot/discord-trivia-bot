class Leaderboard {
  #interaction;
  #leaderboard;

  static pointsPerAnswer = 5;

  constructor(interaction) {
    this.#interaction = interaction;
    this.#leaderboard = new Map();
  }

  updatePlayerScore(userID) {
    const currentScore = this.#leaderboard.get(userID);
    if (currentScore) {
      this.#leaderboard.set(userID, currentScore + Leaderboard.pointsPerAnswer);
      return;
    }
    this.#leaderboard.set(userID, Leaderboard.pointsPerAnswer);
  }

  #sortLeaderboard() {
    const sortedLeaderboard = new Map(
      [...this.#leaderboard.entries()].sort((a, b) => b[1] - a[1])
    );
    return sortedLeaderboard;
  }

  /**
   * Returns a string representation of the leaderboard when it is
   * non-empty.
   */
  #formatStandingsMessage() {
    const sortedLeaderboard = this.#sortLeaderboard();
    let playerPosition = 0;
    const message = Array.from(sortedLeaderboard, ([player, score]) => {
      playerPosition += 1;
      return `${playerPosition}. ${player}: ${score} points`;
    }).join('\n');
    return message;
  }

  /**
   * Returns a string representation of the leaderboard when it is empty.
   */
  #formatEmptyStandingMessage() {
    return 'No one answered correctly!';
  }

  /**
   * Prints out the leaderboard information in descending order of
   * player score.
   */
  async postLeadboardMessage() {
    const standingsMessage =
      this.#leaderboard.size === 0
        ? this.#formatEmptyStandingMessage()
        : this.#formatStandingsMessage();

    await this.#interaction.channel.send(
      `Leaderboard standings:\n${standingsMessage}`
    );
  }
}

module.exports = Leaderboard;
