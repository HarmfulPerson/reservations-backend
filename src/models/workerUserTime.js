const Sequelize = require('sequelize');
const db = require('../config/db');
const WorkerUser = require('./workerUser');

const WorkerUserTime = db.define('workerUserTime', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  startTime: {
    type: Sequelize.DataTypes.BIGINT,
    allowNull: true,
  },
  endTime: {
    type: Sequelize.DataTypes.BIGINT,
    allowNull: true,
  },
  workedTime: {
    type: Sequelize.DataTypes.BIGINT,
    allowNull: true,
  },
});

WorkerUser.hasMany(WorkerUserTime);
WorkerUserTime.belongsTo(WorkerUser);

module.exports = WorkerUserTime;
