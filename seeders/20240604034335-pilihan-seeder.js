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
    const data = [
      {
        id: uuidv4(),
        pemilih_id: null,
        data: null,
        hash: '03911d5e050cf07eeb05c4a4b1d02a965a4bdc3b944eca10a03475d7d01b4d91',
        previous_hash: null,
        created_at: new Date(),
      },
    ];


    await queryInterface.bulkInsert('tb_pilihan', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_pilihan', null, {});
  }
};
