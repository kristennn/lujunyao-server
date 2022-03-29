/**
 * @description 品类 controller
 * @author xiaofei
 */
const { categoryModel, productModel } = require('../models/index')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { mobilePath } = require('../utils/env')

// 获取列表
// eslint-disable-next-line max-statements
exports.query = async ctx => {
    const request = ctx.request.body
    const where = {}
    if (request.name) {
        where.name = {
            // 模糊查询
            [Op.like]: `%${request.name}%`
        }
    }
    if (request.code) {
        where.code = {
            // 模糊查询
            [Op.like]: `%${request.name}%`
        }
    }
    if (request.glaze) {
        where.glaze = request.glaze
    }
    if (request.type) {
        where.type = request.type
    }
    if (request.series) {
        where.series = request.series
    }
    if (request.createdAt) {
        where.createdAt = {
            // 模糊查询
            [Op.between]: request.createdAt
        }
    }
    try {
        const categoryList = await categoryModel.findAll({
            where
        })
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '查询成功',
            data: categoryList
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

// 详情
exports.queryDetail = async ctx => {
    const request = ctx.query
    try {
        const categoryList = await categoryModel.findOne({
            where: {
                id: request.id
            }
        })
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '查询成功',
            data: categoryList
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


// 新增或修改
// eslint-disable-next-line max-statements
exports.saveOrUpdate = async ctx => {
    const request = ctx.request.body
    console.log(request)
    // 修改
    if (request.id) {
        try {
            await categoryModel.update({
                name: request.name,
                code: request.code,
                glaze: request.glaze,
                type: request.type,
                series: request.series,
                size: request.size,
                remark: request.remark,
                imgUrl: request.imgUrl
            }, {
                where: {
                    id: request.id,
                },
            })
            ctx.status = 200
            ctx.body = {
                code: 'SUCCESS',
                msg: '修改成功'
            }

        } catch (error) {
            console.error(error)
            ctx.status = 200
            ctx.body = {
                code: 'FAILED',
                msg: '修改失败'
            }
        }
    } else {
        // 新增
        try {
            await categoryModel.create({
                ...request
            })

            ctx.status = 200
            ctx.body = {
                code: 'SUCCESS',
                msg: '添加成功'
            }
        } catch (error) {
            console.log(error)
            ctx.status = 200
            ctx.body = {
                code: 'FAILED',
                msg: '添加失败'
            }
        }
    }

}

// 删除
exports.delete = async ctx => {
    const request = ctx.request.body
    console.log(request)

    try {
        await categoryModel.destroy({
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

// 生成产品
exports.generate = async ctx => {
    const request = ctx.request.body
    console.log(request)

    try {
        // 1. 根据 request.id 查找 category
        const categoryRes = await categoryModel.findOne({
            where: {
                id: request.id
            }
        })
        const categoryItem = categoryRes.dataValues
        for (let i = 0; i < request.amount; i++) {
            // 先新建
            const productRes = await productModel.create({
                categoryId: request.id
            })
            // 取到新建信息的id，并由此生成code
            const productItem = productRes.dataValues
            const code = categoryItem.code + autoGenerateCode(productItem.id)
            const url = mobilePath + '?product=' + code 
            // 更新code和url
            await productModel.update(
                { url: url, code: code }, 
                { where: { id: productItem.id } }
            )
        }
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '生成成功'
        }
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '生成失败'
        }
    }
}

/**
 * @description 根据id生成自增code，共7位，缺少位数使用随机数替代
 * @param id 数据id
 */
autoGenerateCode = (id) => {
    let code = String(id)
    if (code.length > 7) {
        code = code.slice(-7)
    } else if (code.length < 7) {
        const restLength = 7 - code.length
        let randomCode = ''
        for (let i = 0; i < restLength; i++) {
            randomCode += Math.floor(Math.random() * 9)
        }
        code = randomCode + code
    }
    return code
}
