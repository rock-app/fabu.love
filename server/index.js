// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
import router from './controller';
import config from './config';

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
    // 导入controller middleware:
const rest = require('./helper/rest')
const serve = require('koa-static');
const cors = require('koa-cors')
const koajwt = require('koa-jwt')
const path = require('path')
const fs = require('fs')
const send = require('koa-send');
const mount = require('koa-mount')

const app = new Koa()

import Varify from './helper/varify'
import Helper from './helper/MiddleHelper'
import { isNull, isUndefined } from 'util';

var helper = new Helper()

app.use(cors())
app.use(bodyParser())
app.use(serve(path.resolve(config.fileDir)))
app.use(serve(path.join(__dirname, '..', 'client/dist')));

app.use(function(ctx, next) {
    if (ctx.request.path.indexOf("/api") != 0) {
        ctx.response.type = 'html';
        ctx.response.body = fs.readFileSync(path.join(__dirname, '..', 'client/dist/index.html'), 'utf8');
    } else {
        return next()
    }
})

var middleware = koajwt({ secret: config.secret, debug: true }).unless({
    path: [
        '/api/user/register',
        '/api/user/login',
        '/api/user/resetPassword',
        '/api/swagger',
        '/api/swagger.json',
        /\/api\/plist\/.+/,
        /\/api\/count\/.+/,
        /\/api\/app\/.+/
    ]
})

app.use(helper.skip(middleware).if((ctx) => {
    var key = ctx.request.headers['apikey']
    return !isUndefined(key)
}))

app.use(async(ctx, next) => {
    var key = ctx.request.headers['apikey']
    if (!isUndefined(key)) {
        var user = await Varify.auth(key).catch(error => {
            throw error
        })
        ctx.state.user = { data: user }
        await next()
    } else {
        await next()
    }
})

app.use(rest.restify())
app.use(router.routes())

export default app.listen(config.port, () => {
    console.log(`App is listening on ${config.port}.`);
});