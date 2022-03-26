/**
 * Manages user sessions by keeping track of which users have an active
 * trivia session.
 */
class SessionManager {
  #sessions;

  constructor() {
    this.#sessions = new Map();
  }

  /**
   * Returns whether the channel has an active session.
   * @param {string} channelID
   * @returns {boolean}
   */
  hasSessionFor(channelID) {
    return this.#sessions.has(channelID);
  }

  /**
   * Creates a new session for the given channel if it don't already have
   * an active session.
   * @param {string} channelID
   */
  async create(channelID, triviaSession) {
    if (this.hasSessionFor(channelID)) {
      return;
    }

    try {
      this.#sessions.set(channelID, triviaSession);
      await triviaSession.start();
    } catch (error) {
      console.log(`Failed to start trivia session: ${error}`);
    }
  }

  #get(channelID) {
    return this.#sessions.get(channelID);
  }

  /**
   * Deletes a session for the given channelID, if it exists.
   * @param {string} channelID
   */
  async delete(channelID) {
    if (this.hasSessionFor(channelID)) {
      try {
        await this.#get(channelID).end();
        this.#sessions.delete(channelID);
      } catch (error) {
        console.log(`Failed to delete trivia session: ${error}`);
      }
    }
  }
}

module.exports = new SessionManager();
