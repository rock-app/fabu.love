'use strict';

import {request, summary, tags, body, description} from '../swagger';
import {User, userSchema} from "../model/user";
import Team from "../model/team";
import {responseWrapper} from "../helper/util";

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
    @description('')
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
        team = await team.save()
        ctx.body = responseWrapper(team)
    }
}