/**
 * @description 品类 api 路径
 * @author xiaofei
 */
const router = require('koa-router')()
const category = require('../controllers/category')

router.post('/empty-item/category/saveOrUpdate', category.saveOrUpdate)
router.post('/empty-item/category/list', category.query)
router.post('/empty-item/category/delete', category.delete)
router.get('/empty-item/category/detail', category.queryDetail)
router.post('/empty-item/category/generate', category.generate)
module.exports = router 

