const path = require('path')
const fs = require('fs')
const axios = require('axios');
const xlsx = require('xlsx')
const AK = "DofH9dOlhAifUPO4VCnsrRgM"
const SK = "xEk33q3zRaQk8cjtCXiPSvoW4UihY8dZ"
const outputData = [['开票日期', '发票号码', '发票类型', '价税合计(大写', '价税合计(小写)', '业务名称', 
    '业务数量', '业务单位', '业务价格', '业务单价', '税收', '税点','购买方名称',
'购买方信用代码', '售卖方名称', '售卖方信用代码', '收款人/复核人', '开票人']]
async function main(file_path) {
    var options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rest/2.0/ocr/v1/multiple_invoice?access_token=' + await getAccessToken(),
        'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
        },
        // image 可以通过 getFileContentAsBase64("C:\fakepath\广州市手指头电子商务有限公司_20240730-侵权律师费_01.jpg") 方法获取,
        data: {
                'image': getFileContentAsBase64(file_path),
                'url': 'https://baidu-ai.bj.bcebos.com/ocr/vat_invoice.jpeg',
                'verify_parameter': 'false',
                'probability': 'false',
                'location': 'false'
        }
    };

    axios(options)
        .then(response => {
            console.log(response.data);
            let result = response.data.words_result[0].result
            for (let index = 0; index < result.CommodityAmount.length; index++) {
                outputData.push([
                    result.InvoiceDate[0]?.word,
                    result.InvoiceNum[0]?.word,
                    result.InvoiceType[0]?.word,
                    result.AmountInWords[0].word, 
                    result.AmountInFiguers[0]?.word, 
                    result.CommodityName[index]?.word, 
                    result.CommodityNum[index]?.word, 
                    result.CommodityUnit[index]?.word,
                    result.CommodityAmount[index]?.word,
                    result.CommodityPrice[index]?.word,
                    result.CommodityTax[index]?.word,
                    result.CommodityTaxRate[index]?.word,
                    result.PurchaserName[0]?.word,
                    result.PurchaserRegisterNum[0]?.word,
                    result.SellerName[0]?.word,
                    result.SellerRegisterNum[0]?.word,
                    result.Remarks[0]?.word,
                    result.NoteDrawer[0]?.word
                ])  
            }

            console.log('-----------------------格式化结果--------------')
            console.log(outputData)
        })
        .catch(error => {
            throw new Error(error);
        })
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {

    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
      axios(options)
          .then(res => {
              resolve(res.data.access_token)
          })
          .catch(error => {
              reject(error)
          })
    })
}

/**
 * 获取文件base64编码
 * @param string  path 文件路径
 * @return string base64编码信息，不带文件头
 */
function getFileContentAsBase64(path) {
    const fs = require('fs');
    try {
        return fs.readFileSync(path, { encoding: 'base64' });
    } catch (err) {
        throw new Error(err);
    }
}
// 这个地方要去读文件夹

async function readFolder() {
    let path_folder = path.resolve(__dirname, './caiwu')
    const dirents = fs.readdirSync(path_folder, { withFileTypes: true });
    console.log(dirents)
    for (let index = 0; index < dirents.length; index++) {
        const element = dirents[index];
        main(`${element.path}\\${element.name}`)
        await delayFn()       
    }
    // 导出数据
    let ali_wb = xlsx.utils.book_new()
    let ali_ws = xlsx.utils.aoa_to_sheet(outputData)
    // 加到一块去
    xlsx.utils.book_append_sheet(ali_wb, ali_ws, '发票清单')
    xlsx.writeFile(ali_wb, path.resolve(__dirname, './发票统计表.xlsx'))
}
// main();
readFolder()

async function delayFn() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, 1500);
    })
}
