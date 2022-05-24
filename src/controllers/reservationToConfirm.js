const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const CustomError = require('../helpers/error');
const { generateToken } = require('../services/auth');
const ReservationToConfirm = require('../models/reservationToConfirm');
const httpStatusCodes = require('../helpers/httpStatusCodes');
const Reservation = require('../models/reservation');
const reservationStatuses = require('../helpers/consts');

const saltRounds = 12;
const keysToReturn = [
  'uid',
  'username',
  'email',
  'firstName',
  'lastName',
  'phone',
  'lastLogin',
];

module.exports.add = async (data) => {
  const reservation = await Reservation.findOne({
    where: {
      uid: data.uid,
    },
  });

  if (!reservation)
    throw new CustomError(
      httpStatusCodes.NOT_FOUND,
      'Reservation of given uid does not exist'
    );

  reservation.update({
    status: reservationStatuses.toConfirm,
    reservedBy: data.reservedBy,
  });

  return reservation.createReservationToConfirm(data, { returning: true });
};

module.exports.confirmDate = async (uid) => {
  const reservationToConfirm = await ReservationToConfirm.findOne({
    where: {
      uid,
    },
  });

  if (!reservationToConfirm)
    throw new CustomError(
      httpStatusCodes.NOT_FOUND,
      'Reservation of given uid does not exist'
    );

  await Reservation.update(
    { status: reservationStatuses.confirmed },
    {
      where: { uid: reservationToConfirm.reservationUid },
    }
  );

  await reservationToConfirm.destroy();
};
