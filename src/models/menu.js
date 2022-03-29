/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2020-03-31 16:57:53
 * @LastEditTime: 2020-04-26 17:19:07
 */
const Sequelize = require('sequelize')
const sequelize = require('../db/seq')

const menuModel = sequelize.define('menu', {
    roleMenuId: {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    sort: {
        type: Sequelize.INTEGER,
    },
    href: {
        type: Sequelize.STRING,
    },
    target: {
        type: Sequelize.STRING,
    },
    isShow: {
        type: Sequelize.INTEGER,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    },
    remark: {
        type: Sequelize.STRING,
    },
    resourceType: {
        type: Sequelize.STRING,
    },
    parentId: {
        type: Sequelize.INTEGER
    },
    deletedAt: {
        type: Sequelize.DATE,
    },
    apiUrl: {
        type: Sequelize.STRING,
    }

}, {
    // 启用时间戳
    timestamps: true,
    // 启用paranoid 删除
    paranoid: true,
    freezeTableName: true,
})

module.exports = menuModel
