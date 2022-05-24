const express = require('express');
const {
  add,
  getOwnReservation,
  deleteReservation,
} = require('../controllers/reservation');
const { auth } = require('../services/auth');
const httpStatusCodes = require('../helpers/httpStatusCodes');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const ownReservations = await getOwnReservation(req.data.uid);

    res.status(httpStatusCodes.CREATED).json(ownReservations);
  } catch (error) {
    next(error);
  }
});

router.post('/add', auth, async (req, res, next) => {
  try {
    const newReservation = await add(req.body, req.data.uid);

    res.status(httpStatusCodes.CREATED).json(newReservation);
  } catch (error) {
    next(error);
  }
});

router.delete('/', auth, async (req, res, next) => {
  try {
    const deletedReservation = await deleteReservation(
      req.body.uid,
      req.data.uid
    );

    res.status(httpStatusCodes.CREATED).json(deletedReservation);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
