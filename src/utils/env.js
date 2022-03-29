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
    mobilePath: ENV === 'dev' ? 'www.dev.com' : 'www.prod.com'
}