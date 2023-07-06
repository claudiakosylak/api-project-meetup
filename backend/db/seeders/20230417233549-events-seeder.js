'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const meetupEvents = [
  // Events for "The Potterheads" group (groupId: 1)
  {
    groupId: 1,
    name: "Magical Movie Marathon",
    description: "Join us for a marathon of Harry Potter movies and relive the magical moments together.",
    type: "In Person",
    price: 10,
    startDate: new Date("2023-07-10T15:00:00"),
    endDate: new Date("2023-07-10T21:00:00")
  },
  {
    groupId: 1,
    name: "Wand Workshop",
    description: "Learn the art of wand-making and create your very own personalized wand in this interactive workshop.",
    type: "In Person",
    price: 15,
    startDate: new Date("2023-06-28T11:00:00"),
    endDate: new Date("2023-06-28T13:00:00")
  },
  {
    groupId: 1,
    name: "Trivia Night: Potter Edition",
    description: "Test your knowledge of the Harry Potter series in a thrilling trivia night. Prizes will be awarded to the winners!",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-09-02T19:00:00"),
    endDate: new Date("2023-09-02T21:00:00")
  },

  // Events for "The Thrones Guild" group (groupId: 2)
  {
    groupId: 2,
    name: "Game of Thrones Cosplay Party",
    description: "Dress up as your favorite Game of Thrones character and join us for a night of epic cosplay and celebration.",
    type: "In Person",
    price: 20,
    startDate: new Date("2023-07-15T20:00:00"),
    endDate: new Date("2023-07-16T01:00:00")
  },
  {
    groupId: 2,
    name: "Thrones Trivia Challenge",
    description: "Prove your knowledge of the Game of Thrones series in a challenging trivia competition. Valuable prizes await the winners!",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-05-08T18:30:00"),
    endDate: new Date("2023-05-08T20:30:00")
  },

  // Events for "The Hobbit Quest" group (groupId: 3)
  {
    groupId: 3,
    name: "Journey to Rivendell Hiking Adventure",
    description: "Embark on a scenic hike inspired by the breathtaking landscapes of The Lord of the Rings. Get ready for an unforgettable adventure!",
    type: "In Person",
    price: 10,
    startDate: new Date("2023-07-20T09:00:00"),
    endDate: new Date("2023-07-20T15:00:00")
  },
  {
    groupId: 3,
    name: "Tolkien Book Discussion: The Fellowship of the Ring",
    description: "Join us as we delve into the first book of The Lord of the Rings and discuss the themes and characters that make it a timeless masterpiece.",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-08-12T19:30:00"),
    endDate: new Date("2023-08-12T21:30:00")
  },

  // Events for"The Narnia Chronicles" group (groupId: 4)
  {
    groupId: 4,
    name: "Narnia Movie Marathon",
    description: "Join us for a marathon of The Chronicles of Narnia movies and immerse yourself in the magical world of Narnia.",
    type: "In Person",
    price: 10,
    startDate: new Date("2023-07-25T14:00:00"),
    endDate: new Date("2023-07-25T22:00:00")
  },

  // Events for "The Hunger Games Squad" group (groupId: 5)
  {
    groupId: 5,
    name: "Archery Training Session",
    description: "Channel your inner Katniss Everdeen and join us for an archery training session inspired by The Hunger Games.",
    type: "In Person",
    price: 15,
    startDate: new Date("2023-08-01T11:00:00"),
    endDate: new Date("2023-08-01T13:00:00")
  },
  {
    groupId: 5,
    name: "Reaping Ceremony and Book Discussion",
    description: "Experience the thrill of the Reaping Ceremony and engage in a lively discussion about The Hunger Games series.",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-06-18T17:30:00"),
    endDate: new Date("2023-06-18T19:30:00")
  },
  {
    groupId: 5,
    name: "The Hunger Games Trivia Night",
    description: "Test your knowledge of The Hunger Games series in a thrilling trivia night. May the odds be ever in your favor!",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-05-06T19:00:00"),
    endDate: new Date("2023-05-06T21:00:00")
  },

  // Events for "The Dark Tower Society" group (groupId: 6)
  {
    groupId: 6,
    name: "Stephen King Book Club: The Gunslinger",
    description: "Join us as we delve into the first book of The Dark Tower series and discuss the enigmatic world created by Stephen King.",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-07-28T19:00:00"),
    endDate: new Date("2023-07-28T21:00:00")
  },

  // Events for "The Wheel of Time Fellowship" group (groupId: 7)
  {
    groupId: 7,
    name: "The Eye of the World: Reading and Analysis",
    description: "Join us for a comprehensive reading and analysis session of the first book in The Wheel of Time series.",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-08-04T18:00:00"),
    endDate: new Date("2023-08-04T20:00:00")
  },

  // Events for "The Sherlockian Detectives" group (groupId: 8)
  {
    groupId: 8,
    name: "Sherlock Holmes Escape Room Challenge",
    description: "Put your detective skills to the test and solve intricate puzzles in a Sherlock Holmes-themed escape room challenge.",
    type: "In Person",
    price: 20,
    startDate: new Date("2023-08-10T16:30:00"),
    endDate: new Date("2023-08-10T18:30:00")
  },
  {
    groupId: 8,
    name: "A Study in Scarlet Book Discussion",
    description: "Dive into the world of Sherlock Holmes as we discuss the first novel, A Study in Scarlet, and unravel its compelling mysteries.",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-04-01T19:30:00"),
    endDate: new Date("2023-04-01T21:30:00")
  },

  // Events for "The Percy Jackson Chronicles" group (groupId: 9)
  {
    groupId: 9,
    name: "Capture the Flag: Camp Half-Blood Edition",
    description: "Join us for a thrilling game of Capture the Flag, inspired by the adventures at Camp Half-Blood in the Percy Jackson series.",
    type: "In Person",
    price: 10,
    startDate: new Date("2023-08-14T13:00:00"),
    endDate: new Date("2023-08-14T16:00:00")
  },

  // Events for "The Discworld Explorers" group (groupId: 10)
  {
    groupId: 10,
    name: "Terry Pratchett Tribute Evening",
    description: "Celebrate the life and works of Terry Pratchett in an evening filled with readings, discussions, and fond memories.",
    type: "In Person",
    price: 5,
    startDate: new Date("2023-08-20T19:00:00"),
    endDate: new Date("2023-08-20T21:00:00")
  }
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options, meetupEvents, {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
