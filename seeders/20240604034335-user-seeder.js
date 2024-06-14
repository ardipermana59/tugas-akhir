'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const sumOfPemilih = 5;
    const userAdmin = {
      id: uuidv4(),
      role: 'admin',
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      created_at: new Date(),
      updated_at: new Date()
    };

    const userPemilih = [];
    for (let i = 1; i <= sumOfPemilih; i++) {
      userPemilih.push({
        id: uuidv4(),
        role: 'pemilih',
        username: 'pemilih' + i,
        password: await bcrypt.hash('pemilih' + i, 10),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    const tb_pemilih = userPemilih.map(pemilih => ({
      id: uuidv4(),
      user_id: pemilih.id,
      name: 'John Doe',
      gender: 'l',
      address: 'address',
      created_at: new Date(),
      updated_at: new Date()
    }));

    const tb_admin = [
      {
        id: uuidv4(),
        user_id: userAdmin.id,
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('tb_user', [userAdmin, ...userPemilih], {});
    await queryInterface.bulkInsert('tb_pemilih', tb_pemilih, {});
    await queryInterface.bulkInsert('tb_admin', tb_admin, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_user', null, {});
    await queryInterface.bulkDelete('tb_pemilih', null, {});
    await queryInterface.bulkDelete('tb_admin', null, {});
  }
};
