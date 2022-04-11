/**
 * @description 环境变量
 * @author xiaofei
 */

const ENV = process.env.NODE_ENV

module.exports = {
    // 环境变量
    isDev: ENV === 'dev',
    notDev: ENV !== 'dev',
    isProd: ENV === 'production',
    notProd: ENV !== 'production',
    isTest: ENV === 'test',
    notTest: ENV !== 'test',

    // 路径
    mobilePath: 'http://119.45.163.156:8080'
}