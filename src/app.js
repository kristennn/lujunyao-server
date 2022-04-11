const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const sessionStore = require('./utils/session')
const redisStore = require('koa-redis')
const notLoginApi = ['/empty-item/login', '/empty-item/getCaptcha', '/empty-item/h5']

const { REDIS_CONF } = require('./conf/db')
const { isProd } = require('./utils/env')
const { SESSION_SECRET_KEY } = require('./conf/secretKeys')

const role = require('./routes/role')
const user = require('./routes/user')
const menu = require('./routes/menu')
const api = require('./routes/api')
const demo = require('./routes/demo')
const category = require('./routes/category')
const product = require('./routes/product')
const h5 = require('./routes/h5')
const koaStatic = require('koa-static')
const path = require('path')
const source = koaStatic(`${path.join(__dirname)}/public`)


// error handler
let onerrorConf = {}
// if (isProd) {
//     onerrorConf = {
//         redirect: '/error'
//     }
// }
onerror(app, onerrorConf)

// middlewares
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// session 配置
app.keys = [SESSION_SECRET_KEY]
// const CONFIG = {
//     key: 'lujunyao.sid',
//     prefix: 'lujunyao:sess',
//     cookie: {
//         path: '/',
//         httpOnly: true,
//         // maxAge: 24 * 60 * 60 * 1000, // 单位 ms
//         maxAge: 86400000,
//         autoCommit: true,
//         overwrite: true,
//         signed: false,
//         rolling: false,
//         renew: false,
//     },
//     store: redisStore({
//         all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
//     })
// }

const CONFIG = {
    key: 'sessionId',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: false,
    rolling: false,
    renew: false,
    store: sessionStore
}

app.use(session(CONFIG, app))


// 请求拦截
app.use(async (ctx, next) => {
    
    if (notLoginApi.indexOf(ctx.path) === -1 && !ctx.session.isLogin && !(/\/uploadImg/).test(ctx.path)) {
        ctx.throw(401, '用户未登录')
        return
    }

    let { path } = ctx
    console.log('ctx', ctx)
    path = path.replace(/(\w*)\/$/, '$1')
    
    // 当前接口需要校验权限
    if (ctx.session.isLogin && ctx.session.allAuthApi.indexOf(path) !== -1) {
        
        // 无接口访问权限
        if (ctx.session.allowApi.indexOf(ctx.path) === -1) {
            ctx.status = 200
            ctx.body = {
                code: 'FAILED',
                msg: '无权限'
            }
            return
        }
    }

    let { referer } = ctx.header

    referer = referer.replace(/^\w+\:\/\/(\w|\.)+(\:\d+)?/, '')
    referer = referer.replace(/\?.*/, '')
    referer = referer.replace(/(\w*)\/$/, '$1')

    // 无页面访问权限
    if (ctx.session.isLogin && ctx.session.allowPage.indexOf(referer) === -1 && path !== '/empty-item/sysUser/toUserDetails') {
        ctx.throw(403, '无权限')
        return
    }

    await next()
})


// logger
// app.use(async (ctx, next) => {
//     const start = new Date()
//     await next()
//     const ms = new Date() - start
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

app.use(source)

// routes
app.use(role.routes(), role.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(menu.routes(), menu.allowedMethods())
app.use(api.routes(), api.allowedMethods())
app.use(demo.routes(), demo.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(product.routes(), product.allowedMethods())
app.use(h5.routes(), h5.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

app.listen(4000, () => {
    console.log('4000端口已启动')
})

module.exports = app
