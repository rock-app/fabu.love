'use strict';

import {request, summary, tags, body,description} from 'koa-swagger-decorator';
import {User, userSchema} from "../model/user";
import { responseWrapper } from "../helper/util";

const jwt = require('jsonwebtoken');

const tag = tags(['认证']);

var loginSchema = {
    username: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    }
}

var registerSchema = {
    username: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    email : {
        type: 'string',
        required: true
    }
}

module.exports = class AuthRouter {

    @request('post', '/api/user/login')
    @summary('登录')
    @tag
    @body(loginSchema)
    static async login(ctx, next) {
        const {body} = ctx.request
        const user = await User.findOne({username: body.username,password:body.password},'username');
        if (!user) {
            throw new Error('用户名或密码错误')
        }
        ctx.body = {
            message: '登录成功',
            token: jwt.sign({
                data: user,
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            }, 'jwt-secret')
        }
    } 
       

    @request('post', '/api/user/register')
    @summary('注册用户')
    @body(registerSchema)
    @tag
    static async register(ctx, next) {
        const {body} = ctx.request;
        let user = await User.find({username: body.username});
        if (!user.length) {
            const newUser = new User(body);
            user = await newUser.save();
            ctx.status = 200;
            ctx.body = responseWrapper(user)
        } else {
            ctx.status = 406;
            ctx.body = responseWrapper(false,"用户已存在")
        }
    }
}