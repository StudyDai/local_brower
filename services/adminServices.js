const Inventory = require("../models/inventory")
const platformCOde = require("../models/platform_code")
exports.addInventoryRow = async function (data) {
    try {
        if (data.length == 1) {
            await Inventory.create(data)
        } else {
            await Inventory.bulkCreate(data, {
                chunkSize: 1000
            })
        }
        return "写入成功"
    } catch (err) {
        return err
    }
}

exports.addPlatformCodeByTikTok = async function (data) {
    try {
        await platformCOde.create(data)
        return "写入成功"
    } catch (err) {
        return err
    }
}