/**
 * Manages user sessions by keeping track of which users have an active
 * trivia session.
 */
class SessionManager {
  #sessions;

  constructor() {
    this.#sessions = new Set();
  }

  /**
   * Returns whether the user has an active session.
   * @param {string} userID
   * @returns {boolean}
   */
  sessionExists(userID) {
    return this.#sessions.has(userID);
  }

  /**
   * Creates a new session for the given user if they don't already have
   * an active session.
   * @param {string} userID
   */
  createSession(userID) {
    this.#sessions.add(userID);
  }

  /**
   * Deletes a session for the given user if it exists.
   * @param {string} userID
   */
  deleteSession(userID) {
    this.#sessions.delete(userID);
  }
}

module.exports = SessionManager;
