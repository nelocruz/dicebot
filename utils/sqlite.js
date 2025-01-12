const Sequelize = require('sequelize');

const dbContext = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

module.exports = {
  dbContext: dbContext,
}