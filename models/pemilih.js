'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Pemilih extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pemilih.hasOne(models.Pilihan, { foreignKey: 'pemilih_id' })
    }
  }
  Pemilih.init({
    user_id: DataTypes.UUID,
    name: DataTypes.STRING,
    gender: DataTypes.ENUM(['l','p']),
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pemilih',
    tableName: 'tb_pemilih',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
  return Pemilih
}