// const path = require("path")
// const fs = require("fs")
// const xlsx = require("xlsx")
// const adminServices = require("./services/adminServices")
// const skuMappingModel = require("./models/platform_dianxiaomisku_map")

// const PLATFORM = "Aliexpress"
// const FALLBACK_LOCAL_SKU = "error_sku"

// const readXlsx = (filePath) => {
//     const readDataList = []
//     const dataBuffer = fs.readFileSync(filePath)
//     const workbook = xlsx.read(dataBuffer, { type: "buffer" })

//     for (let index = 0; index < workbook.SheetNames.length - 2; index += 2) {
//         const sheetName = workbook.SheetNames[index]
//         const worksheet = workbook.Sheets[sheetName]
//         const rows = xlsx.utils.sheet_to_json(worksheet, {
//             header: 2,
//             defval: ""
//         })

//         rows.forEach((row, rowIndex) => {
//             readDataList.push({
//                 ...row,
//                 __sheetName: sheetName,
//                 __rowIndex: rowIndex + 1
//             })
//         })
//     }

//     return readDataList
// }

// const normalizeText = (value) => String(value || "").trim()

// const normalizeExcelRow = (item, index) => {
//     return {
//         index,
//         sheetName: item.__sheetName,
//         rowIndex: item.__rowIndex,
//         platform: PLATFORM,
//         platform_sku_id: normalizeText(item["SKU信息"]),
//         dianxiaomi_sku: normalizeText(item["SKU信息_4"]),
//         platform_sku: normalizeText(item["SKU信息_5"])
//     }
// }

// const isHeaderRow = (row) => {
//     return row.platform_sku_id === "skuId"
//         || row.dianxiaomi_sku === "SKU编码"
//         || row.platform_sku === "货品编码"
// }

// const isLocalSkuError = (resp) => {
//     return resp instanceof Error && resp.message.includes("店小秘sku不存在")
// }

// const saveSkuMapping = async (row) => {
//     const payload = {
//         platform: row.platform,
//         platform_sku: row.platform_sku,
//         platform_sku_id: row.platform_sku_id,
//         dianxiaomi_sku: row.dianxiaomi_sku || FALLBACK_LOCAL_SKU
//     }

//     const usedFallbackBecauseEmpty = !row.dianxiaomi_sku
//     let resp = await adminServices.upsertSkuMappingData(payload)

//     if (!usedFallbackBecauseEmpty && isLocalSkuError(resp)) {
//         payload.dianxiaomi_sku = FALLBACK_LOCAL_SKU
//         resp = await adminServices.upsertSkuMappingData(payload)

//         if (!(resp instanceof Error)) {
//             return {
//                 ok: true,
//                 fallback: true,
//                 fallbackReason: "店小秘 SKU 不存在",
//                 row,
//                 data: resp
//             }
//         }
//     }

//     if (resp instanceof Error) {
//         return {
//             ok: false,
//             fallback: usedFallbackBecauseEmpty,
//             reason: resp.message,
//             row
//         }
//     }

//     return {
//         ok: true,
//         fallback: usedFallbackBecauseEmpty,
//         fallbackReason: usedFallbackBecauseEmpty ? "Excel 店小秘 SKU 为空" : "",
//         row,
//         data: resp
//     }
// }

// const filePath = path.resolve(__dirname, "uploads/aliexpress_good.xlsx")

// ;(async () => {
//     try {
//         const data = readXlsx(filePath)
//         const rows = data.map(normalizeExcelRow)
//         const skippedRows = rows.filter((row) => {
//             return isHeaderRow(row) || !row.platform_sku_id || !row.platform_sku
//         })
//         const importRows = rows.filter((row) => {
//             return !isHeaderRow(row) && row.platform_sku_id && row.platform_sku
//         })

//         const softDeleteResult = await skuMappingModel.update({
//             delete_flag: 1
//         }, {
//             where: {
//                 platform: PLATFORM,
//                 platform_sku_id: "skuId",
//                 delete_flag: 0
//             }
//         })

//         const results = []
//         for (let index = 0; index < importRows.length; index++) {
//             results.push(await saveSkuMapping(importRows[index]))
//         }

//         const successList = results.filter((item) => item.ok)
//         const failedList = results.filter((item) => !item.ok)
//         const fallbackList = successList.filter((item) => item.fallback)
//         const fallbackByEmptyList = fallbackList.filter((item) => item.fallbackReason === "Excel 店小秘 SKU 为空")
//         const fallbackByMissingSkuList = fallbackList.filter((item) => item.fallbackReason === "店小秘 SKU 不存在")

//         console.log("Excel读取总行数:", rows.length)
//         console.log("跳过行数:", skippedRows.length)
//         console.log("准备导入行数:", importRows.length)
//         console.log("软删除历史表头脏数据:", softDeleteResult[0])
//         console.log("导入成功:", successList.length)
//         console.log("使用 error_sku 兜底:", fallbackList.length)
//         console.log("  - Excel 店小秘 SKU 为空:", fallbackByEmptyList.length)
//         console.log("  - 店小秘 SKU 外键不存在:", fallbackByMissingSkuList.length)
//         console.log("导入失败:", failedList.length)

//         if (failedList.length) {
//             console.log("失败明细:", failedList)
//         }
//     } catch (err) {
//         console.error("导入失败:", err)
//     } finally {
//         const sequelize = skuMappingModel.sequelize
//         await sequelize.close()
//     }
// })()
// const path = require('path')
// console.log(path.resolve(__dirname, 'tiktok_data'))
