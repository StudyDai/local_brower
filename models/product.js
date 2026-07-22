const Sequelize = require("./db")
const { DataTypes } = require('sequelize')

const Product = Sequelize.define('product', {
    "product_name_cn": {
        type: DataTypes.STRING,
        comment: "产品中文名称"
    },
    "local_sku": {
        type: DataTypes.STRING,
        comment: "产品本地SKU",
        allowNull: false
    },
    "product_price": {
        type: DataTypes.DECIMAL(10,2),
        comment: "产品价格",
        allowNull: false,
        defaultValue: 0
    },
    "product_pic": {
        type: DataTypes.STRING,
        comment: "产品图片"
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
})

module.exports = Product