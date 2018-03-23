import {
    request,
    summary,
    body,
    tags,
    middlewares,
    path,
    query,
    description
} from '../swagger';

import { APIError } from "../helper/rest";
import { responseWrapper } from "../helper/util";

const App = require('../model/app_model')
const Version = require('../model/version')
const Team = require('../model/team')

const tag = tags(['AppResource']);

//更新策略
var strategy = {
    'strategy':'string', //white / black ip地址白名单或者黑名单
    'iplist':'string', //用|分割的ip地址
    'updateMode':'string', // force / silent / normal/ 强制或者静默或者普通升级
    'downloadCountLimit':'number' //default 0 表示不现在下载次数
}

module.exports = class AppRouter {
    @request('get','/api/apps/{teamId}')
    @summary("获取某用户或某团队下App列表(分页)")
    @query(
        {
        page:{type:'number',default:0,description:'分页页码(可选)'},
        size:{type:'number',default:10,description:'每页条数(可选)'}
    })
    @path({teamId:{type:'string',description:'团队id(可选),不传则获取该用户下的App'}})
    @tag
    static async getApps(ctx,next){
        var page = ctx.query.page || 0
        var size = ctx.query.size || 10
        var user = ctx.state.user.data;
        var { teamId } = ctx.validatedParams;
        var result = await App.find(
                {'ownerId':teamId}
            ).limit(size).skip(page * size)
        ctx.body = responseWrapper(result)
    }

    @request('get','/api/apps/{teamId}/{id}')
    @summary("获取某个应用详情")
    @tag
    @path({
        teamId:{type:'string'},
        id:{type:'string',description:'应用id'}
    })
    static async getAppDetail(ctx,next){
        var user = ctx.state.user.data
        var { teamId,id } = ctx.validatedParams;
        //todo: 这里其实还要判断该用户在不在team中
        //且该应用也在team中,才有权限查看
        var app = await App.findById(id)
        ctx.body = responseWrapper(app)
    }

    @request('delete','/api/apps/{teamId}/{id}')
    @summary("删除某个应用")
    @tag
    @path({
        teamId:{type:'string'},
        id:{type:'string',description:'应用id'}
    })
    static async deleteApp(ctx,next){
        var user = ctx.state.user.data
        var { teamId,id } = ctx.validatedParams;  
        var team = await Team.findOne({_id:teamId,members:{
            $elemMatch:{
                 username:user.username,
                 $or: [
                    { role: 'owner' },
                    { role: 'manager' }
                ]
            }
        }})
        var app = await App.find({_id:id,ownerId:team._id})
        if (!app) {
            throw new Error("应用不存在或您没有权限查询该应用")
        }
        await App.deleteOne(app)
        ctx.body = responseWrapper(true,"应用已删除")
    }

    @request('get','/api/apps/{teamId}/{id}/versions')
    @summary("获取某个应用的版本列表(分页)")
    @path({
        teamId:{type:'string'},
        id:{type:'string',description:'应用id'}
    })
    @query({
        page:{type:'number',default:0,description:'分页页码(可选)'},
        size:{type:'number',default:10,description:'每页条数(可选)'}
    })
    @tag
    static async getAppVersions(ctx,next){
        var user = ctx.state.user.data
        var { teamId,id } = ctx.validatedParams
        var { page,size } = ctx.query
        var team = await Team.find({_id:teamId,members:{
            $elemMatch:{ username:user.username}
        }})
        var app = await App.find({_id:id,ownerId:team._id})
        if (!app) {
            throw new Error("应用不存在或您没有权限查询该应用")
        }
        var versions = await Version.find({appId:id})
            .limit(size).skip(page * size)
        ctx.body = responseWrapper(versions)
    }

    @request('get','/api/apps/{teamId}/{id}/versions/{versionId}')
    @summary("获取某个应用的某个版本详情")
    @tag
    @path({
        teamId:{type:'string'},
        id:{type:'string',description:'应用id'},
        versionId:{type:'string',description:'版本id'}
    })
    static async getAppVersionDetail(ctx,next){
        //todo: 好像暂时用不上
        
        // if (!version){
        //     throw new Error("版本不存在")
        // }
        // if (version.lasted && version.active){
        //     ctx.body = responseWrapper(version)
        //     return
        // }
        var user = ctx.state.user.data
        var { teamId,id,versionId } = ctx.validatedParams
        var team = await Team.find(
            {_id:teamId,members:{
                $elemMatch:{ username:user.username}}})
        if (!team){
            throw new Error("没有权限查看该应用")
        }
        var version = await Version.findById(versionId)
        if (!version){
            throw new Error("应用不存在")
        }
        ctx.body = responseWrapper(version)
    }

    @request('delete','/api/apps/{teamId}/{id}/versions/{versionId}')
    @summary("删除某个版本")
    @tag
    static async deleteAppVersion(ctx,next){
        var user = ctx.state.user.data
        var { teamId,id,versionId } = ctx.validatedParams;  
        var team = await Team.findOne({_id:teamId,members:{
            $elemMatch:{
                 username:user.username,
                 $or: [
                    { role: 'owner' },
                    { role: 'manager' }
                ]
            }
        }})
        var app = await App.find({_id:id,ownerId:team._id})
        if (!app) {
            throw new Error("应用不存在或您没有权限查询该应用")
        }
        var version = await Version.find({_id:versionId})
        var result = Version.deleteOne(version)
        ctx.body = responseWrapper(true,"版本已删除")
    }


    @request('post','/api/app/{id}/version/{versionId}/active')
    @summary("设置某个版本为当前活跃版本(检查更新会检查到该版本)")
    @tag
    @body(strategy)
    static async activeAppVersion(ctx,next){
        
    }

    @request('post','/api/app/{id}/version/{versionId}/strategy')
    @summary("设置版本发布策略(ip白名单/黑名单/限制更新次数限制/静默/强制)")
    @tag
    @body(strategy)
    static async setVersionUpdateStrategy(ctx,next){
        
    }

    @request('get','/api/app/checkupdate/{appId}')
    @summary("检查版本更新")
    @tag
    @path({currentVersionCode:{type:'string'}})
    static async checkUpdate(ctx,next){
        
    }

}


// function appInTeamAndUserIsManager(appId,teamId,userId) {
//     var team = await Team.find({_id:teamId,members:{
//         $elemMatch:[
//             { _id:userId,role:"owner" },
//             { _id:userId,role:"manager" },
//         ]},
//     })
//     var app = await App.find({_id:id,ownerId:team._id})
// }

// function appInTeamAndUserIsGuest(appId,teamId,userId) {
//     var team = await Team.find({_id:teamId,members:{
//         $elemMatch:[
//             { _id:userId,role:"owner" },
//             { _id:userId,role:"manager" },
//         ]},
//     })
//     var app = await App.find({_id:id,ownerId:team._id})
// }


//设置模糊查询
function modifyFilter(filter) {
    let result = {}
    for (var key in filter) {
        result[key] = {$regex: filter[key]}
    }
    return result
}



