// const User = require('../model/user');
// const jwt = require('jsonwebtoken');

// var register = async (ctx, next) => {
//   const { body } = ctx.request;
//   try {
//     if (!body.userName || !body.password) {
//       ctx.status = 401;
//       ctx.body = {
//         error: 'expected an object with userName, password but got'
//       };
//       return;
//     }
//     let user = await User.find({userName: body.userName});
//     if (!user.length) {
//       const newUser = new User(body);
//       user = newUser.save();
//       ctx.status = 200;
//       ctx.body = {
//         message: '注册成功',
//         user,
//       }
//     } else {
//       ctx.status = 406;
//       ctx.body = {
//         message: '用户已存在'
//       }
//     }
//   } catch (error) {
//       ctx.throw(500);
//   }
// }

// module.exports = {
//   'POST /api/register': register
// }