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
        name: "A Gathering in the Forbidden Section",
        description: "What lies in the forbidden section? Bring your most dangerous ideas and curiosities about the wizarding world and we will explore.",
        type: "In Person",
        capacity: 20,
        price: 20,
        startDate: new Date("2023-05-31T03:24:00"),
        endDate: new Date("2023-06-31T03:24:00")
      },
      {
        venueId: 2,
        groupId: 2,
        name: "House of the Dragon Watch Party",
        description: "Join us as we watch the latest episodes of the new season and talk about how much better the books are!",
        type: "In Person",
        capacity: 30,
        price: 15,
        startDate: new Date("2023-06-30T03:24:00"),
        endDate: new Date("2023-07-30T03:24:00")
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Habit Building",
        description: "Come talk about your favorite books about building good habits and the psychology behind them.",
        type: "Online",
        capacity: 100,
        price: 5,
        startDate: new Date("2023-07-31T03:24:00"),
        endDate: new Date("2023-08-31T03:24:00")
      },
      {
        groupId: 3,
        name: "Own the Day Own Your Life",
        description: "We're going to be speaking about chapters one through four and how we've been able to implement some of the advice in our lives.",
        type: "Online",
        capacity: 100,
        price: 5,
        startDate: new Date("2023-01-31T03:24:00"),
        endDate: new Date("2023-02-31T03:24:00")
      },
      {
        groupId: 2,
        name: "A Game of Thrones",
        description: "We're going to begin reading the first book in the series for those who are new. We will discuss the different plotlines and how they deviate from the movies.",
        type: "Online",
        capacity: 100,
        price: 5,
        startDate: new Date("2022-12-31T03:24:00"),
        endDate: new Date("2022-12-31T03:25:00")
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
