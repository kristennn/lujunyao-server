/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2020-04-24 17:14:46
 * @LastEditTime: 2020-05-19 13:23:40
 */

const Sequelize = require('sequelize')
const sequelize = require('../db/seq')

// 对应数据库中demo表的字段
const demoModel = sequelize.define('demo', {
    url: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING,
    },
    remark: {
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

module.exports = demoModel
