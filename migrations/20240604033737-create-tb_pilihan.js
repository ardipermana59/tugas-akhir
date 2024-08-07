'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_pilihan', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      pemilih_id: {
        type: Sequelize.UUID,
        references: {
          model: 'tb_pemilih',
          key: 'id',
        },
        allowNull: true
      },
      data: {
        type: Sequelize.STRING,
      },
      hash: {
        type: Sequelize.STRING,
      },
      previous_hash: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_pilihan');
  }
};