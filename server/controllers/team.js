'use strict';

import {request, summary, tags, body, query, description,path} from 'koa-swagger-decorator';
import {User, userSchema} from "../model/user";
import Team from "../model/team";
import {responseWrapper} from "../helper/util";
import Fawn from "fawn";
import mongoose from "mongoose";


const tag = tags(['团队']);

var teamCreateSchema = {
    name: {
        type: 'string',
        required: true
    },
    icon: {
        type: 'string',
        required: false
    }
}

module.exports = class TeamRouter {
    @request('post', '/api/team/create')
    @summary('创建一个团队')
    @tag
    @body(teamCreateSchema)
    static async createTeam(ctx, next) {
        var user = ctx.state.user.data;
        var {body} = ctx.request;
        var team = await Team.findOne({name: body.name})
        if (team) {
            throw new Error("团队名称已被使用")
        }
        team = new Team(body);
        team.creatorId = user._id;
        team.members = [
            {
                _id: user._id,
                username: user.username,
                role: "owner"
            }
        ]
        
        var task = Fawn.Task();
        var result = await task.save(team)
            .update(User,{_id:user._id},{
                $push:{
                    team:{
                        _id:team._id,
                        name:team.name,
                        icon:team.icon,
                        role:"owner"
                    }
                }
            }).run({useMongoose: true});

        ctx.body = responseWrapper(team)
    }

    @request('post', '/api/team/dissolve/{id}')
    @summary('解散一个团队')
    @tag
    @path({ id: { type: 'string', required: true } })
    static async dissolveTeam(ctx, next) {
        const { id } = ctx.validatedParams;
        var user = ctx.state.user.data;
        var team = await Team.findOne({'_id':id,
            'members.username':user.username,'members.role':'owner'});
        if (!team) {
            throw new Error("该团队不存在或者您没有权限解散该团队")
        }
        await Team.deleteOne(team)
        ctx.body = responseWrapper(true,"团队已解散")
    }

    @request('post', '/api/team/{id}/member/{userId}')
    @summary('添加一个成员到某个团队')
    @tag
    @path({ id: { type: 'string', required: true } ,userId:{type:'string',required:true}})
    static async addMember(ctx, next){

    }

    @request('delete', '/api/team/{id}/member/{userId}')
    @summary('移除某个成员')
    @tag
    @path({ id: { type: 'string', required: true } ,userId:{type:'string',required:true}})
    static async removeMember(ctx, next){

    }





}