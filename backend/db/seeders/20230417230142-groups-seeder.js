'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const bookSeriesGroups = [
  ["The Potterheads", "A magical book club dedicated to the enchanting world of Harry Potter and the wizarding adventures of Hogwarts.", "New York City", "New York"],
  ["The Thrones Guild", "Immerse yourself in the captivating universe of Game of Thrones and join fellow fans in unraveling the intricate plots and political intrigues.", "Los Angeles", "California"],
  ["The Hobbit Quest", "Embark on an epic journey through Middle-earth with Bilbo and the fellowship of The Lord of the Rings series.", "Seattle", "Washington"],
  ["The Narnia Chronicles", "Step into the wardrobe and enter the enchanting realm of Narnia as we explore C.S. Lewis's beloved fantasy series.", "Chicago", "Illinois"],
  ["The Hunger Games Squad", "Join us in the fight for survival as we delve into the dystopian world of Panem and follow Katniss Everdeen's inspiring journey.", "Atlanta", "Georgia"],
  ["The Dark Tower Society", "Enter the dark and mysterious world created by Stephen King in The Dark Tower series and unravel the secrets of the multiverse.", "Portland", "Oregon"],
  ["The Wheel of Time Fellowship", "Embark on a sweeping adventure through Robert Jordan's epic fantasy series, The Wheel of Time, and uncover the Pattern.", "Denver", "Colorado"],
  ["The Sherlockian Detectives", "Dive into the intricate mysteries of Sir Arthur Conan Doyle's Sherlock Holmes series and sharpen your detective skills.", "Boston", "Massachusetts"],
  ["The Percy Jackson Chronicles", "Discover the modern-day adventures of demigod Percy Jackson and explore Greek mythology in Rick Riordan's captivating series.", "Miami", "Florida"],
  ["The Discworld Explorers", "Explore Terry Pratchett's whimsical and satirical Discworld series, a realm balanced on the backs of four elephants atop a giant turtle.", "Austin", "Texas"]
];


let groups = []
let organizer = 1
// let inPerson = false

for (let group of bookSeriesGroups) {
  const newGroup = {
    organizerId: organizer,
    name: group[0],
    about: group[1],
    type: "Online",
    private: false,
    city: group[2],
    state: group[3]
  }
  groups.push(newGroup)
  organizer++
  // inPerson = !inPerson
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options, groups, {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    // const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
