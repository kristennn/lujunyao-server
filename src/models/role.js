/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2020-02-24 15:18:51
 * @LastEditTime: 2020-04-21 17:04:37
 */

const Sequelize = require('sequelize')
const sequelize = require('../db/seq')

const roleModel = sequelize.define('role', {
    description: {
        type: Sequelize.STRING,
    },
    role: {
        type: Sequelize.STRING,
    },
}, {
    // 启用时间戳
    timestamps: false,
    freezeTableName: true,
})

module.exports = roleModel
