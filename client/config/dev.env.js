'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')


// 本地运行时server端的地址
var devServerHost = '"http://127.0.0.1:9898"'

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_HOST: devServerHost
})
