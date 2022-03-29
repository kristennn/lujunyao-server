/**
 * @description 产品 api 路径
 * @author xiaofei
 */
const router = require('koa-router')()
const product = require('../controllers/product')

router.post('/empty-item/product/list', product.query)
router.post('/empty-item/product/delete', product.delete)
router.get('/empty-item/product/qr', product.showQR)
router.get('/empty-item/product/downloadImg', product.downloadImg)
router.get('/empty-item/product/downloadBulkImg', product.downloadBulkImg)
module.exports = router 

