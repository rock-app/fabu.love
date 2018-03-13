import {
    request,
    summary,
    body,
    tags,
    middlewares,
    path,
    description
} from 'koa-swagger-decorator';

import { APIError } from "../helper/rest";

// const APIError = require('../helper/rest').APIError
const App = require('../model/app_model')


// App.find().remove().exec()

// var date = new Date(2018, 1, 1, 0, 0, 0, 0);
// for (let i = 0; i < 95; i++) {
//     let platform, version
//     if (i % 2 === 0) {
//         platform = 'android'
//         version = '1.2.0'
//     } else {
//         platform = 'ios'
//         version = '1.3.0'
//     }
//     var app = new App({

//         name: '千帆优货',
//         version: version,
//         describe: '-增加四级地址支持 增加四级地址支持增加四级地址支持 - 稳定性提升',
//         state: '正常',
//         isRelease: true,
//         type: 'release',
//         downloadCounts: i,
//         updateTime: new Date(date.getTime() + 60 * 60 * 1000 * i)
//     })
//     app.save()
// }

const tag = tags(['AppResource']);

module.exports = class AppRouter {
    @request('post','/api/apps')
    @description("获取所有App列表")
    @summary('获取所有App列表')
    @tag
    static async getApps(ctx,next){
        var page = parseInt(ctx.request.query.page) || 0
        var pageSize = parseInt(ctx.request.query.pageSize) || 0
        var isDesc = ctx.request.query.isDesc === 'true' || false
        var sortKey = ctx.request.query.sortKey || ''
        let filter = ctx.request.body || {}
        let sortParam = {}
        if (sortKey) 
            sortParam = {
                [sortKey]: isDesc
                    ? -1
                    : 1
            }

        let response
        await Promise.all([
            App.count(modifyFilter(filter)),
            App
                .find(modifyFilter(filter))
                .sort(sortParam)
                .limit(parseInt(pageSize))
                .skip(page * pageSize)
        ]).then(res => {
            let total = res[0]
            response = {
                applist: res[1],
                page: page,
                pageSize: pageSize,
                total: total,
                pageCount: Math.ceil(total / pageSize)
            }
        })
        ctx.rest(response)
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



