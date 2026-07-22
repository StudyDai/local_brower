const { Sequelize } = require("sequelize")

const sequelize = new Sequelize('whlx_local_table', 'root', 'WHLXwhlx2020', {
    host: '192.168.9.132',
    dialect: 'mysql',
    logging: null
})

module.exports = sequelize