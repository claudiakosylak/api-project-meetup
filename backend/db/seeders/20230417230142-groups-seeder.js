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
        state: "New York"
      },
      {
        organizerId: 2,
        name: "Animal fans",
        about: "We love animals here",
        type: "In Person",
        private: false,
        city: "Los Angeles",
        state: "California"
      },
      {
        organizerId: 3,
        name: "Business networkers",
        about: "We like to do business and network.",
        type: "Online",
        private: true,
        city: "Dallas",
        state: "Texas"
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    // const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
