const Sequelize = require("./db")
const { DataTypes } = require("sequelize")

const Volume = Sequelize.define("sale_volume", {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    freezeTableName: true
})


module.exports = Volume