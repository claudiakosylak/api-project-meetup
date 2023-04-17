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
        url: "image10@images.com",
        preview: true
      },
      {
        groupId: 1,
        url: "image11@images.com",
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
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["image10@images.com", "image11@images.com", "image12@images.com", "image13@images.com", "image14@images.com", "image15@images.com"] }
    }, {});
  }
};
