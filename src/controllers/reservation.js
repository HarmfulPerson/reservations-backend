const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const moment = require('moment');
const db = require('../config/db');
const CustomError = require('../helpers/error');
const { generateToken } = require('../services/auth');
const Reservation = require('../models/reservation');
const httpStatusCodes = require('../helpers/httpStatusCodes');
const User = require('../models/user');
const reservationStatuses = require('../helpers/consts');
const { sendEmailIfReservationNotFree } = require('../helpers/mailer');
const ReservationToConfirm = require('../models/reservationToConfirm');

const now = moment();
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

module.exports.getOwnReservation = async (requester) => {
  const user = await User.findOne({
    where: {
      uid: requester,
    },
  });

  if (!user)
    throw new CustomError(
      httpStatusCodes.NOT_FOUND,
      'Requester does not exist'
    );

  return user.getReservations();
};

module.exports.deleteReservation = async (reservationUid, requester) => {
  const reservation = await Reservation.findOne({
    where: {
      uid: reservationUid,
      userUid: requester,
    },
  });

  if (!reservation)
    throw new CustomError(
      httpStatusCodes.NOT_FOUND,
      'Given reservation does not exist'
    );
  if (reservation.status === reservationStatuses.confirmed) {
    sendEmailIfReservationNotFree(reservation.reservedBy, {
      startDate: reservation.startDate,
      endDate: reservation.endDate,
    });
  } else if (reservation.status === reservationStatuses.toConfirm) {
    const reservationToConfirm = ReservationToConfirm.findOne({
      where: { reservationUid },
    });

    if (reservationToConfirm) {
      reservationToConfirm.destroy();
      sendEmailIfReservationNotFree(reservationToConfirm.reservedBy, {
        startDate: reservation.startDate,
        endDate: reservation.endDate,
      });
    }
  }

  return reservation.destroy();
};

module.exports.add = async (data, requester) => {
  const user = await User.findOne({
    where: {
      uid: requester,
    },
  });

  if (!user)
    throw new CustomError(
      httpStatusCodes.NOT_FOUND,
      'Requester does not exist'
    );
  console.log(data.startDate);
  const colidingReservations = await Reservation.findOne({
    where: {
      [Op.or]: [
        {
          startDate: {
            [Op.gt]: data.startDate,
            [Op.lt]: data.endDate,
          },
        },
        {
          endDate: {
            [Op.gt]: data.startDate,
            [Op.lt]: data.endDate,
          },
        },
      ],
    },
  });

  if (colidingReservations?.length)
    throw new CustomError(
      httpStatusCodes.BAD_REQUEST,
      'These dates collides with existing ones'
    );

  return user.createReservation(data, { returning: true });
};
