'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "Harry Potter Book Club",
        about: "Join our group of muggles as we explore the beautiful wizarding world of Harry Potter!",
        type: "In Person",
        private: false,
        city: "New York City",
        state: "NY"
      },
      {
        organizerId: 2,
        name: "Readers of Westeros",
        about: "Winter is coming - join us as we play (rather, read about) the Game of Thrones. Will the book series ever be finished? Is House of the Dragon a worthy prequel? Dress up, join us for wine, bring your books, and let's find out!",
        type: "In Person",
        private: false,
        city: "Los Angeles",
        state: "CA"
      },
      {
        organizerId: 3,
        name: "Non-fiction Addiction",
        about: "Join us for some reading where we might actually learn about the world we live in rather than live in silly fantasies. We will learn about habits, productivity, business, and other such things.",
        type: "Online",
        private: true,
        city: "Dallas",
        state: "TX"
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    // const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
