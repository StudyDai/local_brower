const CryptoJS = require('crypto-js');
console.log(randomUUID())
// const fs = require("fs")
// const path = require("path")

// let currentTime = new Date()
// let currentYear = currentTime.getFullYear()
// let currentMonth = currentTime.getMonth() + 1
// let root_path = "\\\\Sharedpc\\多平台资料\\财务文件\\亚马逊发票"
// let amazon_list = [{
//     code: 'RR',
//     country: ["欧洲", "北美"]
// }, {
//     code: 'PD',
//     country: ["欧洲", "北美"]
// }, {
//     code: 'WF',
//     country: ["欧洲", "北美"]
// }, {
//     code: 'GH',
//     country: ["北美"]
// }, {
//     code: 'DDS',
//     country: ["欧洲", "北美"]
// }]
// fs.readdir(root_path, (error, data) => {
//     if (error) return console.log("读取失败", error)
//     let month_file_name = `${currentYear}${currentMonth < 9 ? '0' + currentMonth : currentMonth}发票`
//     let month_file_path = root_path + `\\${month_file_name}`
//     if (!data.includes(month_file_name)) {
//         try {
//             fs.mkdirSync(month_file_path)
//         } catch (err) {
//             console.log("创建失败", err)
//             return
//         }
//     }
//     // 创底部的 先看里面有啥
//     amazon_list.forEach(item => {
//         item.country.forEach(country => {
//             let shop_file = month_file_path + `\\${item.code}\\普通发票\\${country}`
//             fs.mkdir(shop_file, { recursive: true }, (err) => {
//                 if (err) {
//                     console.log("出现问题了:", err)
//                 }
//                 console.log("创建成功", shop_file)
//             })
//         })
//         let advantage_fa = month_file_path + `\\${item.code}\\广告发票`
//         try {
//             fs.mkdirSync(advantage_fa, { recursive: true})
//             console.log("创建成功", advantage_fa)
//         } catch (err) {
//             console.log("出现问题了", err)
//         }
//         let advantage_account = month_file_path + `\\${item.code}\\广告账单`
//         try {
//             fs.mkdirSync(advantage_account, { recursive: true})
//             console.log("创建成功", advantage_account)
//         } catch (err) {
//             console.log("出现问题了", err)
//         }
//     })
// })