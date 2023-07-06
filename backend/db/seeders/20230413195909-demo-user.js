'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const names = [
  ["Liam", "Anderson"],
  ["Eva", "Bishop"],
  ["Leo", "Carter"],
  ["Nova", "Dixon"],
  ["Milo", "Evans"],
  ["Luna", "Foster"],
  ["Asher", "Gray"],
  ["Aria", "Harrison"],
  ["Finn", "Jensen"],
  ["Ava", "Lawrence"],
  ["Max", "Morrison"],
  ["Nora", "Oliver"],
  ["Owen", "Parker"],
  ["Sophia", "Quinn"],
  ["Lucas", "Reynolds"],
  ["Stella", "Scott"],
  ["Ethan", "Turner"],
  ["Isabella", "Underwood"],
  ["Jackson", "Vaughn"],
  ["Mia", "Watson"]
];

let users = [{
    email: 'demo@user.io',
    username: 'Demo-lition',
    firstName: 'Demo',
    lastName: 'Lition',
    hashedPassword: bcrypt.hashSync('password')
}]

let passNum = 2

for (let name of names) {
  const person = {
    email: `${name[0]}@user.io`,
    username: name[0] + name[1],
    firstName: name[0],
    lastName: name[1],
    hashedPassword: bcrypt.hashSync(`password${passNum}`)
  }
  users.push(person);
  passNum++;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, users, {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    // const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options);
  }
};
