const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path')
const multer = require('multer')
const axios = require('axios')
const cors = require('cors');
const xlsx = require('xlsx');
const sharp = require('sharp');
const ExcelJS = require('exceljs')
const { exec, spawn } = require('child_process');
const { Window } = require("node-screenshots");
let windows = Window.all();
const tesseract = require('tesseract.js');
const serveIndex = require('serve-index');
const { pdfToPng } = require('pdf-to-png-converter');
const warehouse_list = require('./warehouse_map.json')
// 这个地方调用下xlsx吧
let xlData = [['操作参数(1点击,2双击,3滚动,4复制,5粘贴,6长按, 7等待, 8自定义, 9移动， 10自定义鼠标操作', '时长/滚动距离', '操作的图片路径']]
// 循环
let aliexpress = [
    "8203414160182153",
    "3059067139304734",
    "3059179540024481",
    "3059299873636089",
    "3059536556169664",
    "8204054069859192",
    "3059492384518757",
    "3058974727382382",
    "8203982928455279",
    "8203360253758135",
    "8204391997522015",
    "8204214934076782",
    "8204046548928465",
    "8203395449645728",
    "8203395287362305",
    "3059036016106830",
    "8204037906438710",
    "8203971720255778",
    "8203599954139751",
    "8203453308491863",
    "8203451867431705",
    "8204375834150661",
    "8203966768430062",
    "8204196617896761",
    "3059491270244257",
    "8203960127197305",
    "8203335297035680",
    "8203334977287728",
    "8203376322246530",
    "8204364070408336",
    "8203953722603600",
    "3059004333898209",
    "3058930885441515",
    "8203322652662528",
    "8204012868319732",
    "3058998811383089",
    "3058997936917885",
    "3058927600649538",
    "8204176537545251",
    "8203361046801810",
    "8203424108053102",
    "8203314812243768",
    "3059423262570429",
    "8203312978256536",
    "8203312655771729",
    "8204167812435641",
    "8203306975876696",
    "8203996381993021",
    "8204338636452933",
    "8204338152774329",
    "8204336233314460",
    "8203551314613775",
    "8203550196311139",
    "8204155895753657",
    "8204330476367899",
    "8204155333197306",
    "8204325918789466",
    "3059207175726246",
    "8203400265559227",
    "8203912840642544",
    "8203399781077043",
    "8203395783480296",
    "8203284891208710",
    "3058931292378668",
    "8203276895674168",
    "8203275934137306",
    "8203965741103539",
    "8203315765087994",
    "8203892525084271",
    "8204130452524310",
    "8204295439615069",
    "8203374347468793",
    "8203372261050038",
    "8204120059603202",
    "8203882521383202",
    "8203948946688689",
    "8203508513224135",
    "8203949023963171",
    "8203366349671733",
    "8203297448798794",
    "3059353750494745",
    "8203247777823106",
    "8204106933520423",
    "3059106833160437",
    "8203931425603085",
    "8204270474147370",
    "8203487232282544",
    "8203230819309928",
    "8203925660951532",
    "8204094773534767",
    "8204094773164767",
    "3058851297153838",
    "8204092373516113",
    "8203227057727595",
    "8204090692727349",
    "3058948500690603",
    "8203219295237297",
    "3059070676591438",
    "8204083011974452",
    "3059259990004773",
    "8204246317755292",
    "8203902868497467",
    "8203902462625016",
    "8204232550023633",
    "8204060132196553",
    "8203820844248667",
    "8203884940810790",
    "3058949249177433",
    "3058778496599511",
    "8203234723653911",
    "3059030219830406",
    "8203873980195825",
    "8203217526764759",
    "8203164498426037",
    "8204031890906037",
    "8203790762897870",
    "3059000694025103",
    "8203158736408301",
    "8203780684045906",
    "8203200247646098",
    "8203200247516098",
    "8203844943707089",
    "3058648403036853",
    "8203262348335497",
    "3058940192934027",
    "8203194405170916",
    "8203261224733634",
    "8203193761415950",
    "8204177277889214",
    "8203141691609794",
    "8203767728294777",
    "8203830941471265",
    "8203763560227276",
    "8203828702621809",
    "8204002216526798",
    "3059163357176182",
    "3058615207991973",
    "8203242347722546",
    "3059112865483573",
    "3059146870086902",
    "8203239144449359",
    "3058917014240603",
    "8203747323364303",
    "8203380434437874",
    "8203988292567243",
    "8203985973731405",
    "8203743242351387",
    "8203802062991293",
    "8204142873244498",
    "3059082940094849",
    "8203732121769219",
    "3058631299772635",
    "3058789721966957",
    "8203712685369716",
    "8203344917116005",
    "8203192983800800",
    "8203339798921926",
    "8203339158152479",
    "8203064412328815",
    "8204095438216988",
    "8204095752291859",
    "8203902456899567",
    "8204072316503614",
    "8203887413496750",
    "8204054479056597",
    "8203881335078587",
    "1114989756696716",
    "3058728937249262",
    "8203612284574887",
    "8203678949685102",
    "8203591403155639",
    "8203580844408607",
    "8202998728207611",
    "8203961117274517",
    "8203610225240597",
    "3058766380068079",
    "8202911852532671",
    "8203178035926987",
    "8203176910855033",
    "8203522361916506",
    "8202989867776276",
    "8203731578119066",
    "8202981223658071",
    "8203475247361930",
    "8203118190610231",
    "8203845191325367",
    "1114824464464918"
]
aliexpress.forEach(item => {
    // 包装
    xlData.push([1,'','./auto_aliexpress/input.jpg'])
    xlData.push([7,'1',''])
    xlData.push([4,item,''])
    xlData.push([5,'',''])
    xlData.push([7,2,''])
    xlData.push([1,'','./auto_aliexpress/code.jpg'])
    xlData.push([7,2,''])
    xlData.push([9, '1 -100', ''])
    xlData.push([7,1,''])
    xlData.push([1,'','./auto_aliexpress/text.jpg'])
    xlData.push([4,'你好，亲爱的顾客，如果后续对订单有任何的问题，请及时告知我们，我们来为您提供合理的解决方案，祝您生活愉快，期待您的下次购物',''])
    xlData.push([5,'',''])
    xlData.push([7,3,''])
    xlData.push([1,'','./auto_aliexpress/send.jpg'])
    xlData.push([7,2,''])
})
// 导出
// let ali_wb = xlsx.utils.book_new()
// let ali_ws = xlsx.utils.aoa_to_sheet(xlData)
// 添加
// xlsx.utils.book_append_sheet(ali_wb, ali_ws, 'sheet')
// 导出
// xlsx.writeFile(ali_wb, path.resolve(__dirname, './aliexpress_msg.xlsx'))
// const https = require('https')
// let current_ip = '192.168.188.79'
// let warehouseName = 'TX'
// let goodSku = 'USA-100'
let currentTime = new Date().getTime();
const options = {
    key: fs.readFileSync('./key/private-key.pem'),
    cert: fs.readFileSync('./key/certificate.pem')
};
var md5 = function (string) {
  
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
  
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
  
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
  
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
  
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
  
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
  
        for (var n = 0; n < string.length; n++) {
  
            var c = string.charCodeAt(n);
  
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
  
        }
  
        return utftext;
    };
  
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
  
    string = Utf8Encode(string);
  
    x = ConvertToWordArray(string);
  
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
  
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
  
    return temp.toLowerCase();
}
// const httpsServer = https.createServer(options, app)
function delayFn() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('delayed response')
        }, 1500)
    })
}
app.use(cors())
// 保存的当前速卖通订单的信息
let aliexpressData = []
async function readPdf() {
    // 开始读取文件
    let file_p = path.resolve(__dirname, 'aliexpress/平台物流订单.xlsx')
    fs.readFile(file_p, async (err, data) => {
        if (err) {
            console.log('err', err)
            return
        }
        const read_data = xlsx.read(data, { type: 'buffer' })
        // 获取文件名称
        const filename = read_data.SheetNames[0]
        // 获取第一个工作表数据
        const worksheet = read_data.Sheets[filename]
        // 转化json格式
        const jsondata = xlsx.utils.sheet_to_json(worksheet)
        console.log(jsondata,'233')
        aliexpressData = jsondata
        for (let index = 0; index < jsondata.length; index++) {
            const element = jsondata[index];
            // 保存起来先
            let p = path.resolve(__dirname, `aliexpress/01/${element['编号']}.pdf`)
            // pdf转图片
            const images = await pdfToPng(p, {
            pagesToProcess: [1], // 只处理第一页
            outputFolder: './temp' // 临时图片存储目录
            });
            // 2. OCR识别图片中的文字（语言设为英文，因运单是英文）
            const { data: { text } } = await tesseract.recognize(
                images[0].path, // 图片路径
                'eng' // 识别语言（支持'chi_sim'简体中文等）
            );
            let number_reg = /U([a-bA-Z0-9]+\d)/ig
            let value = text.match(number_reg)?.[0]
            if (value) {
                // 后四位去对应我的数据,然后去改名字
                let item = aliexpressData.find(data => data['运单号'].includes(value.slice(-4)))
                console.log(aliexpressData[2]['运单号'], value)
                if (item) {
                    console.log('我找到了', item)
                    // 重命名
                    try {
                        let new_p = path.resolve(__dirname, `aliexpress/01/${item['编号']}-${item['仓库']}-${item['运单号'].replace('运单号: ', '')}.pdf`)
                        fs.renameSync(p, new_p);
                        console.log('重命名成功')
                    } catch (err) {
                        console.log('重命名失败', err)
                    }
                }
            } else {
                // 这就是匹配不到的,得把图片给出去,然后收新图片 这个地方暂时不搞先 就是先把UU的发完 然后再发另一个的
            }
        }
    })
}
// app.use('/', serveIndex(path.resolve(__dirname, 'uploads'), {
//     'icons': true,
//     'view': 'details'
// }))
app.use(express.static('uploads'))
app.use('/avatar', express.static('avatar'))
app.use('/temu', express.static('temu'))
app.use('/tiktok', express.static('tiktok'))
app.use('/prv', express.static(path.resolve(__dirname, '../')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.get('/getPic', function(req, res, next) {
    // windows.forEach((item) => {
    //     console.log({
    //       id: item.id,
    //       x: item.x,
    //       y: item.y,
    //       width: item.width,
    //       height: item.height,
    //       rotation: item.rotation,
    //       scaleFactor: item.scaleFactor,
    //       isPrimary: item.isPrimary,
    //     });
      
    //     let image = item.captureImageSync();
    //     fs.writeFileSync(`${item.id}.mp4`, image.toBmpSync());
      
    //     item.captureImage().then(async (data) => {
    //       console.log(data);
    //       let newImage = await data.crop(10, 10, 10, 10);
    //       fs.writeFileSync(`${item.id}.png`, await newImage.toPng());
    //     });
    //   });
})
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
app.post('/getCode', async function(req, res, next) {
    let result = req.body
    console.log('来了', result)
    const worker = await tesseract.createWorker('eng');
    const ret = await worker.recognize(result.data, 'eng');
    console.log(ret.data.text);
    await worker.terminate();
    if (ret.data.text.length) {
        res.send({
            code: 200,
            msg: ret.data.text
        })
    }
    // 关闭识别
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
app.get('/del', async function(req, res, next) {
    try {
        // 检测文件在不在
        // await fs.access(path.resolve(__dirname, '../物流运输表.xlsx'))
        //删掉表
        await fs.unlink(path.resolve(__dirname, '../物流运输表.xlsx'), (err) => {
            console.log(' 我是问题', err)
        })
    } catch (err) {
        console.log(err)
        // 进来就是没删掉或者不存在
        res.send({
            statu: 201,
            msg: '删除失败,或者文件不存在'
        })
        return
    }
    // 这个地方就是删除成功
    res.send({
        statu: 200,
        msg: '删除成功'
    })
})
app.get('/get_map_data', async function(req, res, next) {
    let filePath = path.resolve(__dirname, 'uploads/CardWalletAssociationMapping.xlsx')
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
        const jsondata = xlsx.utils.sheet_to_json(worksheet, { header: 1})
        console.log(jsondata,'看看效果')
        if (jsondata.length) {
            // 返回
            res.send({
                code: 200,
                msg: '请求成功',
                data: jsondata
            })
        }
    })
})
app.post('/save_purchase_table', async function(req, res, next) {
    try {
        console.log(req.body)
        let list_data = req.body;
        // 校验list_data格式，避免空数据报错
        if (!Array.isArray(list_data) || list_data.length === 0 || !Array.isArray(list_data[0])) {
            return res.send({ code: 400, msg: '数据格式错误，需传入二维数组' });
        }

        workbook = new ExcelJS.Workbook();
        worksheet = workbook.addWorksheet('采购单明细');

        // 1. 写表头（保留原有逻辑，正常生效）
        for (let index = 0; index < list_data[0].length; index++) {
            const element = list_data[0][index];
            let code = String.fromCharCode(65 + index);
            worksheet.getCell(`${code}1`).value = element;
        }

        // 2. 渲染图片和数据（修复循环范围+坐标+尺寸）
        // 修复：循环范围改为 index < list_data.length，不遗漏最后一行
        for (let index = 1; index < list_data.length; index++) {
            const element = list_data[index];
            // 跳过空行
            if (!Array.isArray(element)) continue;

            for (let item_index = 0; item_index < element.length; item_index++) {
                const item = element[item_index] || ''; // 避免item为undefined
                let code = String.fromCharCode(65 + item_index);
                const excelRowNum = index + 1; // 对应Excel的实际行号（表头是1，数据从2开始）
                const excelJsRowIndex = excelRowNum - 1; // 转换为ExcelJS的行索引（从0开始）

                // 处理A列（item_index=0）的图片
                if (item_index === 0 && item.trim()) {
                    try {
                        // 图片请求
                        const response = await axios({ 
                            url: item, 
                            method: 'GET', 
                            responseType: 'arraybuffer',
                            timeout: 10000 // 超时设置，避免卡壳
                        });

                        // 修复：正确获取图片后缀（兼容带参数的URL）
                        let pic_ext = path.extname(new URL(item).pathname).toLowerCase();
                        pic_ext = pic_ext.replace('.', '') || 'jpg'; // 无后缀默认jpg
                        // 兼容常见图片格式
                        const validExts = ['jpg', 'jpeg', 'png', 'gif'];
                        if (!validExts.includes(pic_ext)) {
                            pic_ext = 'jpg';
                        }
                        console.log('后缀', pic_ext);

                        // 添加图片到workbook
                        const imageId = workbook.addImage({
                            buffer: response.data,
                            extension: pic_ext,
                        });

                        const imgWidthPx = 75;
                        const imgHeightPx = 75;
                        const colWidth = imgWidthPx / 8.43;
                        const rowHeight = imgHeightPx / 1.33;

                        // 设置A列宽度和当前行高度（只设置一次，避免重复覆盖）
                        if (item_index === 0) {
                            worksheet.getColumn('A').width = Math.ceil(colWidth);
                            worksheet.getRow(excelRowNum).height = Math.ceil(rowHeight);
                        }

                        // 修复：图片插入坐标（简洁准确，无需复杂比例计算）
                        worksheet.addImage(imageId, {
                            tl: { col: 0, row: excelJsRowIndex }, // 左上角：A列 + 当前数据行的ExcelJS索引
                            br: { col: 1, row: excelJsRowIndex + 1 }, // 右下角：B列 + 下一行（确保图片显示在当前单元格）
                            editAs: 'oneCell'
                        });
                        console.log('图片已插入', excelRowNum, '行');

                    } catch (imgErr) {
                        // 图片请求失败，不阻断流程，单元格显示提示
                        console.error('图片加载失败：', imgErr.message);
                        worksheet.getCell(`${code}${excelRowNum}`).value = '图片加载失败';
                    }
                } else {
                    // 处理非图片列数据
                    worksheet.getCell(`${code}${excelRowNum}`).value = item;
                }
            }
        }

        // 写入Excel文件（确保目录存在，避免报错）
        let file_name = new Date().getTime()
        const savePath = path.resolve(__dirname, `caigou/${file_name}.xlsx`);
        // 自动创建caigou目录（如果不存在）
        const dir = path.dirname(savePath);
        const fs = require('fs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        await workbook.xlsx.writeFile(savePath);

        res.send({
            code: 200,
            msg: '成功啦',
            data: savePath
        });
    } catch (err) {
        // 全局错误捕获，返回错误信息
        console.error('接口整体错误：', err);
        res.status(500).send({
            code: 500,
            msg: '生成Excel失败',
            error: err.message
        });
    }
});
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
            // "ProductName": "headlamp",
            // "ProductName": "ultrasonic cutter",
            // "ProductName": "juice cup",
            // "ProductName": "Light board",
            // "ProductName": "ProductName: Manual Screwdriver Set",
            // "ProductName": "Electric Wine Opener",
            "ProductName": "Blade Set",
            // "ProductName": "ProductName: electric Screwdriver Set",
            // "ProductName": "ProductName: Children's Toy Drone",
            // "ProductName": "ProductName: Card Holder",
            // "ProductName": "Bluetooth headset",
            "Model": "Model: " + saveName,
            "Manufacturer": "Manufacturer: Guangzhoushishouzhitoudianzishangwu Co., Ltd.",
            "Address": "Address: CN-B2-08, No. 81 Xinye Road, Haizhu District, Guangzhou (office only). Guangzhou, China",
            "Representative": "EU ResponsiblePerson: Linc Cong\nEU RepresentativeAddress: Friedrich-Ebert-Anlage 36, 60325 Frankfurt, Hesse, Germany.\nTel: 49-030800982701\nE-mail: eurep@wincomply.com",
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
            'Cookie': 'MYJ_MKTG_fapsc5t4tc=JTdCJTdE; Hm_lvt_f8001a3f3d9bf5923f780580eb550c0b=1746126985,1746494824,1746850845; tfstk=glSZURmmqlEaVhA9SMtqzXF5t7K9jnP5niOXntXDCCAifcGc8_CaBEif5n5VO18cfh61TsWVZN9XjN_23_6MosOfCAQdNTm1fPKj0hKvm7N7VuwOBnKmGsLKdcBhpLgmoyTgfQuyt7N7VkZmigg8NswVt4_eHBvmjcmgLevDemxDSdv3LKvjsqmGiJye3LpmIn0MxkvyUnAcin2ExBpDmdfDmjv1ItmeFF2b9C5TiWzeHQXMTmmred8i39gjXcFvIFOk-QoD3MJw7QXGfQ1CFpjCYUTIh7-hew1ML3rqxh8PS1JhpSoysa6JxBfm_W9dS1SHuMwYW9S2_UjM8xoRdnJciE7La09wfw8PbNextOfW_axOhYP1LU7eypYn3Vx1PTsvrGqZwBTJ3_JP_fSPPjpnG-SA7j02SppeNJyFFAatP0sr4bgxkexJLQw6Cq3vSppeNJyEkqLH9pR7Cd1..; HMACCOUNT=955D29CC551A0EB6; _clck=qzfyir%7C2%7Cfw2%7C0%7C1913; dxm_i=MTY1NzU2MiFhVDB4TmpVM05UWXkhMGE0YjdiNjdkMTQ4NTkwM2Q1MGVjYTUzZWNiZDg5OTI; dxm_t=MTc0NzcyNDkzNSFkRDB4TnpRM056STBPVE0xIThjNjY5MTRiYzBlNDkzZjZlNGRlNjM5MGM5ODI2YTlh; dxm_c=WGE2cWpjYTIhWXoxWVlUWnhhbU5oTWchZDJkMzY3NDkwMTViYWNhOGNiOTlhMjdhOTE4YjI3ZDc; dxm_w=MmM5OGU3NDFmNThmYmZkYTQ2MzQ4YzM4NmIyNzk0MDAhZHoweVl6azRaVGMwTVdZMU9HWmlabVJoTkRZek5EaGpNemcyWWpJM09UUXdNQSE0NjVjYzVkMzkwNThjMjUwYTllZWJmM2RkNzQyNGEyYQ; dxm_s=5V5FW5B4_nytS341aTodwzHuTXIcZc2Fcl-efcg3IxI; _dxm_ad_client_id=9BDC465FBF19965E9B969BBEF342D0ED3; Hm_lpvt_f8001a3f3d9bf5923f780580eb550c0b=1747729731; MYJ_fapsc5t4tc=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjIwZDRmZmZjNy03YWJkLTQzYWItYjUyYy02NDg2MDdkOWU3NWElMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjIxNjU3NTYyJTIyJTJDJTIycGFyZW50SWQlMjIlM0ElMjIxNjQyNDA3JTIyJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTc0NzcyOTczMDk5NiUyQyUyMm9wdE91dCUyMiUzQWZhbHNlJTJDJTIybGFzdEV2ZW50SWQlMjIlM0E1NSU3RA==; _clsk=1uh267x%7C1747729732231%7C1%7C0%7Cj.clarity.ms%2Fcollect; JSESSIONID=4D315B7BBFE26A2433EDD02BB81A293D'
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

app.post('/saveXlsx', async (req, res ,next) => {
    console.log(req.body)
    const wb = xlsx.utils.book_new()
    // 转化
    const ws = xlsx.utils.aoa_to_sheet(JSON.parse(req.body.data))
    // 添加
    xlsx.utils.book_append_sheet(wb, ws, 'TEMU一周数据表')
    // 导出
    xlsx.writeFile(wb, path.resolve(__dirname, 'temu/' + req.body.mallid + '.xlsx'))
    // await readPdf()
    res.send({
        code: 200,
        data: 'http://192.168.188.77:8889/temu/' + req.body.mallid + '.xlsx'
    })
    // 来啦
})

app.post('/saveXlsx_tk', async (req, res ,next) => {
    let date = new Date().getTime()
    console.log(req.body)
    const wb = xlsx.utils.book_new()
    // 转化
    const ws = xlsx.utils.aoa_to_sheet(req.body)
    // 添加
    xlsx.utils.book_append_sheet(wb, ws, 'tiktok一周数据表')
    // 导出
    xlsx.writeFile(wb, path.resolve(__dirname, 'tiktok/' + date + '.xlsx'))
    res.send({
        code: 200,
        data: 'http://192.168.188.77:8889/tiktok/' + date + '.xlsx'
    })
    // 来啦
})

app.get('/exist', async (req, res, next) => {
    try {
        fs.accessSync(path.resolve(__dirname, '../物流运输表.xlsx'))
    } catch(err) {
        console.log(err)
        return res.send({
            statu: 201,
            msg: '文件不存在'
        })
    }
    res.send({
        statu: 200,
        msg: '文件存在'
    })
})

app.post('/translate', async (req, res, next) => {
    // const message = req.body.message.replace(/\(.*\)/ig, '').replace(/<[a-z]*.+>/ig, '')
    const message = req.body.msg
    // 这个地方要翻译一次
    var appid = '20250605002374585';
    var key = 'fsr5px4yWEaneNGTyThC';
    var salt = (new Date).getTime();
    var query = message;
    var from = 'auto'; // 英语
    var to = 'zh'; // 中文
    var str1 = appid + query + salt +key;
    var sign = md5(str1);
    const data = await fetch(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${query}&appid=${appid}&salt=${salt}&from=${from}&to=${to}&sign=${sign}`, {
        method: 'get',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }).then(res => res.json())
    if (data.trans_result.length) {
        res.send({
            code: 200,
            data: data.trans_result[0].dst
        })
    }
})

app.get('/callUser', async (req, res, next) => {
    // 2. 启动 Python 子进程（关键：开启 stdio 通信，确保能发送输入）
    const pythonProcess = spawn('python', ['main_project.py']);
    // 监听标准输出
    pythonProcess.stdout.on('data', (data) => {
        console.log(`标准输出:\n${data}`);
        if (data.includes('True')) {
            const input1 = '1\n';
            pythonProcess.stdin.write(input1)
            console.log(`Node 已发送输入：${input1.trim()}`);
            res.send({
                code: 200,
                msg: 'call成功了哈'
            })
        }
    });
    pythonProcess.on('close', (code) => {
        console.log(`Python 脚本执行结束，退出码：${code}`);
    });
})

app.post('/getGoodList', async function(req, res, next) {
    const { cookie, mallid, sku_item } = req.body
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
    if (cookie && mallid && sku_item) {
        // 每次进来先随机等待个1-3秒
        let rand = Math.floor(Math.random() * 3) + 1
        await delayFn(rand * 1000)
        let resultList = []
        await delayFn()
        await getAllList('https://agentseller.temu.com/visage-agent-seller/product/skc/pageQuery', {page: 1, pageSize: 500, productSkuIds:[sku_item]}, resultList)
        // 返回给用户
        res.send({
            statu: 200,
            data: resultList
        })
    } else if (cookie && mallid) {
        let resultList = []
        await getAllList('https://agentseller.temu.com/visage-agent-seller/product/skc/pageQuery', {page: 1, pageSize: 300}, resultList)
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

// 将本地的json传递过去，然后等返回更新
app.get('/warehouse_list', async function (req, res, next) {
    res.send({
        code: 200,
        data: warehouse_list
    })
})

// 更新本地的json数据
app.post('/update_warehouse_map', async function (req, res, next) {
    const data = req.body
    let file_path = path.resolve(__dirname, './warehouse_map.json')
    fs.writeFileSync(file_path, JSON.stringify(data), 'utf8')
    console.log('更新成功')
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

