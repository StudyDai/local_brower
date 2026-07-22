const Inventory = require("../models/inventory")
const platformCOde = require("../models/platform_code")
const saleVolume = require("../models/sale_volume")
const product = require("../models/product")
const platformDianxiaomiSkuMap = require("../models/platform_dianxiaomisku_map")
const { Op } = require("sequelize")
const FALLBACK_LOCAL_SKU = "error_sku"
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

exports.searchPlatformCodeByEmail = async function (data) {
    try {
        let resp = await platformCOde.findOne({
            where: {
                email: data
            },
            order: [['get_time', 'DESC']]
        })
        if (!resp) {
            return null
        }
        return resp.platform_code
    } catch (err) {
        return err
    }
}

exports.addTikTokVolumeToOneSevenThirty = async function (data) {
    try {
        await saleVolume.bulkCreate(data, {
            chunkSize: 1000,
            updateOnDuplicate: [
                "sale_volume_thirty",
                "sale_volume_seven",
                "sale_volume_local"
            ]
        })
        return "tiktok销量写入成功"
    } catch (err) {
        return err
    }
}

// 写店小秘数据
exports.addDianxiaomiStock = async function (data) {
    try {
        await product.bulkCreate(data, {
            chunkSize: 1000,
            updateOnDuplicate: [
                "product_pic",
                "product_price",
                "product_name_cn",
            ]
        })
        return "店小秘SKU写入成功"
    } catch (err) {
        return err
    }
}

exports.getDianxiaomiData = async (data = { page: 1, pageSize: 100 }) => {
    let { page, pageSize } = data
    const keyword = String(data.keyword || "").trim()
    page = Number(page);
    pageSize = Number(pageSize);
    page = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    pageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 100;
    pageSize = Math.min(pageSize, 500);

    const offset = (page - 1) * pageSize;
    const where = {}
    if (keyword) {
        where[Op.or] = [
            { product_name_cn: { [Op.like]: `%${keyword}%` } },
            { local_sku: { [Op.like]: `%${keyword}%` } }
        ]
    }

    try {
        let resp = await product.findAndCountAll({
            raw: true,
            where,
            limit: pageSize,
            offset,
            order: [['id', 'DESC']]
        })
        return {
            list: resp.rows,
            total: resp.count,
            page,
            pageSize,
            totalPages: Math.ceil(resp.count / pageSize)
        }
    } catch (err) {
        return err
    }
}

exports.createDianxiaomiData = async (data) => {
    try {
        const payload = normalizeDianxiaomiPayload(data)
        const created = await product.create(payload)
        return created.get({ plain: true })
    } catch (err) {
        return err
    }
}

exports.updateDianxiaomiData = async (id, data) => {
    try {
        const row = await product.findByPk(Number(id))
        if (!row) {
            return null
        }
        const payload = normalizeDianxiaomiPayload(data)
        await row.update(payload)
        return row.get({ plain: true })
    } catch (err) {
        return err
    }
}

exports.deleteDianxiaomiData = async (id) => {
    try {
        const deletedCount = await product.destroy({
            where: {
                id: Number(id)
            }
        })
        return deletedCount > 0
    } catch (err) {
        return err
    }
}

// 这一块是弄SKU映射用的
exports.getSkuMappingData = async (data = {}) => {
    const keyword = String(data.keyword || "").trim()
    const where = {
        delete_flag: 0
    }

    if (keyword) {
        where[Op.or] = [
            { platform: { [Op.like]: `%${keyword}%` } },
            { dianxiaomi_sku: { [Op.like]: `%${keyword}%` } },
            { platform_sku: { [Op.like]: `%${keyword}%` } },
            { platform_sku_id: { [Op.like]: `%${keyword}%` } },
            { sku_count: { [Op.like]: `%${keyword}%` } }
        ]
    }

    try {
        const resp = await platformDianxiaomiSkuMap.findAll({
            raw: true,
            where,
            order: [["pd_id", "DESC"]]
        })
        return resp
    } catch (err) {
        return err
    }
}

exports.createSkuMappingData = async (data) => {
    try {
        const payload = normalizeSkuMappingPayload(data)
        const errorMessage = validateSkuMappingPayload(payload)
        if (errorMessage) {
            return createServiceError(errorMessage, 400)
        }

        const created = await platformDianxiaomiSkuMap.create(payload)
        return created.get({ plain: true })
    } catch (err) {
        return normalizeSkuMappingError(err)
    }
}

exports.upsertSkuMappingData = async (data) => {
    try {
        const payload = normalizeSkuMappingPayload(data)
        const errorMessage = validateSkuMappingPayload(payload)
        if (errorMessage) {
            return createServiceError(errorMessage, 400)
        }

        await platformDianxiaomiSkuMap.upsert({
            ...payload,
            delete_flag: 0
        })

        return await platformDianxiaomiSkuMap.findOne({
            raw: true,
            where: {
                platform: payload.platform,
                platform_sku_id: payload.platform_sku_id
            }
        })
    } catch (err) {
        return normalizeSkuMappingError(err)
    }
}

exports.importSkuMappingData = async (rows = []) => {
    const successList = []
    const failedList = []
    const fallbackList = []

    for (let index = 0; index < rows.length; index++) {
        const row = rows[index]
        const rowNumber = row.__rowNumber || index + 2
        const importPayloadResult = await buildSkuMappingImportPayload(row)

        if (importPayloadResult instanceof Error) {
            failedList.push({
                rowNumber,
                row,
                reason: importPayloadResult.message || String(importPayloadResult)
            })
            continue
        }

        const resp = await exports.upsertSkuMappingData(importPayloadResult.payload)

        if (resp instanceof Error) {
            failedList.push({
                rowNumber,
                row,
                reason: resp.message || String(resp)
            })
            continue
        }

        successList.push(resp)

        if (importPayloadResult.fallbackReason) {
            fallbackList.push({
                rowNumber,
                originalSku: importPayloadResult.originalSku,
                platform: importPayloadResult.payload.platform,
                platform_sku: importPayloadResult.payload.platform_sku,
                platform_sku_id: importPayloadResult.payload.platform_sku_id,
                reason: importPayloadResult.fallbackReason
            })
        }
    }

    return {
        total: rows.length,
        successCount: successList.length,
        failedCount: failedList.length,
        fallbackCount: fallbackList.length,
        fallbackList,
        failedList
    }
}

exports.updateSkuMappingData = async (id, data) => {
    try {
        const row = await platformDianxiaomiSkuMap.findOne({
            where: {
                pd_id: Number(id),
                delete_flag: 0
            }
        })
        if (!row) {
            return null
        }

        const payload = normalizeSkuMappingPayload(data)
        const errorMessage = validateSkuMappingPayload(payload)
        if (errorMessage) {
            const error = new Error(errorMessage)
            error.statusCode = 400
            return error
        }

        await row.update(payload)
        await row.reload()
        return row.get({ plain: true })
    } catch (err) {
        return normalizeSkuMappingError(err)
    }
}

exports.deleteSkuMappingData = async (id) => {
    try {
        const row = await platformDianxiaomiSkuMap.findOne({
            where: {
                pd_id: Number(id),
                delete_flag: 0
            }
        })
        if (!row) {
            return false
        }

        await row.update({
            delete_flag: 1
        })
        return true
    } catch (err) {
        return err
    }
}

function normalizeDianxiaomiPayload(data = {}) {
    return {
        product_name_cn: String(data.product_name_cn || "").trim(),
        local_sku: String(data.local_sku || "").trim(),
        product_price: normalizePrice(data.product_price),
        product_pic: String(data.product_pic || "").trim()
    }
}

function normalizePrice(value) {
    const number = Number(value)
    if (!Number.isFinite(number) || number < 0) {
        return 0
    }
    return number.toFixed(2)
}

function normalizeSkuMappingPayload(data = {}) {
    return {
        platform: String(data.platform || "").trim(),
        dianxiaomi_sku: String(data.dianxiaomi_sku || "").trim().slice(0, 50),
        platform_sku: String(data.platform_sku || "").trim().slice(0, 50),
        platform_sku_id: String(data.platform_sku_id || "").trim().slice(0, 50),
        sku_count: normalizeSkuCount(data.sku_count)
    }
}

function normalizeSkuCount(value) {
    const number = Number(value)
    if (!Number.isFinite(number)) return 1
    return Math.max(1, Math.floor(number))
}

function validateSkuMappingPayload(payload) {
    const platformList = ["Tiktok", "Aliexpress", "Temu", "Amazon"]
    if (!platformList.includes(payload.platform)) return "platform 不正确"
    if (!payload.dianxiaomi_sku) return "dianxiaomi_sku 不能为空"
    if (!payload.platform_sku) return "platform_sku 不能为空"
    if (!payload.platform_sku_id) return "platform_sku_id 不能为空"
    if (!Number.isInteger(payload.sku_count) || payload.sku_count < 1) return "sku_count 必须是大于等于 1 的整数"
    return ""
}

async function buildSkuMappingImportPayload(row = {}) {
    try {
        const payload = normalizeSkuMappingPayload(row)
        const errorMessage = validateSkuMappingPayload({
            ...payload,
            dianxiaomi_sku: payload.dianxiaomi_sku || FALLBACK_LOCAL_SKU
        })
        if (errorMessage) {
            return createServiceError(errorMessage, 400)
        }

        const originalSku = payload.dianxiaomi_sku
        let fallbackReason = ""

        if (!originalSku) {
            fallbackReason = "dianxiaomi_sku is empty"
        } else {
            const matchedProduct = await product.findOne({
                raw: true,
                where: {
                    local_sku: originalSku
                }
            })

            if (!matchedProduct) {
                fallbackReason = "dianxiaomi_sku is not in product table"
            }
        }

        if (fallbackReason) {
            const ensureResp = await ensureFallbackProductSku()
            if (ensureResp instanceof Error) {
                return ensureResp
            }
            payload.dianxiaomi_sku = FALLBACK_LOCAL_SKU
        }

        return {
            payload,
            originalSku,
            fallbackReason
        }
    } catch (err) {
        return err
    }
}

async function ensureFallbackProductSku() {
    try {
        await product.findOrCreate({
            where: {
                local_sku: FALLBACK_LOCAL_SKU
            },
            defaults: {
                local_sku: FALLBACK_LOCAL_SKU,
                product_name_cn: FALLBACK_LOCAL_SKU,
                product_price: 0,
                product_pic: ""
            }
        })
        return true
    } catch (err) {
        return err
    }
}

function createServiceError(message, statusCode) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

function normalizeSkuMappingError(err) {
    const code = err && (err.parent && err.parent.code || err.original && err.original.code)
    if (code === "ER_NO_REFERENCED_ROW_2") {
        const error = new Error("店小秘sku不存在，请先在 SKU 表新增对应数据")
        error.statusCode = 400
        error.cause = err
        return error
    }
    if (code === "ER_DUP_ENTRY") {
        const error = new Error("该平台 skuId 已存在")
        error.statusCode = 400
        error.cause = err
        return error
    }
    return err
}
