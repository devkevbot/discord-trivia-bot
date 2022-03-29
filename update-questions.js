const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const he = require('he');
const axios = require('axios');

const categories = [
  {
    id: 9,
    name: 'General Knowledge',
  },
  {
    id: 10,
    name: 'Entertainment: Books',
  },
  {
    id: 11,
    name: 'Entertainment: Film',
  },
  {
    id: 12,
    name: 'Entertainment: Music',
  },
  {
    id: 13,
    name: 'Entertainment: Musicals & Theatres',
  },
  {
    id: 14,
    name: 'Entertainment: Television',
  },
  {
    id: 15,
    name: 'Entertainment: Video Games',
  },
  {
    id: 16,
    name: 'Entertainment: Board Games',
  },
  {
    id: 17,
    name: 'Science & Nature',
  },
  {
    id: 18,
    name: 'Science: Computers',
  },
  {
    id: 19,
    name: 'Science: Mathematics',
  },
  {
    id: 20,
    name: 'Mythology',
  },
  {
    id: 21,
    name: 'Sports',
  },
  {
    id: 22,
    name: 'Geography',
  },
  {
    id: 23,
    name: 'History',
  },
  {
    id: 24,
    name: 'Politics',
  },
  {
    id: 25,
    name: 'Art',
  },
  {
    id: 26,
    name: 'Celebrities',
  },
  {
    id: 27,
    name: 'Animals',
  },
  {
    id: 28,
    name: 'Vehicles',
  },
  {
    id: 29,
    name: 'Entertainment: Comics',
  },
  {
    id: 30,
    name: 'Science: Gadgets',
  },
  {
    id: 31,
    name: 'Entertainment: Japanese Anime & Manga',
  },
  {
    id: 32,
    name: 'Entertainment: Cartoon & Animations',
  },
];

function getCategoryIDsFromNames(categoryNames) {
  const categoryIDs = categories
    .filter((category) => categoryNames.includes(category.name.toLowerCase()))
    .map((category) => category.id);
  return categoryIDs;
}

async function fetchNewTriviaQuestions(amount, categoryID) {
  const {
    data: {results},
  } = await axios.get(
    `https://opentdb.com/api.php?amount=${amount}&category=${categoryID}`
  );
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
    const categoryIDs = getCategoryIDsFromNames([
      'history',
      'geography',
      'mythology',
    ]);
    console.log('Detected category IDs:', categoryIDs);

    const questions = (
      await Promise.all(
        categoryIDs.map(
          async (categoryID) => await fetchNewTriviaQuestions(50, categoryID)
        )
      )
    ).flat();
    console.log('Fetched ', questions.length, ' questions from Trivia API.');

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
