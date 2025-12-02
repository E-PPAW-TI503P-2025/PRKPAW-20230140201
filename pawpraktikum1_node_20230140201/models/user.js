'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi dengan Presensi (One-to-Many)
      User.hasMany(models.Presensi, { 
        foreignKey: 'userId',
        as: 'presensi' // Alias untuk eager loading
      });
    }
  }

  User.init(
    {
      nama: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('mahasiswa', 'admin'),
        defaultValue: 'mahasiswa',
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};