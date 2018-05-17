'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const fs = require('fs')
const path = require('path')

var baseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config.json')), 'utf8')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseURL: "'" + baseConfig.url + "'"
})
