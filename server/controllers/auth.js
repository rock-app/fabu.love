import {request, summary, tags, body} from 'koa-swagger-decorator';
import { User,userSchema } from "../model/user";

const jwt = require('jsonwebtoken');

const tag = tags(['认证']);


export default class AuthRouter{

    @request('POST','/api/user/login')
    @summary('登录')
    @tag
    static async login(ctx, next) {
        const {body} = ctx.request
        try {
            const user = await User.findOne({username: body.username});
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
                // ctx.header.token = jwt.sign({     data: user,     exp: Math.floor(Date.now()
                // / 1000) + (60 * 60) }, 'jwt-secret')
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
    
    @request('POST', '/api/user/register')
    @summary('注册用户')
    @body(userSchema)
    @tag
    static async register(ctx, next) {
        const {body} = ctx.request;
        try {
            if (!body.username || !body.password) {
                ctx.status = 401;
                ctx.body = {
                    error: 'expected an object with userName, password but got'
                };
                return;
            }
            let user = await User.find({username: body.username});
            if (!user.length) {
                const newUser = new User(body);
                user = newUser.save();
                ctx.status = 200;
                ctx.body = {
                    message: '注册成功',
                    user: user
                }
            } else {
                ctx.status = 406;
                ctx.body = {
                    message: '用户已存在'
                }
            }
        } catch (error) {
            ctx.throw(500);
        }
    }
}