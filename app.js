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
app.use(express.static('uploads'))
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
        const uploadDir = path.join(__dirname, 'demo');

        // 检查目录是否存在，如果不存在则创建
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, 'demo/');
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

app.post('/getZero', upload.single('file'), function(req, res, next) {
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
        allList = jsondata
        res.send({
            statu: 200,
            data: allList
        })
    })
})

app.post('/getDianxiaomiPDF', async (req, res, next) => {
    const { saveName } = req.body
    console.log(saveName)
    let url = 'https://www.dianxiaomi.com/dxmLabel/printPdf.json'
    var param = {
        'detailsData': [{
            "ProductName": "ProductName: Manual Screwdriver Set",
            // "ProductName": "ProductName: Children's Toy Drone",
            // "ProductName": "ProductName: Card Holder",
            "Model": "Model: " + saveName,
            "Manufacturer": "Manufacturer: Guangzhoushishouzhitoudianzishangwu Co., Ltd.",
            "Address": "Address: CN-B2-08, No. 81 Xinye Road, Haizhu District, Guangzhou (office only). Guangzhou, China",
            "Representative": "EU ResponsiblePerson: SUCCESS COURIER SL\nEU RepresentativeAddress: ES-CALLE RIO TORMES NUM. 1, PLANTA 1, DERECHA, OFICINA 3, Fuenlabrada, Madrid, 28947 Spain\nTel: 34-910602659\nE-mail: successservice2@hotmail.com",
            "userDefaultText1": "IWAN7299@163.com",
            "userDefaultText2": "Made In China"
        }],
        'templateData': {
            "content": "{\"workspaceElementsData\":[{\"name\":\"ProductName\",\"drawId\":\"\",\"x\":798,\"y\":800,\"pageX\":1.137499999999982,\"pageY\":1.6666666666666485,\"w\":291,\"h\":28,\"pageW\":76.99374999999999,\"pageH\":7.408333333333333,\"value\":\"\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,9,10,11,12],\"pageFontSize\":2.6458333333333335,\"pageLetterSpacing\":0,\"z\":0,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"10px\"},\"title\":\"产品标题\",\"id\":\"businessField-1-1726645955000\",\"type\":\"businessField\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"autoWrap\":true,\"pageFontSizeInPt\":7.5,\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"children\":null,\"isTable\":false,\"canvasName\":\"1\",\"pageLetterSpacingInPt\":0,\"indexByType\":1,\"example\":\"ProductName：xxxxxxxxxx\"},{\"name\":\"Model\",\"drawId\":\"\",\"x\":803,\"y\":844,\"pageX\":2.4604166666666485,\"pageY\":13.308333333333316,\"w\":284,\"h\":14,\"pageW\":75.14166666666667,\"pageH\":3.7041666666666666,\"value\":\"\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,9,10,11,12],\"pageFontSize\":2.6458333333333335,\"pageLetterSpacing\":0,\"z\":1,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"10px\"},\"title\":\"型号\",\"id\":\"businessField-2-1726645982951\",\"type\":\"businessField\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"autoWrap\":true,\"pageFontSizeInPt\":7.5,\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"children\":null,\"isTable\":false,\"canvasName\":\"2\",\"pageLetterSpacingInPt\":0,\"indexByType\":2,\"example\":\"Model：xxxxxxxxxx\"},{\"name\":\"Manufacturer\",\"drawId\":\"\",\"x\":800,\"y\":817,\"pageX\":1.6666666666666485,\"pageY\":6.164583333333315,\"w\":288,\"h\":28,\"pageW\":76.19999999999999,\"pageH\":7.408333333333333,\"value\":\"\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,9,10,11,12],\"pageFontSize\":2.6458333333333335,\"pageLetterSpacing\":0,\"z\":2,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"10px\"},\"title\":\"制造商\",\"id\":\"businessField-3-1726646008019\",\"type\":\"businessField\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"autoWrap\":true,\"pageFontSizeInPt\":7.5,\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"children\":null,\"isTable\":false,\"canvasName\":\"3\",\"pageLetterSpacingInPt\":0,\"indexByType\":3,\"example\":\"Manufacturer：xxxxxxxxxx\"},{\"name\":\"Address\",\"drawId\":\"\",\"x\":803,\"y\":858,\"pageX\":2.4604166666666485,\"pageY\":17.01249999999998,\"w\":290,\"h\":56,\"pageW\":76.72916666666667,\"pageH\":14.816666666666666,\"value\":\"\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,9,10,11,12],\"pageFontSize\":2.6458333333333335,\"pageLetterSpacing\":0,\"z\":3,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"10px\"},\"title\":\"制造商地址\",\"id\":\"businessField-4-1726646020368\",\"type\":\"businessField\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"autoWrap\":true,\"pageFontSizeInPt\":7.5,\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"children\":null,\"isTable\":false,\"canvasName\":\"4\",\"pageLetterSpacingInPt\":0,\"indexByType\":4,\"example\":\"Address：xxxxxxxxxx\"},{\"name\":\"userDefaultText2\",\"drawId\":\"\",\"x\":1012,\"y\":951,\"pageX\":57.75833333333332,\"pageY\":41.618749999999984,\"w\":81,\"h\":51,\"pageW\":21.43125,\"pageH\":13.493749999999999,\"value\":\"\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,9,10,11,12],\"pageFontSize\":3.175,\"pageLetterSpacing\":0,\"z\":4,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"12px\",\"alignItems\":\"center\"},\"title\":\"自定义文本2\",\"id\":\"businessField-6-1726646087172\",\"type\":\"businessField\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"autoWrap\":true,\"pageFontSizeInPt\":9,\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"children\":null,\"isTable\":false,\"canvasName\":\"6\",\"pageLetterSpacingInPt\":0,\"indexByType\":5,\"example\":\"\"},{\"name\":\"ecrepLogo\",\"drawId\":\"\",\"x\":802,\"y\":904,\"pageX\":2.195833333333315,\"pageY\":29.183333333333312,\"w\":88,\"h\":38,\"pageW\":23.28333333333333,\"pageH\":10.054166666666665,\"value\":\"\",\"active\":false,\"canEditItems\":[1,10,11],\"pageFontSize\":0,\"pageLetterSpacing\":0,\"z\":5,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\"},\"title\":\"\",\"id\":\"baseCtrolImage-7-1726646101654\",\"type\":\"baseCtrolImage\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"src\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231025223646/54976d02cb334d6f5e81091c0dd5bba9.png\",\"uploadConfig\":{\"checkUrl\":\"/cos/cosDxmCallBack.json\",\"newGetSign\":\"/cos/getSign.json\"},\"fileSizeMax\":2048,\"fileMax\":1,\"styleKeys\":[],\"key\":null,\"image\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231025223646/54976d02cb334d6f5e81091c0dd5bba9.png\",\"children\":null,\"isTable\":false,\"canvasName\":\"7\",\"indexByType\":1,\"example\":\"\"},{\"name\":\"ceLogo\",\"drawId\":\"\",\"x\":1028,\"y\":1055,\"pageX\":61.991666666666646,\"pageY\":69.13541666666664,\"w\":47,\"h\":33,\"pageW\":12.435416666666665,\"pageH\":8.73125,\"value\":\"\",\"active\":false,\"canEditItems\":[1,10,11],\"pageFontSize\":0,\"pageLetterSpacing\":0,\"z\":6,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\"},\"title\":null,\"id\":\"baseCtrolImage-11-1726646187854\",\"type\":\"baseCtrolImage\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"src\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231025223646/8df0a057c1367d44eecd3ee22556c10e.png\",\"uploadConfig\":{\"checkUrl\":\"/cos/cosDxmCallBack.json\",\"newGetSign\":\"/cos/getSign.json\"},\"fileSizeMax\":2048,\"fileMax\":1,\"styleKeys\":[],\"key\":null,\"image\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231025223646/8df0a057c1367d44eecd3ee22556c10e.png\",\"children\":null,\"isTable\":false,\"canvasName\":\"11\",\"indexByType\":2,\"example\":\"\"},{\"name\":\"nweeeLogo\",\"drawId\":\"\",\"x\":1048,\"y\":1005,\"pageX\":67.28333333333332,\"pageY\":55.90624999999997,\"w\":42,\"h\":47,\"pageW\":11.112499999999999,\"pageH\":12.435416666666665,\"value\":\"\",\"active\":false,\"canEditItems\":[1,10,11],\"pageFontSize\":0,\"pageLetterSpacing\":0,\"z\":7,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\"},\"title\":\"\",\"id\":\"baseCtrolImage-12-1726646242150\",\"type\":\"baseCtrolImage\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"src\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231115105512/915c5ffad393fde534c8ac09540822c7.jpg\",\"uploadConfig\":{\"checkUrl\":\"/cos/cosDxmCallBack.json\",\"newGetSign\":\"/cos/getSign.json\"},\"fileSizeMax\":2048,\"fileMax\":1,\"styleKeys\":[],\"key\":null,\"image\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231115105512/915c5ffad393fde534c8ac09540822c7.jpg\",\"children\":null,\"isTable\":false,\"canvasName\":\"12\",\"indexByType\":3,\"example\":\"\"},{\"name\":\"ukcaLogo\",\"drawId\":\"\",\"x\":1017,\"y\":1004,\"pageX\":59.081249999999976,\"pageY\":55.641666666666644,\"w\":27,\"h\":30,\"pageW\":7.14375,\"pageH\":7.9375,\"value\":\"\",\"active\":false,\"canEditItems\":[1,10,11],\"pageFontSize\":0,\"pageLetterSpacing\":0,\"z\":8,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\"},\"title\":\"\",\"id\":\"baseCtrolImage-13-1726646254638\",\"type\":\"baseCtrolImage\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"src\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231025223646/a3721528e6909ad0032722679c7fbe70.png\",\"uploadConfig\":{\"checkUrl\":\"/cos/cosDxmCallBack.json\",\"newGetSign\":\"/cos/getSign.json\"},\"fileSizeMax\":2048,\"fileMax\":1,\"styleKeys\":[],\"key\":null,\"image\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20231025223646/a3721528e6909ad0032722679c7fbe70.png\",\"children\":null,\"isTable\":false,\"canvasName\":\"13\",\"indexByType\":4,\"example\":\"\"},{\"name\":\"trimanGroupLogo\",\"drawId\":\"\",\"x\":805,\"y\":952,\"pageX\":2.989583333333315,\"pageY\":41.88333333333331,\"w\":197,\"h\":61,\"pageW\":52.12291666666667,\"pageH\":16.13958333333333,\"value\":\"\",\"active\":false,\"canEditItems\":[1,10,11],\"pageFontSize\":0,\"pageLetterSpacing\":0,\"z\":9,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\"},\"title\":\"\",\"id\":\"baseCtrolImage-14-1726646326041\",\"type\":\"baseCtrolImage\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"src\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20240106010211/40699e80e5b22acf71380173170d72bb.png\",\"uploadConfig\":{\"checkUrl\":\"/cos/cosDxmCallBack.json\",\"newGetSign\":\"/cos/getSign.json\"},\"fileSizeMax\":2048,\"fileMax\":1,\"styleKeys\":[],\"key\":null,\"image\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20240106010211/40699e80e5b22acf71380173170d72bb.png\",\"children\":null,\"isTable\":false,\"canvasName\":\"14\",\"indexByType\":5,\"example\":\"\"},{\"name\":\"trimanGroup1Logo\",\"drawId\":\"\",\"x\":809,\"y\":1013,\"pageX\":4.047916666666649,\"pageY\":58.022916666666646,\"w\":206,\"h\":76,\"pageW\":54.50416666666667,\"pageH\":20.10833333333333,\"value\":\"\",\"active\":false,\"canEditItems\":[1,10,11],\"pageFontSize\":0,\"pageLetterSpacing\":0,\"z\":10,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\"},\"title\":\"\",\"id\":\"baseCtrolImage-15-1726646361659\",\"type\":\"baseCtrolImage\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"src\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20240106010211/52d24bd8e0694d5bad23b5e6805fe55d.png\",\"uploadConfig\":{\"checkUrl\":\"/cos/cosDxmCallBack.json\",\"newGetSign\":\"/cos/getSign.json\"},\"fileSizeMax\":2048,\"fileMax\":1,\"styleKeys\":[],\"key\":null,\"image\":\"https://wxalbum-10001658.picsh.myqcloud.com/wxalbum/0/20240106010211/52d24bd8e0694d5bad23b5e6805fe55d.png\",\"children\":null,\"isTable\":false,\"canvasName\":\"15\",\"indexByType\":6,\"example\":\"\"},{\"name\":\"Representative\",\"drawId\":\"\",\"x\":896,\"y\":899,\"pageX\":27.06666666666665,\"pageY\":27.860416666666648,\"w\":191,\"h\":112,\"pageW\":50.53541666666666,\"pageH\":29.633333333333333,\"value\":\"\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,9,10,11,12],\"pageFontSize\":2.1166666666666663,\"pageLetterSpacing\":0,\"z\":11,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"8px\",\"justifyContent\":\"flex-start\"},\"title\":\"欧盟责任人\",\"id\":\"businessField-13-1726647053508\",\"type\":\"businessField\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"autoWrap\":true,\"pageFontSizeInPt\":6,\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"children\":null,\"isTable\":false,\"canvasName\":\"13\",\"indexByType\":6,\"pageLetterSpacingInPt\":0,\"example\":\"Representative：xxxxxx<br/>RepresentativeAddress：xxxxxx<br/>Tel：xxxxxx<br/>E-mail：xxxxxx\"},{\"name\":\"\",\"drawId\":\"\",\"x\":802,\"y\":885,\"pageX\":2.195833333333315,\"pageY\":24.15624999999998,\"w\":120,\"h\":40,\"pageW\":31.75,\"pageH\":10.583333333333334,\"value\":\"E-mail:\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,10,11,12,14,15],\"pageFontSize\":2.6458333333333335,\"pageLetterSpacing\":0,\"z\":12,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"10px\",\"resize\":\"none\",\"padding\":0,\"paddingTop\":\"0px\"},\"title\":\"文本元件\",\"id\":\"baseCtrolText-13-1726648233799\",\"type\":\"baseCtrolText\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"pageFontSizeInPt\":7.5,\"placeholder\":\"请输入文本\",\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"canvasName\":\"13\",\"indexByType\":1,\"pageLetterSpacingInPt\":0,\"example\":\"\"},{\"name\":\"userDefaultText1\",\"drawId\":\"\",\"x\":840,\"y\":884,\"pageX\":12.249999999999982,\"pageY\":23.891666666666648,\"w\":248,\"h\":33,\"pageW\":65.61666666666666,\"pageH\":8.73125,\"value\":\"\",\"active\":false,\"canEditItems\":[1,2,3,4,5,6,7,9,10,11,12],\"pageFontSize\":2.6458333333333335,\"pageLetterSpacing\":0,\"z\":13,\"style\":{\"display\":\"flex\",\"width\":\"100%\",\"height\":\"100%\",\"textAlign\":\"left\",\"color\":\"black\",\"border\":\"0 solid black\",\"borderWidth\":0,\"borderColor\":\"#000\",\"borderStyle\":\"solid\",\"backgroundColor\":\"transparent\",\"fontFamily\":\"SourceHanSans\",\"letterSpacing\":\"0px\",\"fontWeight\":\"normal\",\"fontSize\":\"10px\"},\"title\":\"自定义文本1\",\"id\":\"businessField-14-1726648271011\",\"type\":\"businessField\",\"minWidth\":10,\"minHeight\":10,\"maxWidth\":1600,\"maxHeight\":1600,\"autoWrap\":true,\"pageFontSizeInPt\":7.5,\"languageType\":\"\",\"styleKeys\":[\"alignItems\",\"fontSize\",\"fontWeight\",\"fontStyle\",\"textDecoration\",\"letterSpacing\",\"justifyContent\",\"textAlign\",\"borderStyle\",\"borderWidth\",\"borderColor\",\"color\",\"backgroundColor\",\"fontFamily\"],\"children\":null,\"isTable\":false,\"canvasName\":\"14\",\"indexByType\":7,\"pageLetterSpacingInPt\":0,\"example\":\"\"}],\"pageConfig\":{\"paperWidth\":80,\"paperHeight\":80,\"paperMarginLeftRight\":0,\"paperMarginTopBottom\":0,\"selectBillSize\":\"custom\",\"billCustomSizeWidth\":80,\"billCustomSizeHeight\":80,\"paperSpacingX\":0,\"paperSpacingY\":0,\"paperType\":\"flat\",\"type\":0,\"templateType\":\"euLabel\",\"templateName\":\"速卖通8*8小件GPSR模板\",\"billSize\":\"\",\"rows\":1,\"watermark\":\"保密\",\"isMutiplePage\":false,\"columnNumber\":1}}"
        }
    }
    const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(param),
        headers: {
            'content-type': 'application/json',
            'Cookie': 'MYJ_MKTG_fapsc5t4tc=JTdCJTdE; tfstk=ghQneZ9XGM-QHpWxpO8QDD1cTkrOJXTWpT3JeUpzbdJspv3daQ4leOHR9kTdrzvGFpKp8eKyZtCJL6C8F4cyI9uJvafSrQ5PFW98OlCCOUTzH-Buk61Cc65_kSneb7RJivP9YDvmDdTzH-UtXf-QpUWdDaTLI1J6w2oyTT-w_QAJzQRez5vwZIirLT8zs5AJG4JyTplwbIdXzLWyz5fwCQlAi4JczN_aQ4eOqORLCNdHxK5eL6Ch7P-SAOJi7V7GjEvqrd0rzNAF64dyDqqJ3i9pDd6aW2Yl_QXDi9DaIU5GRZxN8RglnOj2SCs_E0vc46If4hVU81YHKnb9XXok-gWCrHsnNS1w8OsXhHr_CCbdk3vXjAyF61vemgXLC4Jdm1WMDNHtkF5VjFjy1coqlJuWmJsmV0te1CvvM0fI8YsNoEVgsmZBYCOLH5ViV0te1CvYs5mjFHR69-C..; _dxm_ad_client_id=F9A19E33B010733177DE3FA9E7908D218; Hm_lvt_f8001a3f3d9bf5923f780580eb550c0b=1743149708,1743383215,1743576175,1744597212; HMACCOUNT=955D29CC551A0EB6; dxm_i=MTY2NTUwOCFhVDB4TmpZMU5UQTQhMWVhNjVjNzZjNDU2YjZmNzljOGJhOTM5NjM2NzRlODc; dxm_t=MTc0NDc4ODg2NyFkRDB4TnpRME56ZzRPRFkzIWQ1NWVmNWVkMGJjNzZiNTQzMmI1Y2UyOWI3ZmE4ZDRj; dxm_c=bmk2WFlkemQhWXoxdWFUWllXV1I2WkEhY2JmNDM1ZTFlMmRmNmM3YmM3NmMyMWU3Mjc0NjVmNDY; dxm_w=YjQxY2I2MmVjNjc2N2YyZTQxZjlkZjdhMmQxNjE1MTUhZHoxaU5ERmpZall5WldNMk56WTNaakpsTkRGbU9XUm1OMkV5WkRFMk1UVXhOUSE3ZGExZmNkNTc2Y2RhMDVmYWFhOTQ5ZjBlNDc4ZTk2MQ; dxm_s=StmwR3CXQFvEykhYLhb2_9GNF1zKRtkLY69ynDZxVoo; _clck=qzfyir%7C2%7Cfv6%7C0%7C1913; MYJ_fapsc5t4tc=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjIwZDRmZmZjNy03YWJkLTQzYWItYjUyYy02NDg2MDdkOWU3NWElMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjIxNjY1NTA4JTIyJTJDJTIycGFyZW50SWQlMjIlM0ElMjIxNjQyNDA3JTIyJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTc0NDk1OTc2OTQyOCUyQyUyMm9wdE91dCUyMiUzQWZhbHNlJTJDJTIybGFzdEV2ZW50SWQlMjIlM0EyNCU3RA==; Hm_lpvt_f8001a3f3d9bf5923f780580eb550c0b=1744959770; _clsk=p6w1dg%7C1744959770378%7C1%7C0%7Cl.clarity.ms%2Fcollect; JSESSIONID=CA126220EBACA22784C32C06A8DB8128'
        }
    }).then(res => res.json())
    if (!result.code) {
        // 把result返回给前端
        res.send({
            statu: 200,
            data: result.data
        })
    }
})


app.post('/getGoodList', async function(req, res, next) {
    const { cookie, mallid, skc_item } = req.body
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
    if (cookie && mallid && skc_item) {
        let resultList = []
        await delayFn()
        await getAllList('https://seller.kuajingmaihuo.com/bg-visage-mms/product/skc/pageQuery', {page: 1, pageSize: 500, productSkcIds:[skc_item]}, resultList)
        // 返回给用户
        res.send({
            statu: 200,
            data: resultList
        })
    } else if (cookie && mallid) {
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
        secondSecret: vertifyTime(String(timee), 'm', 1, uuid+'$y'+ firstCode, true)
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

// 这边去拿销量
// app.post


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