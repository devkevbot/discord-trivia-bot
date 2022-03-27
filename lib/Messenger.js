class Messenger {
  constructor(interaction) {
    this.interaction = interaction;
  }

  async send(message) {
    await this.interaction.channel.send(message);
  }

  async followUp(message) {
    await this.interaction.followUp(message);
  }
}

module.exports = Messenger;
