const Sequelize = require('sequelize');
const db = require('../config/db');
const Reservation = require('./reservation');

const ReservationToConfirm = db.define('reservationToConfirm', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  reservedBy: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

Reservation.hasOne(ReservationToConfirm);
ReservationToConfirm.belongsTo(Reservation);

module.exports = ReservationToConfirm;
