'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kandidat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kandidat.init({
    name: DataTypes.STRING,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kandidat',
    tableName: 'tb_kandidat',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Kandidat;
};