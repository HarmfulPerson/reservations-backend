const express = require('express');
const { add, confirmDate } = require('../controllers/reservationToConfirm');
const { auth } = require('../services/auth');
const httpStatusCodes = require('../helpers/httpStatusCodes');

const router = express.Router();

router.post('/add', async (req, res, next) => {
  try {
    const newReservationToConfirm = await add(req.body);

    res.status(httpStatusCodes.CREATED).json(newReservationToConfirm);
  } catch (error) {
    next(error);
  }
});
router.patch('/confirm', async (req, res, next) => {
  try {
    const newReservationToConfirm = await confirmDate(req.body.uid);

    res.status(httpStatusCodes.CREATED).json({ confirmed: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
