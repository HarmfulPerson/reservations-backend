const CustomError = require('../helpers/error');
const ReservationToConfirm = require('../models/reservationToConfirm');
const httpStatusCodes = require('../helpers/httpStatusCodes');
const Reservation = require('../models/reservation');
const reservationStatuses = require('../helpers/consts');
const { sendInfoEmailForApplicationUser } = require('../helpers/mailer');

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
  delete data.uid;
  return reservation.createReservationToConfirm(data, { returning: true });
};

module.exports.confirmDate = async (uid) => {
  const reservationToConfirm = await ReservationToConfirm.findOne({
    where: {
      uid,
    },
    include: {
      model: Reservation,
    },
  });

  if (!reservationToConfirm)
    throw new CustomError(
      httpStatusCodes.NOT_FOUND,
      'Reservation of given uid does not exist'
    );
  console.log(reservationToConfirm.reservation.status);
  let ownerEmail;
  let startDate;
  let endDate;

  if (reservationToConfirm.reservation.status !== reservationStatuses.toConfirm)
    throw new CustomError(
      httpStatusCodes.BAD_REQUEST,
      'This reservation is confirmed'
    );

  await Reservation.update(
    {
      status: reservationStatuses.confirmed,
      reservedBy: reservationToConfirm.reservedBy,
    },
    {
      where: { uid: reservationToConfirm.reservationUid },
      returning: true,
    }
  ).then(async (object) => {
    startDate = object[1][0].startDate;
    endDate = object[1][0].endDate;
    ownerEmail = (await object[1][0].getUser()).email;
  });
  console.log('xddd', ownerEmail, startDate, endDate);
  sendInfoEmailForApplicationUser(ownerEmail, startDate, endDate);
  await reservationToConfirm.destroy();

  return reservationToConfirm.reservation;
};
