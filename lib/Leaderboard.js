class Leaderboard {
  static pointsPerAnswer = 5;

  constructor() {
    this.leaderboard = new Map();
  }

  updatePlayerScore(userID) {
    const currentScore = this.leaderboard.get(userID);
    if (currentScore) {
      this.leaderboard.set(userID, currentScore + Leaderboard.pointsPerAnswer);
      return;
    }
    this.leaderboard.set(userID, Leaderboard.pointsPerAnswer);
  }

  sortLeaderboard() {
    const sortedLeaderboard = new Map(
      [...this.leaderboard.entries()].sort((a, b) => b[1] - a[1])
    );
    return sortedLeaderboard;
  }

  formatStandingsMessage() {
    const sortedLeaderboard = this.sortLeaderboard();
    let playerPosition = 0;
    const message = Array.from(sortedLeaderboard, ([player, score]) => {
      playerPosition += 1;
      return `${playerPosition}. ${player}: ${score} points`;
    }).join('\n');
    return message;
  }

  formatEmptyStandingMessage() {
    return 'No one answered correctly!';
  }

  formattedStandings() {
    const message =
      this.leaderboard.size === 0
        ? this.formatEmptyStandingMessage()
        : this.formatStandingsMessage();
    return `Leaderboard:\n${message}`;
  }
}

module.exports = Leaderboard;
