const Sequelize = require("./db")
const { DataTypes } = require("sequelize")

const PlatformDianxiaomiSkuMap = Sequelize.define("platform_dianxiaomisku_map", {
    pd_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "表id"
    },
    platform: {
        type: DataTypes.ENUM("Tiktok", "Aliexpress", "Temu", "Amazon"),
        allowNull: false,
        comment: "平台名称"
    },
    dianxiaomi_sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "店小秘SKU"
    },
    platform_sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "平台SKU"
    },
    delete_flag: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "删除标识"
    },
    platform_sku_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "平台SKU"
    },
    sku_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "SKU个数"
    },
    update_date: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: "更新时间"
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = PlatformDianxiaomiSkuMap
