const Sequelize = require('sequelize');
const db = require('../config/db');

const WorkerUser = db.define('workerUser', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  login: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  surname: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  stake: {
    type: Sequelize.DataTypes.NUMBER,
    defaultValue: 15,
  },
});

module.exports = WorkerUser;
