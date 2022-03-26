const questions = require('../data/questions.json');
const _ = require('lodash');

/**
 * Manages the question pool.
 */
class PoolManager {
  static #pool = _.groupBy(questions, 'category');

  static {
    console.log(
      `PoolManager initialized from ${questions.length} questions, ${
        Object.keys(this.#pool).length
      } categories`
    );
  }

  static generateBatch(category, count) {
    return _.sampleSize(this.#pool[category], count);
  }
}

module.exports = PoolManager;
