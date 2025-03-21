const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path')
const multer = require('multer')
const cors = require('cors');
const xlsx = require('xlsx')
const https = require('https')
let current_ip = '192.168.188.79'
let warehouseName = 'TX'
let goodSku = 'USA-100'
let currentTime = new Date().getTime();
const options = {
    key: fs.readFileSync('./key/private-key.pem'),
    cert: fs.readFileSync('./key/certificate.pem')
};
const httpsServer = https.createServer(options, app)
function delayFn() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('delayed response')
        }, 1500)
    })
}
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.post('/posts',function(req, res, next) {
    console.log('今天的时间是: ' + new Date() + req.body.ip);
    currentTime = new Date().getTime();
    const ip = req.body.ip
    if(ip.trim()) {
        current_ip = ip
    }
    res.send({
        code: 200,
        msg: '发送成功',
        data: req.body.ip
    })
})
app.get('/get_ip',function(req, res, next) {
    if(current_ip.trim()) {
        res.send({
            code: 200,
            msg: '获取成功',
            data: current_ip
        })
    } else {
        res.send({
            code: 404,
            msg: '获取失败,主机可能暂未开机',
        })
    }
})

const storage = multer.diskStorage({
    // 设置文件存储的目标目录
    destination: function (req, file, cb) {
        // 定义存储目录
        const uploadDir = path.join(__dirname, 'uploads');

        // 检查目录是否存在，如果不存在则创建
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, 'uploads/');
    },
    // 设置文件名
    filename: function (req, file, cb) {
        // 生成唯一的文件名，避免文件名冲突
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});
// 创建multer示例
const upload = multer({ storage: storage })

app.post('/getOrderByAccount', upload.single('file'), function(req, res, next) {
    let { cookie, mallid } = req.query
    // 文件路径
    let filePath = req.file.path
    fs.readFile(filePath, async (err, data) => {
        if (err) {
            console.log('有错误', err)
            return
        }
        // 使用 xlsxjs 解析文件
        const workbook = xlsx.read(data, { type: 'buffer' });
        // 获取文件名称
        const filename = workbook.SheetNames[0]
        // 获取第一个工作表数据
        const worksheet = workbook.Sheets[filename]
        // 转化json格式
        const jsondata = xlsx.utils.sheet_to_json(worksheet)
        // 查看
        // 循环拿到所有的回款订单号
        let allList = jsondata.map(item => ({
            'orderId': item['订单编号'],
            'orderSku': item['sku明细（SKU ID_SKU货号_SKU名称_SKU属性_销售数量）'],
            'orderPrice': item['交易收入'],
            'order_time': item['财务时间']
        }))
        res.send({
            statu: 200,
            data: allList
        })
    })
})


app.post('/getGoodList', async function(req, res, next) {
    const { cookie, mallid } = req.body
    const myHeader = new Headers()
    myHeader.append('Content-Type', 'application/json')
    myHeader.append('cookie', cookie)
    myHeader.append('mallid', mallid)
    async function getAllList(url, data, list) {
        const result = await fetch(url, {
            method: 'POST',
            headers: myHeader,
            body: JSON.stringify(data)
        }).then(res => res.json())
        console.log(result)
        if (result.success) {
            list.push(...result.result.pageItems)
            // 判断是不是到头了
            let allTotal = result.result.total
            if (data.page * data.pageSize > allTotal) {
                return
            } else {
                data.page += 1
                await getAllList(url, data, list)
            }
        }
    }
    if (cookie && mallid) {
        let resultList = []
        await getAllList('https://seller.kuajingmaihuo.com/bg-visage-mms/product/skc/pageQuery', {page: 1, pageSize: 500}, resultList)
        // 返回给用户
        res.send({
            statu: 200,
            data: resultList
        })
    }
})

app.post('/getGoodSize', async function(req, res, next) {
    const { cookie, mallid, data  } = req.body
    const myHeader = new Headers()
    myHeader.append('Content-Type', 'application/json')
    myHeader.append('cookie', cookie)
    myHeader.append('mallid', mallid)
    async function getAllList(url, data, list) {
        const result = await fetch(url, {
            method: 'POST',
            headers: myHeader,
            body: JSON.stringify(data)
        }).then(res => res.json())
        console.log(result)
        if (result.success) {
            list.push(...result.result.pageItems)
            // 判断是不是到头了
            let allTotal = result.result.total
            if (data.page * data.pageSize > allTotal) {
                return
            } else {
                data.page += 1
                await getAllList(url, data, list)
            }
        }
    }
    if (cookie && mallid) {
        let resultList = []
        await getAllList('https://seller.kuajingmaihuo.com/bg-visage-mms/product/skc/pageQuery', {page: 1, pageSize: 500}, resultList)
        // 返回给用户
        let getUrlList = []
        data.forEach(element => {
            let resp = resultList.find(item => {
                let skuList = item.productSkuSummaries
                return skuList.find(sku => sku.productSkuId === element)
            })
            if(resp) {
                getUrlList.push(resp)
            }
        })
        res.send({
            statu: 200,
            data: getUrlList
        })
    }
})

app.get('/get_vip', async function(req, res, next) {
    function vertifyTime(timestamp, type, num, key, flag) {
        const start = timestamp.substring(timestamp.length, 8)
        let end = ''
        // 中间是到期时间,看我传递进来的是h还是f还是d还是y
        switch (type) {
            case 'f':
                // 分钟
                end =  parseInt(num) + 'f'
                break
            case 'h':
                // 小时
                end =  parseInt(num) + 'h'
                break
            case 'd':
                // 天
                end = parseInt(num) + 'd'
                break
            case 'w':
                // 周
                end = parseInt(num) + 'w'
                break
            case 'm':
                // 月
                end = parseInt(num) + 'm'
                break
            case 'y':
                // 年
                end = parseInt(num) + 'y'
                break
            default:
                console.log('请传递以fdhy结尾的')
        }
        console.log(start + '.' + end + '.' + key + "." + timestamp.slice(0, 8))
        if (flag) {
            console.log('密钥', btoa(start + '.' + end + '.' + key + "." + timestamp.slice(0, 8)))
            return btoa(start + '.' + end + '.' + key + "." + timestamp.slice(0, 8))
        }
    }
    
    function generateUUID() { 
        let d = new Date().getTime(); // 获取当前时间作为随机数种子
        
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    
    function generateNumericCode(length) {
        const digits = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return result;
    }
    
    
    // 第一层验证
    const firstCode = generateNumericCode(5)
    const uuid = generateUUID()
    const timee = new Date().getTime()
    
    
    // 第二层验证
    res.send({
        firstCode: firstCode,
        CodeSecret: vertifyTime(String(timee), 'f', 2, firstCode, true),
        secondSecret: vertifyTime(String(timee), 'w', 1, uuid+'$y'+firstCode, true)
    })
})

app.post('/getWarehouseList', async function(req, res, next) {
    console.log(req.body)
    // 我能收到数据哦,
    const result = await fetch('https://oms.shipout.com/api/shipout-shipment/shipment/getShipmentByOrderId', {
        method: 'POST',
        body: req.body.param,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': req.body.token
        }
    }).then(res => res.json())
    console.log(result)
    if (result.result === 'OK') {
        // 证明有值,导出
        let wb = xlsx.utils.book_new()
        // 弄一个来存储数据的
        let xlsxData = [['订单号', '仓库id', '仓库代号', 'tiktok仓库识别码']]
        let warehouseList = {
            '1834290476741148673': 'DFW',
            '1856402108568158210': 'MIA',
            '1819132530563084289': 'JFK',
            '1745625745046646786': 'LAX'
        }
        let tiktokList = {
            'LAX': 'CA',
            'MIA': 'FL',
            'JFK': 'NY',
            'DFW': 'TX'                                      
        }
        result.data.forEach(item => {
            let DaiHao = warehouseList[item.warehouseId]
            let tikTokWarehouse = tiktokList[DaiHao]
            xlsxData.push([item.shipmentNO, item.warehouseId, DaiHao, tikTokWarehouse])
        })
        // 写到里面去
        const ws = xlsx.utils.aoa_to_sheet(xlsxData)
        xlsx.utils.book_append_sheet(wb, ws, '仓库对应单')
        // 导出
        xlsx.writeFile(wb, path.resolve(__dirname, 'warehouse.xls'))
        console.log('导出成功')
        res.send({
            statu: 200
        })
    }
})

app.post('/getWarehouseName', async function(req, res, next) {
    // 读取本地的数据
    fs.readFile(path.resolve(__dirname, 'warehouse.xls'), async (err, result) => {
        if (err) {
            res.send({
                statu: 201,
                msg: '文件出错,请联系管理员'
            })
        } else {
            // 没问题,开始解析
            const workb = xlsx.read(result, { type: 'buffer' })
            if (workb.SheetNames.length) {
                // 获取文件名称
                const sheetName = workb.SheetNames[0]
                // 获取第一个工作表述
                const worksheet = workb.Sheets[sheetName]
                // 转json看看咋个事
                const jsondata = xlsx.utils.sheet_to_json(worksheet)
                // 循环就行了
                let warehouseItem = jsondata.find(item => {
                    return item['订单号'] == req.body.orderNo
                })
                // 如果找到就返回
                if (warehouseItem) {
                    warehouseName = warehouseItem['tiktok仓库识别码']
                    res.send({
                        statu: 200,
                        data: {
                            'localwarehouse': warehouseItem['仓库代号'],
                            'tiktokwarehouse': warehouseItem['tiktok仓库识别码']
                        }
                    })
                } else {
                    res.send({
                        statu: 201
                    })
                }
            }
        }
    })
})

app.post('/getActivity', async function(req, res, next) {
    const { mallid, cookie } = req.body
    const myHeader = new Headers()
    myHeader.append('Content-Type', 'application/json')
    myHeader.append('cookie', cookie)
    myHeader.append('mallid', mallid)
    const url = 'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/list' 
    async function getData(url, data, query) {
        const result = await fetch(url, {
            method: 'post',
            headers: myHeader,
            body: JSON.stringify(query)
        }).then(res => res.json())
        if (result.success) {
            // 判断是否到底
            let currentNum = query.pageNo * query.pageSize
            data.push(...result.result.list)
            if (result.result.total > currentNum) {
                // 继续
                query.pageNo += 1
                await delayFn()
                await getData(url, data, query)
            }
        }
    }
    let resultData = []
    await getData(url, resultData, {
        "pageNo": 1,
        "pageSize": 40
    })
    if (resultData.length) {
            // 返回
            res.send({
                statu: 200,
                data: resultData
            })
    } else {
        res.send({
            statu: 201,
            result: null
        })
    }

})


app.post('/getSize', async function(req, res, next) {
    // 拿到长宽高重量
    fs.readFile(path.resolve(__dirname, './good_list.xls'), async (err, result) => {
        // 看看是不是有问题
        if (err) {
            res.send({
                statu: 201
            })
        } else {
            // 我要拿到对应的数据给到前端
            // 使用 xlsxjs 解析文件
            const workbook = xlsx.read(result, { type: 'buffer' });
            // 获取文件名称
            const filename = workbook.SheetNames[0]
            // 获取第一个工作表数据
            const worksheet = workbook.Sheets[filename]
            // 转化json格式
            const jsondata = xlsx.utils.sheet_to_json(worksheet)
            // 查看
            // 循环拿到所有的回款订单号
            let allList = jsondata.filter(item => item.Sku === req.body.Sku)
            if (allList.length) {
                goodSku = req.body.Sku
                res.send({
                    statu: 200,
                    data: allList
                })
            } else {
                res.send({
                    statu: 201
                })
            }
        }
    })
})

app.get('/getFileName', async function(req, res, next) {
    let time = new Date().getTime()
    res.send({
        statu: 200,
        data: goodSku + ' ' + warehouseName + ' ' + time + '.pdf'
    })
})

app.post('/formatListenerData', async function(req, res, next) {
    console.log(req.body)
})

app.listen('8889',() => {
    console.log('Server is running on port 8889');
})