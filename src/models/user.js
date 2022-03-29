/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2020-03-31 16:57:53
 * @LastEditTime: 2020-04-23 17:11:57
 */
const Sequelize = require('sequelize')
const sequelize = require('../db/seq')
const userModel = sequelize.define('user', {
    loginName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
    },
    realName: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    phone: {
        type: Sequelize.STRING,
    },
    mobile: {
        type: Sequelize.STRING,
    },
    photo: {
        type: Sequelize.STRING,
    },
    loginIp: {
        type: Sequelize.STRING,
    },
    loginDate: {
        type: Sequelize.DATE,
    },
    status: {
        type: Sequelize.STRING,
    },
    createBy: {
        type: Sequelize.STRING,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updateBy: {
        type: Sequelize.STRING,
    },
    updatedAt: {
        type: Sequelize.DATE,
    },
    remark: {
        type: Sequelize.STRING,
    },
    delFlag: {
        type: Sequelize.STRING,
    },
    parentId: {
        type: Sequelize.INTEGER,
    },
    roleId: {
        type: Sequelize.INTEGER,
    },
    deletedAt: {
        type: Sequelize.DATE,
    }

}, {
    // 启用时间戳
    timestamps: true,
    // 启用paranoid 删除
    paranoid: true,
    freezeTableName: true,
})

module.exports = userModel
