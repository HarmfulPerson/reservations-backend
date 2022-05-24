const Sequelize = require('sequelize');
const db = require('../config/db');
const User = require('./user');
const reservationStatuses = require('../helpers/consts');

const Reservation = db.define('reservation', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  startDate: {
    type: Sequelize.DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: Sequelize.DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    defaultValue: reservationStatuses.free,
  },
  reservedBy: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
});

Reservation.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(Reservation, { onDelete: 'CASCADE' });

module.exports = Reservation;
