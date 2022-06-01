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

const transporter = nodemailer.createTransport({
  port: 587,
  secure: false,
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports.sendEmailForDateConfirmation = (email, uid, dateObject) => {
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

module.exports.sendEmailIfReservationNotFree = (email, dateObject) => {
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

module.exports.createEmailWithPassword = (email, password) => {
  const mailData = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Oto twoje hasło - squash',
    text: 'Super!',
    html: `<b>Witaj, oto twoje hasło którym zalogujesz się w serwisie! </b>
				 <br> ${password}<br/>`,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    return true;
  });
};
