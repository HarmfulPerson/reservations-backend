const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./src/routes/user');
const reservationRoutes = require('./src/routes/reservation');
const reservationToConfirmRoutes = require('./src/routes/reservationToConfirm');
const workersRoutes = require('./src/routes/workers');

require('dotenv').config();
const initRoutes = require('./src/routes/init');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use('/api', (req, res, next) => {
  console.log(req.path);
});

app.use('/init', initRoutes);
app.use('/user', userRoutes);
app.use('/reservation', reservationRoutes);
app.use('/reservationToConfirm', reservationToConfirmRoutes);
app.use('/workers', workersRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
