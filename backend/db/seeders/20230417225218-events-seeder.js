'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: "Picnick at the park",
        description: "Join your fellow New Yorkers for a sunny day in Central Park!",
        type: "In Person",
        capacity: 20,
        price: 20,
        startDate: 2023-05-31,
        endDate: 2023-05-31
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Disco at the zoo",
        description: "Get down with the penguins and the tigers.",
        type: "In Person",
        capacity: 30,
        price: 15,
        startDate: 2023-06-30,
        endDate: 2023-06-30
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Women in business panel",
        description: "Come hear a panel of woman CEOs speak about the future of business.",
        type: "Online",
        capacity: 100,
        price: 5,
        startDate: 2023-07-31,
        endDate: 2023-07-31
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Picnick at the park", "Disco at the zoo", "Women in business panel"] }
    }, {});
  }
};
