const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define('user', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  lastLogin: {
    type: Sequelize.DataTypes.DATE,
    defaultValue: Date.now(),
  },
});

module.exports = User;
