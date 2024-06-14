'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init({
    user_id: DataTypes.UUID,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admin',
    tableName: 'tb_admin',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Admin;
};