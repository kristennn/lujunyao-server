/**
 * @description sequelize 同步数据库
 * @author xiaofei
 */

const seq = require('./seq')

require('../models/index')

// 测试连接
seq.authenticate().then(() => {
    console.log('auth ok')
}).catch(() => {
    console.log('auth err')
})

// 执行同步
seq.sync({ alter: true }).then(() => {
    console.log('sync ok')
    process.exit()
}).catch(err => {
    console.log('err', err)
})