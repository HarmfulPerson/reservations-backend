const express = require('express');
const {
  register,
  login,
  update,
  removeUser,
  startWork,
  endWork,
} = require('../controllers/workers');
const { auth } = require('../services/auth');
const httpStatusCodes = require('../helpers/httpStatusCodes');

const router = express.Router();

router.post('/register', auth, async (req, res, next) => {
  try {
    console.log(req.data);
    const newUser = await register(req.body, req.data.uid);

    res.status(httpStatusCodes.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const loggedUser = await login(req.body);

    res.status(httpStatusCodes.CREATED).json(loggedUser);
  } catch (error) {
    next(error);
  }
});

router.post('/startWork', auth, async (req, res, next) => {
  try {
    const startTime = await startWork(req.data.uid);

    res.status(httpStatusCodes.CREATED).json({ startTime });
  } catch (error) {
    next(error);
  }
});

router.post('/endWork', auth, async (req, res, next) => {
  try {
    console.log(req.data.uid);
    const endTime = await endWork(req.body, req.data.uid);

    res.status(httpStatusCodes.CREATED).json({ endTime });
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
