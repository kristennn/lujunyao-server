/**
 * @description 品类表 model
 * @author xiaofei
 */

const Sequelize = require('sequelize')
const sequelize = require('../db/seq')

// 对应数据库中category表的字段
const categoryModel = sequelize.define('category', {
    name: {
        type: Sequelize.STRING,
    },
    code: {
        type: Sequelize.STRING,
    },
    glaze: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING,
    },
    series: {
        type: Sequelize.STRING,
    },
    size: {
        type: Sequelize.STRING,
    },
    remark: {
        type: Sequelize.STRING,
    },
    imgUrl: {
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

module.exports = categoryModel
