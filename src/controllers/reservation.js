const { Op } = require('sequelize');
const CustomError = require('../helpers/error');
const Reservation = require('../models/reservation');
const httpStatusCodes = require('../helpers/httpStatusCodes');
const User = require('../models/user');
const reservationStatuses = require('../helpers/consts');
const {
  sendEmailIfReservationNotFree,
  sendEmailForDateConfirmation,
} = require('../helpers/mailer');
const ReservationToConfirm = require('../models/reservationToConfirm');
const { isDateValid } = require('../services/reservation');

const date = new Date();
const offset = date.getTimezoneOffset() * 60000;
const ISOStringNowDate = new Date(date.getTime() - offset).toISOString();

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

  return user.getReservations({
    where: {
      startDate: {
        [Op.gte]: ISOStringNowDate,
      },
    },
  });
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
  if (!isDateValid(data.startDate, data.endDate))
    throw new CustomError(httpStatusCodes.BAD_REQUEST, 'Invalid dates');

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
        {
          startDate: data.startDate,
        },
        {
          endDate: data.endDate,
        },
      ],
    },
  });

  const sameReservation = await Reservation.findOne({
    where: {
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });

  if (colidingReservations || sameReservation)
    throw new CustomError(
      httpStatusCodes.BAD_REQUEST,
      'These dates collides with existing ones'
    );

  const newReservation = await user.createReservation(data, {
    returning: true,
  });

  if (newReservation)
    sendEmailForDateConfirmation(data.reservedBy, newReservation.uid, {
      startDate: data.startDate,
      endDate: data.endDate,
    });

  return newReservation;
};

module.exports.getAvailableDates = async () => {
  const nextDays = 14;
  const dayInMiliseconds = 24 * 60 * 60 * 1000;
  const ISOStringNowDateNext14Days = new Date(
    new Date(Date.now() + nextDays * dayInMiliseconds) - offset
  ).toISOString();

  const availableDates = await Reservation.findAll({
    where: {
      startDate: {
        [Op.gte]: ISOStringNowDate,
        [Op.lte]: ISOStringNowDateNext14Days,
      },
      status: reservationStatuses.free,
    },
  });

  return availableDates;
};
