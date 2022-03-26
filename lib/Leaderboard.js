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
   * Prints out the leaderboard information in descending order of
   * player score.
   */
  async postLeadboardMessage() {
    const sortedLeaderboard = this.#sortLeaderboard();
    let playerPosition = 0;
    const message = Array.from(sortedLeaderboard, ([player, score]) => {
      playerPosition += 1;
      return `${playerPosition}. ${player}: ${score} points`;
    }).join('\n');
    await this.#interaction.channel.send(`Leaderboard standings:\n${message}`);
  }
}

module.exports = Leaderboard;
