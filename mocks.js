const faker = require('faker');
const tr = require('transliter');
//const TurndownService = require('turndown');

const models = require('./models');

const owner = '5d04de241f3930c07ac6368a';

module.exports = async () => {
  try {
    await models.Post.remove();

    Array.from({ length: 20 }).forEach(async () => {
      const title = faker.lorem.words(5);
      const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;
      const post = await models.Post.create({
        title,
        body: faker.lorem.words(100),
        url,
        owner
      });
      console.log(post);
    });
  } catch (error) {
    console.log(error);
  }
};