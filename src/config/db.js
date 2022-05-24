const Sequelize = require('sequelize');

module.exports = new Sequelize('rezerwacje-squash', 'postgres', 'marcin', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
});
