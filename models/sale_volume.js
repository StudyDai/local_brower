const Sequelize = require("./db")
const { DataTypes } = require("sequelize")

const Volume = Sequelize.define("sales_volume", {
    platform_sku: {
        type: DataTypes.STRING,
        comment: '平台SKU'
    },
    sale_volume_local: {
        type: DataTypes.INTEGER,
        comment: "当天销量"
    },
    sale_volume_seven: {
        type: DataTypes.INTEGER,
        comment: "周销量"
    },
    sale_volume_thirty: {
        type: DataTypes.INTEGER,
        comment: "月销量"
    },
    platform: {
        type: DataTypes.ENUM('Temu','Amazon','Tiktok','速卖通'),
        comment: '售卖平台'
    },
    shop_name: {
        type: DataTypes.STRING,
        comment: "店铺名称"
    },
    local_sku: {
        type: DataTypes.STRING,
        comment: "本地SKU"
    },
    product_skc: {
        type: DataTypes.STRING,
        comment: "产品SKC"
    },product_sku: {
        type: DataTypes.STRING,
        comment: "产品SKU"
    },product_spu: {
        type: DataTypes.STRING,
        comment: "产品SPU"
    }, data_time: {
        type: DataTypes.STRING,
        comment: "表格当天时间"
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
})


module.exports = Volume