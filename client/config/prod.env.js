'use strict'
const fs = require('fs')
const path = require('path')


var baseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config.json')), 'utf8')

module.exports = {
  NODE_ENV: '"production"',
  baseURL: "'" + baseConfig.baseURL + "'"
}
