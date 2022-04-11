/**
 * @description h5 controller
 * @author xiaofei
 */
const { productModel, categoryModel } = require('../models/index')
const Sequelize = require('sequelize')
const { Op } = Sequelize

// 获取信息
exports.getInfo = async ctx => {
    const { product } = ctx.query
    try {
        const info = await productModel.findOne({
            where: {
                code: product
            },
            include: [
                {
                    model: categoryModel
                }
            ]
        })
        console.log('info', info)
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '查询成功',
            data: {
                code: info.code,
                category: info.category
            }
        }
    } catch (error) {
        console.log(error)
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '查询失败'
        }
    }
}
