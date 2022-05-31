const express = require('express');
const { register, login, update, removeUser } = require('../controllers/user');
const { auth } = require('../services/auth');
const httpStatusCodes = require('../helpers/httpStatusCodes');

const router = express.Router();

router.post('/register', auth, async (req, res, next) => {
  try {
    const newUser = await register(req.body);

    res.status(httpStatusCodes.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const result = await getAllUsersInfo(req.body);

    res.status(httpStatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/', auth, async (req, res, next) => {
  try {
    const updatedUser = await update(req.body, req.data.uid);

    res.status(httpStatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/', auth, async (req, res, next) => {
  try {
    const removedUser = await removeUser(req.data.uid);

    res.status(httpStatusCodes.OK).json(removedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
