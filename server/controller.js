const fs = require('fs')
const kswagger = require('koa-swagger-decorator')


//添加swagger的路由
function addSwaggerMapping(router) {
    kswagger.wrapper(router)
    router.swagger({
        title : 'App-publish Server',
        description : 'API DOC',
        version : '1.0.0',

        // [optional] default is root path.
        // prefix : '/api',

        // [optional] default is /swagger-html
        swaggerHtmlEndpoint : '/swagger-html',

        // [optional] default is /swagger-json
        swaggerJsonEndpoint : '/swagger-json',

        // [optional] additional options for building swagger doc eg. add api_key as
        // shown below
        swaggerOptions : {
            securityDefinitions: {
                ApiKeyAuth: {
                    type: 'apiKey', in: 'header',
                    name: 'Authorization'
                }
            }
        }
    })
}

function addControllers(router) {
    var files = fs.readdirSync(__dirname + '/controllers')
    var js_files = files.filter((f) => {
        return f.endsWith('.js')
    })

    for (var f of js_files) {
        console.log(`process controller: ${f}...`)
        let mapping = require(__dirname + '/controllers/' + f)
        router.map(mapping)
    }
}

module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')()
    addSwaggerMapping(router)
    addControllers(router, controllers_dir) 
    return router.routes()
}