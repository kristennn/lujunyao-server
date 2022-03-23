/**
 * @description sequelize 实例
 * @author xiaofei
 */

const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../conf/db')
const { isProd, isTest } = require('../utils/env')

const { host, user, password, database, max, min, idle } = MYSQL_CONF
const conf = {
    host: host,
    dialect: 'mysql'
}

// 单元测试时不要打印 sql 语句
if (isTest) {
    conf.logging = () => {}
}

// 线上环境使用连接池
if (isProd) {
    conf.pool = { max, min, idle }
}

const seq = new Sequelize(database, user, password, conf)

module.exports = seq