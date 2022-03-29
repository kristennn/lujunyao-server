## 接口文档
### category 相关接口

1. /empty-item/category/list
入参：
{ name, code, glaze, type, series, createdAt }
出参：
{ name, code, glaze, type, series, size, remark, imgUrl, createdAt, updatedAt }

2. /empty-item/category/saveOrUpdate
入参：
{ name, code, glaze, type, series, size, remark, imgUrl }
出参：

4. /empty-item/category/delete
入参：
{ id }
出参：

5. /empty-item/category/generate
入参：
{ id }
出参：


### product 相关接口
1. /empty-item/product/list


2. /empty-item/product/delete


3. /empty-item/product/downloadImg


4. /empty-item/product/downloadBulkImg


### H5 页面接口
1. /empty-item/h5       get
入参：
{ productCode }
出参：
{ productCode, name, code, glaze, type, series, size, remark, imgUrl, createdAt, updatedAt }
