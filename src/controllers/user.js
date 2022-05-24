const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const CustomError = require('../helpers/error');
const { generateToken } = require('../services/auth');
const User = require('../models/user');
const httpStatusCodes = require('../helpers/httpStatusCodes');
const Reservation = require('../models/reservation');

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

module.exports.register = async (user) => {
  const registeredUser = await User.findOne({
    where: {
      email: user.email,
    },
  });

  if (registeredUser)
    throw new CustomError(httpStatusCodes.BAD_REQUEST, 'User exist');

  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  if (hashedPassword) {
    const newUser = {
      ...user,
      password: hashedPassword,
    };
    const createdUser = await User.create(newUser);

    return createdUser;
  }

  throw new CustomError(
    httpStatusCodes.BAD_REQUEST,
    'There was a problem hashing your password, user not created'
  );
};

module.exports.login = async (userLoginData) => {
  const user = await User.findOne({
    where: {
      email: userLoginData.email,
    },
  });

  if (!user)
    throw new CustomError(httpStatusCodes.UNAUTHORIZED, 'Invalid credentials');

  const authorized = await bcrypt.compare(
    userLoginData.password,
    user.password
  );

  if (!authorized)
    throw new CustomError(httpStatusCodes.UNAUTHORIZED, 'Invalid credentials');

  user.lastLogin = Date.now();
  user.save();

  return {
    token: generateToken({
      uid: user.uid,
    }),
    user: {
      uid: user.uid,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      lastLogin: user.lastLogin,
      email: user.email,
    },
  };
};

module.exports.update = async (userData, uid) => {
  const user = { ...userData };

  if (userData.password && userData.password !== '') {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    user.password = hashedPassword;
  } else {
    delete user.password;
  }

  const patchedUser = await User.update(user, {
    where: {
      uid,
    },
    returning: keysToReturn,
  });

  return patchedUser[1][0];
};

module.exports.removeUser = async (UidToDelete) => {
  const user = await User.findOne({
    where: {
      uid: UidToDelete,
    },
  });

  if (!user)
    throw new CustomError(httpStatusCodes.BAD_REQUEST, 'Stop messing bro');
  const res = await Reservation.findOne({
    where: {
      uid: 'b35d98c1-e937-45e5-be5e-d12d1812f8b4',
    },
  });
  // eslint-disable-next-line no-proto
  user.destroy();

  return true;
};
