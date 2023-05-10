'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "https://images.unsplash.com/photo-1598153346810-860daa814c4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80",
        preview: true
      },
      {
        groupId: 1,
        url: "https://unsplash.com/photos/tS-jh0M6JoA",
        preview: false
      },
      {
        groupId: 1,
        url: "https://unsplash.com/photos/HAl6CKxM3xU",
        preview: false
      },
      {
        groupId: 2,
        url: "image12@images.com",
        preview: true
      },
      {
        groupId: 2,
        url: "image13@images.com",
        preview: false
      },
      {
        groupId: 3,
        url: "image14@images.com",
        preview: true
      },
      {
        groupId: 3,
        url: "image15@images.com",
        preview: false
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
