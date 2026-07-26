const Sequelize = require('sequelize');
const { dbContext } = require('../utils/sqlite');

const tbCharSheets = dbContext.define('tbCharSheets', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  guild: {
    type: Sequelize.STRING,
  },
  user: {
    type: Sequelize.STRING,
  },
  charName: Sequelize.TEXT,
  lvl: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  str: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  dex: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  con: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  int: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  wis: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  cha: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
});

module.exports = {
  tbCharSheets: tbCharSheets,
}