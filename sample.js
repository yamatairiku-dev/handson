/**
 * Sequelize CRUD Sample
 * 出典: https://blog.katsubemakito.net/nodejs/mysql-sequelize1
 */
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('todo_mysql_app', 'user', 'passw0rd', {
  host: 'mysql-db',
  dialect: 'mysql',
  logging: false
})

// --------------------------------------------
// Models
// --------------------------------------------
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER
  }
})

// --------------------------------------------
// CRUD
// --------------------------------------------
;(async () => {
  // MySQL上にテーブルを作成
  await User.sync({ alter: true })

  // MySQLから切断
  await sequelize.close()
})()
