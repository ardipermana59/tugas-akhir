'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker/locale/id_ID');
const SHA = require('../utils/SHA');
const AES = require('../utils/AES');
const { formatDateTime } = require('../utils/formatDateTime');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const NUM_OF_VOTERS = 20;
    
    // Helper function to create a user
    const createUser = async (role, username, password) => {
      return {
        id: uuidv4(),
        role,
        username,
        password: await bcrypt.hash(password, 10),
        created_at: new Date(),
        updated_at: new Date()
      };
    };

    // Helper function to create voter details
    const createVoterDetails = (userId) => {
      return {
        id: uuidv4(),
        user_id: userId,
        name: faker.person.firstName(),
        gender: faker.helpers.arrayElement(['l', 'p']),
        address: faker.location.streetAddress(true),
        created_at: new Date(),
        updated_at: new Date()
      };
    };

    // Create admin user
    const adminUser = await createUser('admin', 'admin', 'password');

    // Create voter users
    const voterUsers = [];
    for (let i = 1; i <= NUM_OF_VOTERS; i++) {
      voterUsers.push(await createUser('pemilih', `pemilih${i}`, 'password'));
    }

    // Create voter details
    const voterDetails = voterUsers.map(user => createVoterDetails(user.id));

    // Create admin details
    const adminDetails = [{
      id: uuidv4(),
      user_id: adminUser.id,
      name: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }];

    // Create candidates
    const candidates = [
      {
        id: uuidv4(),
        name: 'Joko Widodo',
        foto: 'jokowi.jpeg',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Prabowo Subianto',
        foto: 'prabowo.jpg',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Insert data into the database
    await queryInterface.bulkInsert('tb_user', [adminUser, ...voterUsers], {});
    await queryInterface.bulkInsert('tb_pemilih', voterDetails, {});
    await queryInterface.bulkInsert('tb_admin', adminDetails, {});
    await queryInterface.bulkInsert('tb_kandidat', candidates, {});

    // Create genesis block for voting data
    let blockId = 1;
    const genesisBlock = {
      id: blockId,
      pemilih_id: null,
      data: null,
      previous_hash: null,
      hash: SHA.generateHash(uuidv4()),
      created_at: formatDateTime(new Date())
    };
   
    const votingData = [genesisBlock];
    
    await queryInterface.bulkInsert('tb_pilihan', votingData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tb_user', null, {});
    await queryInterface.bulkDelete('tb_pemilih', null, {});
    await queryInterface.bulkDelete('tb_admin', null, {});
    await queryInterface.bulkDelete('tb_kandidat', null, {});
    await queryInterface.bulkDelete('tb_pilihan', null, {});
  }
};
