'use strict';

import {
    request,
    summary,
    tags,
    body,
    query,
    path,
    description
} from '../swagger';
import { User, userSchema } from "../model/user";
import Message from "../model/message";
import Team from "../model/team";
import { responseWrapper } from "../helper/util";
import Fawn from "fawn";
import mongoose from "mongoose";
import validator from "../helper/validator";
import Mail from "../helper/mail"
import config from "../config"
import { userInTeamIsManager, userInTeam } from "../helper/validator"
import _ from 'lodash';


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
        var { body } = ctx.request;
        var team = new Team(body);
        team.creatorId = user._id;
        team.members = [{
            _id: user._id,
            username: user.username,
            email: user.email,
            role: "owner"
        }]

        var task = Fawn.Task();
        var result = await task
            .save(team)
            .update(User, {
                _id: user._id
            }, {
                $push: {
                    teams: {
                        _id: team._id,
                        name: team.name,
                        icon: team.icon,
                        role: "owner"
                    }
                }
            })
            .run({ useMongoose: true });

        ctx.body = responseWrapper(true, "团队创建成功", team)
    }

    @request('delete', '/api/team/dissolve/{id}')
    @summary('解散一个团队')
    @tag
    @path({
        id: {
            type: 'string',
            required: true
        }
    })
    static async dissolveTeam(ctx, next) {
        const { id } = ctx.validatedParams;
        var user = ctx.state.user.data;
        var team = await Team.findOne({ '_id': id, 'members.username': user.username, 'members.role': 'owner' });
        if (!team) {
            throw new Error("该团队不存在或者您没有权限解散该团队")
        }

        if (team._id == user._id) {
            throw new Error("用户默认团队无法解散")
        }

        var membersId = []
        if (team.members.length > 0) {
            for (var m of team.members) {
                membersId.push(m._id)
            }
        }

        if (membersId.length > 0) {
            await User.update({ _id: { $in: membersId } }, {
                $pull: {
                    teams: { _id: team._id }
                }
            })
        }

        await Team.deleteOne({ _id: team._id })

        ctx.body = responseWrapper(true, "团队已解散")
    }

    @request('post', '/api/team/{teamId}/role')
    @summary('修改用户角色')
    @tag
    @path({
        teamId: {
            type: 'string',
            required: true
        }
    })
    @body({ memberId: { type: 'string', required: true }, role: { type: 'string', required: true, description: "传入manager或者guest" } })
    static async changeMemberRole(ctx, next) {
        var { teamId } = ctx.validatedParams;
        var user = ctx.state.user.data;
        var body = ctx.request.body
        var team = validator.userInTeamIsManager(user._id, teamId)
        if (!team) {
            throw new Error("没有权限修改该用户角色")
        }

        if (body.role != 'manager' && body.role != 'guest') {
            throw new Error("请传入正确的角色参数")
        }
        await User.updateOne({ _id: body.memberId, 'teams._id': teamId }, {
            $set: {
                'teams.$.role': body.role
            }
        })

        await Team.updateOne({ _id: teamId, 'members._id': body.memberId }, {
            $set: {
                'members.$.role': body.role
            }
        })

        ctx.body = responseWrapper(true, "用户角色已更新")
    }

    @request('post', '/api/team/{teamId}/invite')
    @summary('邀请某成员加入团队')
    @tag
    @body({
        emailList: {
            type: 'array',
            items: {
                type: 'string'
            },
            description: "邮箱列表",
            required: true
        },
        role: { type: 'string', required: true, description: "成员角色manager/guest" }
    })
    @path({
        teamId: {
            type: 'string',
            required: true
        }
    })
    static async addMember(ctx, next) {
        var { teamId } = ctx.validatedParams;
        var user = ctx.state.user.data;
        var emailList = ctx.request.body.emailList;
        var body = ctx.request.body
        if (!(body.role === 'manager' || body.role === 'guest')) {
            throw new Error("请传入正确的用户角色")
        }

        var team = await Team.findOne({
            _id: teamId,
            members: {
                $elemMatch: {
                    _id: user._id,
                    $or: [
                        { role: 'owner' },
                        { role: 'manager' }
                    ]
                }
            },
        }, "_id name members")

        if (!team) {
            throw new Error("团队不存在,或者您没有权限邀请用户加入")
        }

        var userList = await User.find({
            email: { $in: emailList }
        }, "username email")

        // 如果用户不存在则发送邮件邀请
        var dif = _.difference(emailList, _.map(userList, 'email'))
        if (dif.length != 0) {
            Mail.send(dif, `${user.username}邀请您加入爱发布`, `${user.username}邀请您加入${team.name}"团队.如果您还没有注册爱发布，请点击${config.baseUrl}注册`)
        }

        var teamList = []
        for (var u of userList) {
            if (!(_.find(team.members, function(o) {
                    return o.email == u.email
                }))) {
                teamList.push({
                    _id: u.id,
                    username: u.username,
                    email: u.email,
                    role: body.role
                })
            }
        }

        if (teamList.length <= 0) {
            if (dif.length > 0) {
                ctx.body = responseWrapper(true, "已发送邀请")
            } else {
                ctx.body = responseWrapper(true, "用户已加入该团队")
            }
            return
        }

        var task = Fawn.Task();
        var result = await task
            .update(Team, { _id: teamId }, {
                $addToSet: { members: { $each: teamList } }
            })
            .update(User, { email: { $in: emailList } }, {
                $push: {
                    teams: {
                        _id: teamId,
                        name: team.name,
                        icon: team.icon,
                        role: body.role
                    }
                }
            })
            .run({ useMongoose: true });


        for (var u of userList) {
            var message = new Message();
            message.category = "INVITE";
            message.content = user.username + "邀请您加入" + team.name + "团队."
            message.sender = user._id;
            message.receiver = u._id;
            // message.data = jwt.sign({
            //     data: {
            //         teamId: team._id,
            //         invited: userIdentifier
            //     },
            //     exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
            // }, 'jwt-secret')
            message.save();
        }

        ctx.body = responseWrapper(true, "已发送邀请")
    }

    @request('delete', '/api/team/{id}/member/{userId}')
    @summary('移除某个成员,或者自己离开团队')
    @tag
    @path({
        id: {
            type: 'string',
            required: true
        },
        userId: {
            type: 'string',
            required: true
        }
    })
    static async removeMember(ctx, next) {
        var { id, userId } = ctx.validatedParams;
        var user = ctx.state.user.data;
        //如果传入的id和当前登录用户的id相等 表示是自己离开团队
        var team
        if (userId === user._id) {
            team = await userInTeam(user._id, id)
        } else {
            team = await userInTeamIsManager(user._id, id)
        }

        if (!team) {
            throw new Error("团队不存在或该用户没有权限删除用户")
        }
        var task = Fawn.Task();
        var result = await task
            .update(team, { $pull: { members: { _id: userId } } })
            .update(User, {
                _id: userId
            }, {
                $pull: {
                    teams: {
                        _id: team._id,
                    }
                }
            }).run({ useMongoose: true });
        ctx.body = responseWrapper(true, "请求成功")
    }


    @request('get', '/api/team/{teamId}/members')
    @summary('获取团队成员列表')
    @tag
    @path({
        teamId: {
            type: 'string',
            required: true
        }
    })
    static async getMembers(ctx, next) {
        var { teamId } = ctx.validatedParams;
        var user = ctx.state.user.data;
        //如果传入的id和当前登录用户的id相等 表示是自己离开团队
        var team = await Team.findOne({
            _id: teamId,
        })
        if (!team) {
            throw new Error("团队不存在")
        }
        ctx.body = responseWrapper(team)
    }

    @request('post', '/api/team/{teamId}/profile')
    @summary('更新团队名称')
    @tag
    @body({
        name: {
            type: 'string',
            required: true
        }
    })
    @path({
        teamId: {
            type: 'string',
            required: true
        }
    })
    static async updateTeamProfile(ctx, next) {
        console.log(ctx)
        var { teamId } = ctx.validatedParams;
        var user = ctx.state.user.data;
        var body = ctx.request.body

        var team = await Team.findOne({
            _id: teamId,
            members: {
                $elemMatch: {
                    _id: user._id,
                    $or: [
                        { role: 'owner' },
                        { role: 'manager' }
                    ]
                }
            },
        }, "_id members")

        if (!team) {
            throw new Error("团队不存在或者您没有权限修改该信息")
        }
        await Team.updateOne({
            _id: teamId,
        }, { name: body.name })

        var membersId = []
        if (team.members.length > 0) {
            for (var m of team.members) {
                membersId.push(m._id)
            }
        }

        if (membersId.length > 0) {
            await User.updateMany({ _id: { $in: membersId }, 'teams._id': teamId }, {
                $set: {
                    'teams.$.name': body.name
                }
            })
        }

        ctx.body = responseWrapper(true, "团队名称已修改")
    }

}