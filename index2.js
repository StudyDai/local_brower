let d = {
  "results": [
    {
      "words": [
        {
          "lang": "auto",
          "text": "清度\"魔方E\""
        },
        {
          "lang": "auto",
          "text": "宠物烘干机"
        },
        {
          "lang": "auto",
          "text": "不锈钢壳·首个模块化·长质保·高效率"
        },
        {
          "lang": "auto",
          "text": "38"
        },
        {
          "lang": "auto",
          "text": "38"
        },
        {
          "lang": "auto",
          "text": "清度"
        },
        {
          "lang": "auto",
          "text": "佛山市恒亮嘉锐科技有限公司"
        },
        {
          "lang": "auto",
          "text": "shop7707548084927.1688.com"
        }
      ]
    }
  ]
}

// 这是一个词语数组
let data = d.results[0].words
// 构建输出对象
data = data.map(item => item.text).map(i => i.replaceAll(new RegExp('"','g'), ''))
console.log(JSON.stringify(data))
