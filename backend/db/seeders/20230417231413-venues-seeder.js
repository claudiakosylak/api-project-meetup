'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "123 North 23rd St. New York, NY",
        city: "New York City",
        state: "New York",
        lat: 23.54,
        lng: 18.75
      },
      {
        groupId: 2,
        address: "5050 Lake Way, Los Angeles, CA",
        city: "Los Angeles",
        state: "California",
        lat: 25.54,
        lng: 19.75
      },
      {
        groupId: 3,
        address: "United States",
        city: null,
        state: null,
        lat: null,
        lng: null
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
