const Sequelize = require('sequelize');

module.exports = new Sequelize('rezerwacje-squash', 'postgres', 'postgres', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
});
