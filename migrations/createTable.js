'use strict'

const models = require('../models')

;(async () => {
  await models.sequelize.drop()
  await models.Todo.sync({ force: true })
})()
