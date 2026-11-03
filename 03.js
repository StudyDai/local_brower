const path = require('path')
const xlsx = require("xlsx")
function read_xlsx_data (filePath, sheetName) {
    if (!filePath) {
        return "路径不能为空"
    }
    const wookbook = xlsx.readFile(filePath)
    let sheetname;
    if (sheetName) {
      sheetname = wookbook.SheetNames.find(item => item == sheetName)
      if (!sheetname) {
        return "传递的子表名称有误"
      }
    } else {
      sheetname = wookbook.SheetNames[0]
    }
    // 拿到内容
    const worksheet = wookbook.Sheets[sheetname]
    // 转json
    const json_data = xlsx.utils.sheet_to_json(worksheet)
    // console.log(json_data)
    // 获取表格名称
    if (json_data.length) {
        return json_data
    } else {
        return []
    }
  }
let filePath = path.resolve(__dirname, "aliexpress/积加利润分析表_多语言匹配.xlsx")

console.log(read_xlsx_data(filePath,"Sheet1"))