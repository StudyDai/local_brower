const { DataTypes } = require("sequelize")
const Sequelize = require("./db")

// 因为已经有了,所以不需要设置他强制创建
const Inventory = Sequelize.define("inventory", {
    platform_sku: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "平台SKU"
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "库存数量"
    },
    warehouse_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "仓库名称"
    },
    shop_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "店铺名称"
    },
    local_sku: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "本地SKU"
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "产品名称"
    },
    brand_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "品牌名称"
    },
    product_category: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "产品分类"
    },
    product_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "产品成本"
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});
// 同步 没有表就会创建
(async function() {
    await Inventory.sync()
    console.log("Inventory模型同步完成")
})()


module.exports = Inventory