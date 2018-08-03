'use strict'
const merge = require('webpack-merge')


// 正式环境运行时server端的地址 ,建议使用环境变量配置
// 如果未配置环境变量,会使用浏览器的当前输入的host作为后端请求地址
var productServerHost = process.env.SERVER_HOST

var config = {}
if (productServerHost) {
  config['SERVER_HOST'] = productServerHost
}

module.exports = merge({
  NODE_ENV: '"production"'
}, config)
