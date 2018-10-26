'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')


// 本地运行时server端的地址
var devServerHost = '"http://172.17.11.47:9898"'

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_HOST: devServerHost
})
