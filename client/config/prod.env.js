'use strict'
const merge = require('webpack-merge')


// 正式环境运行时server端的地址 ,建议使用环境变量配置
// 如果未配置环境变量,会使用浏览器的当前输入的host作为后端请求地址
var productServerHost = process.env.SERVER_HOST
var allowRegister = process.env.FABU_ALLOW_REGISTER || true // 是否允许用户注册,为否则后端注册接口不可用



var config = {
  'ALLOW_REGISTER': allowRegister
}

if (productServerHost) {
  config['SERVER_HOST'] = productServerHost
}

module.exports = merge({
  NODE_ENV: '"production"'
}, config)
