/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2020-04-17 11:00:37
 * @LastEditTime: 2020-04-21 17:10:18
 */

const Sequelize = require('sequelize')
const sequelize = require('../db/seq')

const roleMenuModel = sequelize.define('role_menu', {
    roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    menuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

}, {
    // 启用时间戳
    timestamps: false,
    freezeTableName: true,
})

module.exports = roleMenuModel
