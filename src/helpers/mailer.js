const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const createEmailConfirmationTemplate = (uid, startDate, endDate) =>
  `<p>Przyciśnij <a href='${process.env.HOST}/confirmReservation/${uid}'>tutaj</a> aby potwierdzić termin ${startDate} - ${endDate}.</p>`;

const createEmailIfReservationNotFree = (startDate, endDate) =>
  `<p>Niestety termin ${startDate} - ${endDate} który wybrałeś został właśnie odwołany, prosimy o wybranie innego na naszej stronie :).</p>`;

const createEmailInfoForApplicationUser = (startDate, endDate) =>
  `<p>Został potwierdzony nowy termin ${startDate} - ${endDate}.</p>`;

module.exports.sendEmailForDateConfirmation = (email, uid, dateObject) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Rezerwacje SQUASH-AKADEMIA',
    html: createEmailConfirmationTemplate(
      uid,
      dateObject.startDate,
      dateObject.endDate
    ),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports.sendInfoEmailForApplicationUser = (
  email,
  startDate,
  endDate
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Rezerwacje SQUASH-AKADEMIA',
    html: createEmailInfoForApplicationUser(startDate, endDate),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports.sendEmailIfReservationNotFree = (email, uid, dateObject) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Rezerwacje SQUASH-AKADEMIA',
    html: createEmailIfReservationNotFree(
      dateObject.startDate,
      dateObject.endDate
    ),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
