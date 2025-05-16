// import xlsx from 'xlsx'
const path = require('path')
const xlsx = require('xlsx')
const express = require('express')
const cors = require('cors')
const app = express()
const fs = require('fs')
let warehouseList = []
let priceList = ''
let danWei = {
    'AnToLb': 0.0625,
    'LbTog': 453.5924
}
fs.readFile(path.resolve(__dirname, './海外仓分仓表.xlsx'), async (err, result) => {
    if (err) {
        console.log('出错了')
        return
    }
    // 拿仓库数据
    if (!warehouseList.length) {
        let warehouseUrl = 'https://dsp-api.piggyship.com/vendor/vendor/get_vendor_addresses'
        const list = await fetch(warehouseUrl, {
            method: "POST",
            body: JSON.stringify({
                start: 0,
                limit: 10
            }),
            headers: {
                'authorization': 'kYAzqXvb70KrYHj7HScUZB7IszwdLotmCh2lO8znNntY6Ptiovmk3fgw6eppapYIOkeZhj'
            }
        }).then(res => res.json())
        if (list.success) {
            warehouseList = list.vendor_addresses.map(item => ({
                'zipcode': item.zipcode,
                'address': item.formatted_address,
                'state': item.state
            }))
        } else {
            // 没数据
            console.log('没有请求到数据,直接退出')
            return
        }
        priceList = result
    }
})
// 配置
app.use(cors())
// json数据来的
app.use(express.json())
// xxx-www-data
app.use(express.urlencoded({ extended: true }))

// 创建一共接口
app.get('/getPrice/:id', async (req, res, next) => {
    const { id } = req.params
    console.log(id)
    if (id) {
        const data = await getWayPrice(priceList, id)
        console.log(data)
        if (data.statu == 200) {
            res.send(data)
        }
    }
})
// 应该是一个接口来的
async function getWayPrice(result, id) {
    // 使用 xlsxjs 解析文件
    // 获取文件名称
    // 获取第一个工作表数据
    // 转化json格式
    const data = xlsx.read(result, { type: 'buffer' })
    const filename = data.SheetNames
    let goodPirce = 0
    let sendWarehouse = ''
    let weight_unit = ''
    // 默认用pg 就是表第一个,拿到pg的数据
    const PG_warehouse = xlsx.utils.sheet_to_json(data.Sheets[filename[0]])
    // 调用美国api看看先
    for (let index = 0; index < warehouseList.length; index++) {
        let item = warehouseList[index]
        // 美国邮编进行分区 20147 这个是写死的 本来是应该用户来填写的
        const url = `https://postcalc.usps.com/DomesticZoneChart/GetZone?origin=${item.zipcode}&destination=${id}&shippingDate=3%2F27%2F2025&_=${new Date().getTime()}`
        const result = await fetch(url).then(res => res.json())
        // 里面有一个正则就可以判断到的
        let reg = /\b(\d+)\./
        // 要判断
        let zero_count = result.ZoneInformation.match(reg)[1]
        console.log(item.zipcode, zero_count)
        // 拿到分区,还要拿到产品的重量, 默认是1.8磅
        let good_weight = parseInt('2.2')
        // 如果是榜就先按榜数算,如果匹配到不是榜了就用盎司
        let PG_item = PG_warehouse.find(item2 => {
            // 判断下单位 0.25 1 2 3 0.5
            let unit_reg = /(\d?\.?\d+)([a-zA-Z]+)/
            weight_unit = item2.weight.match(unit_reg)[2]
            let weight_num = parseInt(item2.weight.match(unit_reg)[1])
            // 如果是lb就不用管,直接算
            let unit_reg2 = /LB/i
            let unit_reg3 = /oz/i
            if (unit_reg2.test(weight_unit)) {
                // 直接算
                return good_weight <= weight_num
            } else if (unit_reg3.test(weight_unit)){
                // 可能是盎司
                let angSi = weight_unit / danWei['AnToLb']
                return angSi <= weight_num
            }
        })
        // 拿到的就是这一列我要的数据 然后对应区拿钱
        if (PG_item) {
            // 拿到了, 去拿对应市时区的价格 zero_count
            let keys = Object.keys(PG_item)[zero_count]
            // 这个值去拿价格
            let price = PG_item[keys]
            // 转数字
            let real_price = +price.substring(1)
            console.log(item.state, real_price, goodPirce)
            // 判断下当前的价格是不是比上一个仓库的贵,如果不是就换掉
            if(goodPirce) {
                // 判
                if (real_price < goodPirce) {
                    goodPirce = real_price
                    sendWarehouse = item.state
                }
            } else {   
                goodPirce = real_price
                sendWarehouse = item.state
            }
            console.log(real_price, zero_count, sendWarehouse)
        }
    }
    return {
        goodPirce,
        sendWarehouse,
        unit: 'USD',
        statu: 200
    }
}


app.listen(8800, () => {
    console.log('running 8800 ing~')
})