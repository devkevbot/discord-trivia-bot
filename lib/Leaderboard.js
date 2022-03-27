class Leaderboard {
  constructor() {
    this.leaderboard = new Map();
    this.pointsPerAnswer = 5;
  }

  updatePlayerScore(player) {
    const currentScore = this.leaderboard.get(player);
    if (currentScore) {
      this.leaderboard.set(player, currentScore + this.pointsPerAnswer);
      return;
    }
    this.leaderboard.set(player, this.pointsPerAnswer);
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
