'use strict'

const { v4: uuidv4 } = require('uuid')

for (let i = 0; i < 5; i++) {
  console.log(uuidv4())
}
