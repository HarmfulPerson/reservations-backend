const bcrypt = require('bcrypt');
const generator = require('generate-password');
const CustomError = require('../helpers/error');
const { generateToken } = require('../services/auth');
const User = require('../models/user');
const WorkerUser = require('../models/workerUser');
const WorkerUserTime = require('../models/workerUserTime');
const httpStatusCodes = require('../helpers/httpStatusCodes');
const Reservation = require('../models/reservation');
const { createEmailWithPassword } = require('../helpers/mailer');
const db = require('../config/db');

const saltRounds = 12;

module.exports.register = async (user, requesterUid) => {
  const registeredUser = await WorkerUser.findOne({
    where: {
      login: user.login,
    },
  });

  const requester = await WorkerUser.findOne({
    where: {
      uid: requesterUid,
    },
  });

  if (requester.role !== 'admin')
    throw new CustomError(
      httpStatusCodes.PERMISSION_DENIED,
      'User is not allowed'
    );

  if (registeredUser)
    throw new CustomError(httpStatusCodes.BAD_REQUEST, 'User exist');

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  if (hashedPassword) {
    const newUser = {
      ...user,
      password: hashedPassword,
    };
    const createdUser = await WorkerUser.create(newUser);

    createEmailWithPassword(user.email, password);

    return createdUser;
  }

  throw new CustomError(
    httpStatusCodes.BAD_REQUEST,
    'There was a problem hashing your password, user not created'
  );
};

module.exports.login = async (userLoginData) => {
  const user = await WorkerUser.findOne({
    where: {
      login: userLoginData.login,
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

  user.save();

  return {
    auth: true,
    token: generateToken({
      uid: user.uid,
    }),
    user: {
      uid: user.uid,
      username: user.username,
      name: user.name,
      surname: user.surname,
      role: user.role,
      stake: user.stake,
    },
  };
};

module.exports.changePassword = async (data, requesterUid) => {
  const user = await WorkerUser.findOne({
    where: {
      uid: requesterUid,
    },
  });
  const hashedPassword = await bcrypt.hash(data.oldPass, saltRounds);
  if (user.password !== hashedPassword)
    throw new CustomError(
      httpStatusCodes.UNAUTHORIZED,
      'Passwords does not match.'
    );
  user.password = await bcrypt.hash(data.newPass, saltRounds);
  user.save();

  return true;
};

module.exports.updateUser = (data, requesterUid) => {
  const requester = WorkerUser.findOne({
    uid: requesterUid,
  });
  if (requester.role !== 'admin')
    throw new CustomError(httpStatusCodes.BAD_REQUEST, 'Only admin can do it.');

  WorkerUser.update(data, {
    where: {
      uid: data.uid,
    },
  });

  return true;
};

module.exports.endWork = async (data, requesterUid) => {
  const requester = await WorkerUser.findOne({
    where: {
      uid: requesterUid,
    },
  });

  if (requester.role !== 'user')
    throw new CustomError(httpStatusCodes.BAD_REQUEST, 'Only user can do it.');

  const endTime = new Date().getTime();
  console.log(endTime - data.startTime);
  await WorkerUserTime.update(
    { endTime, workedTime: endTime - data.startTime },
    {
      where: {
        startTime: data.startTime,
        workerUserUid: requesterUid,
      },
    }
  );

  return true;
};

module.exports.startWork = async (requesterUid) => {
  const requester = await WorkerUser.findOne({
    where: {
      uid: requesterUid,
    },
  });
  if (requester.role !== 'user')
    throw new CustomError(httpStatusCodes.BAD_REQUEST, 'Only user can do it.');

  const startTime = new Date().getTime();
  await requester.createWorkerUserTime({ startTime });
  return startTime;
};

module.exports.getAllUsersInfo = async () => {
  const users = await WorkerUser.findAll({
    include: {
      model: WorkerUserTime,
      attributes: [[db.fn('sum', db.col('workedTime')), 'workedTime']],
    },
  });

  return users;
};

module.exports.update = async (userData, uid) => {
  const user = { ...userData };

  if (userData.password && userData.password !== userData.rePassword)
    throw new CustomError(
      httpStatusCodes.BAD_REQUEST,
      'Passwords does not match'
    );

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
    returning: ['email', 'firstName', 'lastLogin', 'lastName', 'phone', 'uid'],
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

  user.destroy();

  return true;
};
