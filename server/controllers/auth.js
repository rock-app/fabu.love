'use strict';

import {request, summary, tags, body,description} from '../swagger';
import {User, userSchema} from "../model/user";
import Team from "../model/team"
import { responseWrapper } from "../helper/util";
import bcrypt from "bcrypt"
import Fawn from "fawn"

const jwt = require('jsonwebtoken');

const tag = tags(['认证']);

var loginSchema = {
    username: {
        type: 'string',
        required: true
        // a: {
        //     type: 'string'
        // },
        // b: {
        //     type: 'string'
        // }
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
        const user = await User.findOne({username: body.username},'username password');
        if (user) {
            let valide = await bcrypt.compare(body.password, user.password)
            if (!valide) {
                throw new Error('用户名或密码错误')
            }
        } else {
            throw new Error('用户名或密码错误')
        }

        ctx.body = responseWrapper(jwt.sign({
                data: user,
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            }, 'jwt-secret'))  
    } 
       

    @request('post', '/api/user/register')
    @summary('注册用户')
    @body(registerSchema)
    @tag
    static async register(ctx, next) {
        var {body} = ctx.request;
        body.password = await bcrypt.hash(body.password, 10) // 10是 hash加密的级别, 默认是10，数字越大加密级别越高
        let user = await User.find({username: body.username});
        if (!user.length) {
            var newUser = new User(body);

            var team = new Team();
            team._id = user._id;
            team.name = "我的团队";
            team.creatorId = user._id;
            team.members = [
                {
                    _id: user._id,
                    username: user.username,
                    role: "owner"
                }
            ]
            user.teams = [{
                _id:team._id,
                name:team,
                role:"owner"
            }]
            var task = Fawn.Task();
            var result = await task
                .save(team)
                .save(user)
                .run({useMongoose: true});

            ctx.body = responseWrapper(user)
        } else {
            throw new Error("用户已存在")
        }
    }
}