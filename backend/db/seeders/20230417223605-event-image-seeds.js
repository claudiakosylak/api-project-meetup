'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: "image1@images.com",
        preview: true
      },
      {
        eventId: 1,
        url: "image2@images.com",
        preview: false
      },
      {
        eventId: 2,
        url: "image3@images.com",
        preview: true
      },
      {
        eventId: 2,
        url: "image4@images.com",
        preview: false
      },
      {
        eventId: 3,
        url: "image5@images.com",
        preview: true
      },
      {
        eventId: 3,
        url: "image6@images.com",
        preview: false
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
