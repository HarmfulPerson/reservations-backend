const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

module.exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(req.headers);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.data = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'auth failed',
    });
  }
};

module.exports.generateToken = (data) =>
  jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED,
  });
