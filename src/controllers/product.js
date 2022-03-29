/**
 * @description 产品 controller
 * @author xiaofei
 */
const { productModel } = require('../models/index')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const qr = require('qr-image')

// 获取列表
// eslint-disable-next-line max-statements
exports.query = async ctx => {
    const request = ctx.request.body
    const where = {}
    if (request.categoryId) {
        where.categoryId = request.categoryId
    }
    if (request.code) {
        where.code = {
            // 模糊查询
            [Op.like]: `%${request.code}%`
        }
    }
    if (request.createdAt) {
        where.createdAt = {
            // 模糊查询
            [Op.between]: request.createdAt
        }
    }
    try {
        const productList = await productModel.findAll({
            where
        })
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '查询成功',
            data: productList
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

// 删除
exports.delete = async ctx => {
    const request = ctx.request.body
    console.log(request)

    try {
        await productModel.destroy({
            where: {
                id: request.id
            },
            force: true
        })

        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '删除成功'
        }
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '删除失败'
        }
    }
}

exports.showQR = async ctx => {
    const request = ctx.query
    try {
        const productRes = await productModel.findOne({
            where: {
                id: request.id
            }
        })
        const productItem = productRes.dataValues
        const url = productItem.url
        const img = qr.image(url, { type: 'png' })
        ctx.type = 'image/png'
        ctx.body = img
        ctx.status = 200
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '删除失败'
        }
    }
}

// 下载单张二维码图片
exports.downloadImg = async ctx => {
    const request = ctx.query
    try {
        const productRes = await productModel.findOne({
            where: {
                id: request.id
            }
        })
        const productItem = productRes.dataValues
        const url = productItem.url
        const img = qr.image(url, { type: 'png' })
        const filename = productItem.code + '.png'
        ctx.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename=${filename}`,
        })
        debugger
        ctx.body = img
        ctx.status = 200
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '下载失败'
        }
    }
}

// 批量下载二维码图片
exports.downloadBulkImg = async ctx => {
    const request = ctx.request.body
    console.log(request)

    try {
        await productModel.destroy({
            where: {
                id: request.id
            },
            force: true
        })

        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '删除成功'
        }
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '删除失败'
        }
    }
}
