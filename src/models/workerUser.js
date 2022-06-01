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
    allowNull: false,
  },
  surname: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  stake: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 15,
  },
});

module.exports = WorkerUser;
