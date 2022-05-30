const Sequelize = require('sequelize');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

console.log(process.env.DB_PASS);

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  }
);
