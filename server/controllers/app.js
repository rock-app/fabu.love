import {
    request,
    summary,
    body,
    tags,
    middlewares,
    path,
    query,
    description
} from 'koa-swagger-decorator';

import { APIError } from "../helper/rest";
import { responseWrapper } from "../helper/util";

const App = require('../model/app_model')

const tag = tags(['AppResource']);

//更新策略
var strategy = {
    'strategy':'string', //white / black ip地址白名单或者黑名单
    'iplist':'string', //用|分割的ip地址
    'updateMode':'string', // force / silent / normal/ 强制或者静默或者普通升级
    'downloadCountLimit':'number' //default 0 表示不现在下载次数
}

module.exports = class AppRouter {
    @request('get','/api/apps')
    @summary("获取某用户或某团队下App列表(分页)")
    @query({
        team:{type:'string',description:'团队id(可选),不传则获取该用户下的App'},
        page:{type:'number',default:0,description:'分页页码(可选)'},
        size:{type:'number',default:10,description:'每页条数(可选)'}
    })
    @tag
    static async getApps(ctx,next){
        var team = ctx.query.team
        var page = ctx.query.page || 0
        var size = ctx.query.size || 10
        var user = ctx.state.user.data;
        var result;
        if (team) {
            result = await App.find(
                {'ownerType':'team','ownerId':team}
            ).limit(size).skip(page * size)
        }else{
            result = await App.find(
                {'ownerType':'user','ownerId':user._id}
            ).limit(size).skip(page * size)
        }
        ctx.body = responseWrapper(result)
    }

    @request('get','/api/app/{id}')
    @summary("获取某个应用详情")
    @tag
    static async getAppDetail(ctx,next){

    }

    @request('delete','/api/app/{id}')
    @summary("删除某个应用")
    @tag
    static async deleteApp(ctx,next){

    }

    @request('get','/api/app/{id}/versions')
    @summary("获取某个应用的版本列表(分页)")
    @query({
        page:{type:'number',default:0,description:'分页页码(可选)'},
        size:{type:'number',default:10,description:'每页条数(可选)'}
    })
    @tag
    static async getAppVersions(ctx,next){

    }

    @request('get','/api/app/{id}/version/{versionId}')
    @summary("获取某个应用的某个版本详情")
    @query({
        page:{type:'number',default:0,description:'分页页码(可选)'},
        size:{type:'number',default:10,description:'每页条数(可选)'}
    })
    @tag
    static async getAppVersionDetail(ctx,next){
        
    }

    @request('delete','/api/app/{id}/version/{versionId}')
    @summary("删除某个版本")
    @query({
        page:{type:'number',default:0,description:'分页页码(可选)'},
        size:{type:'number',default:10,description:'每页条数(可选)'}
    })
    @tag
    static async deleteAppVersion(ctx,next){
        
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




//设置模糊查询
function modifyFilter(filter) {
    let result = {}
    for (var key in filter) {
        result[key] = {$regex: filter[key]}
    }
    return result
}



