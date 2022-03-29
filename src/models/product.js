/**
 * @description 产品表 model
 * @author xiaofei
 */

const Sequelize = require('sequelize')
const sequelize = require('../db/seq')

// 对应数据库中product表的字段
const productModel = sequelize.define('product', {
    code: {
        type: Sequelize.STRING,
    },
    categoryId: {
        type: Sequelize.INTEGER,
    },
    url: {
        type: Sequelize.STRING,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    },
}, {
    // 启用时间戳
    timestamps: true,
    freezeTableName: true,
})

module.exports = productModel
