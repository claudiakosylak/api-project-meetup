'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
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
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["image1@images.com", "image2@images.com", "image3@images.com", "image4@images.com", "image5@images.com", "image6@images.com"] }
    }, {});
  }
};
