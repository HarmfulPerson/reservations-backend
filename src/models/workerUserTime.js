const Sequelize = require('sequelize');
const db = require('../config/db');
const WorkerUser = require('./workerUser');

const WorkerUserTime = db.define('workerUserTime', {
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
    set() {
      if (this.endTime)
        this.setDataValue('workedTime', this.endTime - this.startTime);
    },
  },
});

WorkerUser.hasMany(WorkerUserTime);
WorkerUserTime.belongsTo(WorkerUser);

module.exports = WorkerUserTime;
