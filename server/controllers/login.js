const User = require('../model/user');
const jwt = require('jsonwebtoken');

var login = async (ctx, next) => {
  const {body} = ctx.request
  try {
    const user = await User.findOne ({ userName: body.userName });
    if (!user) {
        ctx.status = 401
        ctx.body = {
            message: '用户名错误'
        }
        return;
    }
    if (body.password === user.password) {
        ctx.status = 200
        ctx.body = {
            message: '登录成功',
            token: jwt.sign({
                data: user,
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            }, 'jwt-secret')
        }
        ctx.header.token = jwt.sign({
          data: user,
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, 'jwt-secret')
        // ctx.header.token = jwt.sign({
        //     data: user,
        //     exp: Math.floor(Date.now() / 1000) + (60 * 60)
        // }, 'jwt-secret')
    } else {
        ctx.status = 401
        ctx.body = {
            message: '密码错误'
        }
    }
  } catch (error) {
    ctx.throw(500)
  } 
}

module.exports = {
  'POST /api/login': login
}