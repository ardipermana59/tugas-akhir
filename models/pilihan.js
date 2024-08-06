'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Pilihan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pilihan.belongsTo(models.Pemilih, { foreignKey: 'pemilih_id' })
    }

  }

  Pilihan.init({
    pemilih_id: DataTypes.UUID,
    data: DataTypes.STRING,
    hash: DataTypes.STRING,
    previous_hash: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Pilihan',
    tableName: 'tb_pilihan',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false,
  })

  return Pilihan
}
