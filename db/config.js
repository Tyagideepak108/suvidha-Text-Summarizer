const { Sequelize } = require('sequelize');

// Database connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'suvidha_db',
  username: 'postgres',
  password: 'password',
  logging: false
});

module.exports = sequelize;