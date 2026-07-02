const Sequelize = require("./db")
const { DataTypes } = require("sequelize")

const platformCode = Sequelize.define("tiktok_code", {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    platform_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    get_time: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
})

module.exports = platformCode