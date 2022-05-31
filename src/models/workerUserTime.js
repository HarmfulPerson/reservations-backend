const Sequelize = require('sequelize');
const db = require('../config/db');
const WorkerUser = require('./workerUser');

const WorkerUserTime = db.define('workerUserTime', {
  startTime: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false,
    unique: true,
  },
  endTime: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false,
  },
  workedTime: {
    type: Sequelize.DataTypes.NUMBER,
    set() {
      // Storing passwords in plaintext in the database is terrible.
      // Hashing the value with an appropriate cryptographic hash function is better.
      this.setDataValue('workedTime', this.endTime - this.startTime);
    },
  },
});

WorkerUser.hasMany(WorkerUserTime);
WorkerUserTime.belongsTo(WorkerUser);

module.exports = WorkerUserTime;
