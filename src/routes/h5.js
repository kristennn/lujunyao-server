/**
 * @description 产品 api 路径
 * @author xiaofei
 */
const router = require('koa-router')()
const h5 = require('../controllers/h5')

router.get('/empty-item/h5', h5.getInfo)
module.exports = router 

