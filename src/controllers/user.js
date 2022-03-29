/* eslint-disable max-statements */
/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2020-03-25 16:59:23
 * @LastEditTime: 2020-05-20 13:07:38
 */
const { roleModel, userModel, menuModel } = require('../models/index')
const { decrypt, encrypt } = require('../utils/index')
const Sequelize = require('sequelize')
const sequelize = require('../db/seq')
const svgCaptcha = require('svg-captcha')
const { Op } = Sequelize
const moment = require('moment')

// 图片验证码
exports.getCaptcha = async ctx => {
    const codeConfig = {
        size: 4, // 验证码长度
        ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
        noise: 2, // 干扰线条的数量
        width: 150,
        height: 40,
        fontSize: 50,
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#eee',
    }
    const captcha = svgCaptcha.create(codeConfig)
    
    ctx.session.captcha = captcha.text.toLowerCase() // 存session用于验证接口获取文字码
    ctx.body = {
        code: 'SUCCESS',
        data: captcha.data
    }
}

// 登录
exports.setLogin = async ctx => {
    const request = ctx.request.body
    try {
        const currentUser = await userModel.findOne({
            where: {
                loginName: request.loginName
            },
            raw: true,
            include: [
                {
                    model: roleModel,
                }
            ],
        })
        if (ctx.session.captcha !== request.verifyCode) {
            throw new Error('验证码不正确')
        }
        if (!currentUser) {
            throw new Error('用户不存在')
        }
        if (decrypt(currentUser.password) !== request.password) {
            throw new Error('密码不正确')
        }
        const menus = await sequelize.query(`SELECT * from role_menu  a LEFT JOIN menu b ON a.menuId=b.id where a.roleId=${currentUser.roleId};`, {
            type: sequelize.QueryTypes.SELECT
        })
        const menuItem = {
            path: '/',
            routes: formatMenus(menus),
            authority: currentUser['role.role']
        }
        // 一个页面下的所有子权限
        const pageAuth = menus.filter(item => item.resourceType === 'pageAuth').map(item => item.code)
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            data: {
                id: currentUser.id,
                roleCode: currentUser['role.role'],
                loginName: currentUser.loginName,
                realName: currentUser.realName,
                menuItem,
                pageAuth
            },
            msg: '登录成功'
        }
        ctx.session.isLogin = true
        ctx.session.userId = currentUser.id
        ctx.session.lastLoginDate = currentUser.loginDate
        // 所有需要校验权限的api
        const allAuthApi = await menuModel.findAll({
            attributes: ['apiUrl'],
            raw: true,
            where: {
                resourceType: 'pageAuth'
            },
        })
        ctx.session.allAuthApi = allAuthApi.map(item => item.apiUrl)
        ctx.session.allowApi = menus.map(item => {
            if (item.resourceType === 'pageAuth') {
                return item.apiUrl
            }
        }).filter(item => item)
        ctx.session.allowPage = menus.map(item => {
            if (item.resourceType === 'button') {
                return item.href
            }
        }).filter(item => item)

        // 记录本次登录的ip和时间
        const time = new Date()
        await userModel.update({
            loginDate: time,
            loginIp: ctx.request.ip
        }, {
            where: { id: currentUser.id }
        })
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: error.message
        }
    }
}

// 登出
exports.setLogout = ctx => {
    ctx.session.isLogin = false
    ctx.status = 200
    ctx.body = {
        code: 'SUCCESS',
        msg: '退出成功',
    }
}

// 获取当前用户信息
exports.queryUser = async ctx => {
    try {
        const result = await userModel.findOne({
            attributes: ['id', 'realName'],
            where: {
                id: ctx.session.userId
            },
        })
        result.dataValues.loginDate = ctx.session.lastLoginDate
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '查询用户详情成功',
            data: result.dataValues,
        }
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '查询失败'
        }
    }
}

// 获取用户信息
exports.queryDetail = async ctx => {
    const request = ctx.query
    try {
        const result = await userModel.findOne({
            where: {
                id: request.id
            },
            raw: true,
            include: [
                {
                    model: roleModel,
                    attributes: ['description'],
                }
            ]
        })
        if (!result) { throw new Error('用户不存在') }
        delete result.password
        result.roleName = result['role.description']
        delete result['role.description']
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '查询用户详情成功',
            data: result,
        }
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: error.message
        }
    }
}


// 获取用户列表
exports.queryUserList = async ctx => {
    const request = ctx.request.body
    // console.log(request);
    const where = {}
    const columnKey = request.columnKey || 'createdAt'
    let order
    switch (request.order) {
    case 'descend':
        order = 'DESC'
        break
    case 'ascend':
        order = 'ASC'
        break
    default:
        order = 'DESC'
        break
    }
    if (request.loginName) {
        where.loginName = {
            [Op.like]: `%${request.loginName}%`
        }
    }
    if (request.roleId) {
        where.roleId = request.roleId
    }
    try {
        const userList = await userModel.findAndCountAll({
            attributes: ['id', 'roleId', 'loginName', 'loginDate', 'realName', 'phone', 'email', [Sequelize.col('description'), 'roleName']],
            where,
            offset: request.pageSize * (request.pageNo - 1),
            limit: request.pageSize,
            order: [[columnKey, order]],
            raw: true,
            include: [
                {
                    model: roleModel,
                    attributes: [],
                }
            ]
        })
        userList.total = userList.count
        delete userList.count
        ctx.status = 200
        ctx.body = ctx.body = {
            code: 'SUCCESS',
            msg: '查询用户列表成功',
            data: userList,
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

// 新增或修改用户
exports.saveOrUpdateUser = async ctx => {
    const request = ctx.request.body
    console.log(request)
    // 修改
    if (request.id) {
        try {
            await userModel.update({
                ...request
            }, {
                where: {
                    id: request.id
                }
            })
            ctx.status = 200
            ctx.body = {
                code: 'SUCCESS',
                msg: '修改成功'
            }
        } catch (error) {
            ctx.status = 200
            ctx.body = {
                code: 'FAILED',
                msg: '修改失败'
            }
        }
    } else {
        // 新增
        try {
            const isUserExit = await userModel.findOne({
                where: {
                    loginName: request.loginName
                }
            })

            if (isUserExit) {
                ctx.status = 200
                ctx.body = {
                    code: 'FAILED',
                    msg: '用户已存在'
                }
                return
            }
            request.password = encrypt(request.password)
            await userModel.create({
                ...request
            })
            ctx.status = 200
            ctx.body = {
                code: 'SUCCESS',
                msg: '添加成功'
            }
        } catch (error) {
            ctx.status = 200
            ctx.body = {
                code: 'FAILED',
                msg: '添加失败'
            }
        }
    }

}

exports.deleteUser = async ctx => {
    const request = ctx.request.body
    console.log(request)

    try {
        await userModel.destroy({
            where: {
                id: {
                    [Op.or]: request
                }
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

exports.resetPassword = async ctx => {
    const request = ctx.query
    console.log(request)

    try {
        await userModel.update({
            password: encrypt('123456')
        }, {
            where: {
                id: request.id
            },
        })

        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '密码重置成功'
        }
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: '密码重置失败'
        }
    }
}

// 修改密码
exports.editPassword = async ctx => {
    const request = ctx.request.body
    console.log(request)

    try {
        const currentUser = await userModel.findOne({
            where: {
                id: ctx.session.userId
            },
        })
        if (request.password !== decrypt(currentUser.password)) {
            throw new Error('旧密码不正确')
        }
        await userModel.update({
            password: encrypt(request.newPassword)
        }, {
            where: {
                id: ctx.session.userId
            },
        })
        ctx.status = 200
        ctx.body = {
            code: 'SUCCESS',
            msg: '密码修改成功'
        }
    } catch (error) {
        ctx.status = 200
        ctx.body = {
            code: 'FAILED',
            msg: error.message
        }
    }
}


// 格式化菜单
function formatMenus(menus, id) {
    const newMenus = []
    // 查子级
    if (id) {
        menus.forEach(item => {
            if (item.parentId === id) {
                newMenus.push({
                    hideInMenu: item.isShow === '1',
                    path: item.href,
                    routes: formatMenus(menus, item.id),
                    component: item.component,
                    name: item.name,
                })
            }
        })
    } else {
        menus.forEach(item => {
            if (item.parentId === 0) {
                newMenus.push({
                    hideInMenu: item.isShow === '1',
                    path: item.href,
                    routes: formatMenus(menus, item.id),
                    component: item.component,
                    name: item.name,

                })
            }
        })
    }
    return newMenus
}
