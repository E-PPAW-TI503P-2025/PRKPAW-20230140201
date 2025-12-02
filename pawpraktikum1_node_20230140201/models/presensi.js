'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // Relasi dengan User (Many-to-One)
      Presensi.belongsTo(models.User, { 
        foreignKey: 'userId',
        as: 'user' // Alias untuk eager loading
      });
    }
  }

  Presensi.init(
    {
      userId: DataTypes.INTEGER,
      checkIn: DataTypes.DATE,
      checkOut: DataTypes.DATE,
      latitude: DataTypes.DECIMAL(10, 8), // Kolom Geolocation
      longitude: DataTypes.DECIMAL(11, 8), // Kolom Geolocation
    },
    {
      sequelize,
      modelName: 'Presensi',
      tableName: 'Presensi',
      timestamps: true,
    }
  );

  return Presensi;
};