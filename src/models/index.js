/*
 * @Descripttion: 
 * @Author: sunft
 * @Date: 2020-04-21 17:01:46
 * @LastEditTime: 2020-04-30 11:15:45
 */
const roleMenuModel = require('./roleMenu')
const userModel = require('./user')
const menuModel = require('./menu')
const roleModel = require('./role')
const demoModel = require('./demo')
const categoryModel = require('./category')
const productModel = require('./product')
roleModel.hasMany(roleMenuModel,{ foreignKey: 'roleId' })
roleMenuModel.hasOne(menuModel,{ foreignKey: 'roleMenuId' })
userModel.belongsTo(roleModel,{ foreignKey: 'roleId' })
categoryModel.hasMany(productModel, { foreignKey: 'categoryId' })

module.exports={
    roleMenuModel,
    userModel,
    menuModel,
    roleModel,
    demoModel,
    categoryModel,
    productModel
}