'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const kandidat = [
      {
        id: uuidv4(),
        name: 'Joko Widodo',
        foto: 'jokowi.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Prabowo Subianto',
        foto: 'prabowo.png',
        created_at: new Date(),
        updated_at: new Date()
      },
    ];


    await queryInterface.bulkInsert('tb_kandidat', kandidat, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_kandidat', null, {});
  }
};
