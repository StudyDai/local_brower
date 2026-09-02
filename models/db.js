const { Sequelize } = require("sequelize")

const sequelize = new Sequelize('whlx_cloud_table', 'admin', 'Szt.20171218', {
    host: '43.139.158.14',
    dialect: 'mysql',
    logging: null
})

module.exports = sequelize