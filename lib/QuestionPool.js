const questions = require('../data/questions.json');
const _ = require('lodash');

/**
 * Manages the question pool.
 */
class QuestionPool {
  static #pool = _.groupBy(questions, 'category');

  static {
    console.log(
      `PoolManager initialized from ${questions.length} questions, ${
        Object.keys(this.#pool).length
      } categories`
    );
  }

  static generate(category, count = 10) {
    return _.sampleSize(QuestionPool.#pool[category], count);
  }
}

module.exports = QuestionPool;
