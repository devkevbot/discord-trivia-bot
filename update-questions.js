const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const he = require('he');
const axios = require('axios');

async function fetchNewTriviaQuestions() {
  const {
    data: {results},
  } = await axios.get('https://opentdb.com/api.php?amount=50');
  return results;
}

function sanitizeData(questions) {
  questions.forEach((question) => {
    question.answers = [he.decode(question.correct_answer)];
    question.category = _.startCase(he.decode(question.category));
    question.question = he.decode(question.question);
    delete question.correct_answer;
    delete question.incorrect_answers;
    delete question.type;
    delete question.difficulty;
  });
  return questions;
}

async function main() {
  try {
    const questions = await fetchNewTriviaQuestions();
    const sanitizedData = sanitizeData(questions);
    fs.writeFileSync(
      path.join(__dirname, 'data', 'questions.json'),
      JSON.stringify(sanitizedData)
    );
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => {
    console.log('Done!');
  })
  .catch((error) => {
    console.trace('Stack trace');
    console.error(error);
  });
