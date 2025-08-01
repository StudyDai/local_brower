const { default: axios } = require('axios');
const md5 = require('./md5')
async function delayFn() {
    setTimeout(() => {
        return Promise.resolve()
    }, 1000);
}
/**
 * 统计英语标题中每个单词的出现次数，返回未排序的二维数组
 * @param {string} title - 输入的英语标题
 * @returns {Array<Array>} - 二维数组，格式为 [[单词, 次数, 翻译], ...]
 */
async function countWordFrequency(title, frequencyMap = {}) {
    // 处理特殊情况：如果标题为空或不是字符串，返回空数组
    if (!title || typeof title !== 'string') {
        return [];
    }

    // 1. 将标题转换为小写
    let processedTitle = title.toLowerCase();

    // 2. 移除连字符周围的空格（例如："food - koi" → "food-koi"）
    processedTitle = processedTitle.replace(/\s*-\s*/g, '-');

    // 3. 处理逗号：将逗号替换为空格（例如："apple,banana" → "apple banana"）
    processedTitle = processedTitle.replace(/,/g, ' ');

    // 4. 处理其他标点符号：移除除连字符外的所有标点符号（保留字母、数字、连字符和空格）
    processedTitle = processedTitle.replace(/[^a-z0-9\-\s]/g, '');

    // 5. 分词：将字符串按空格分割成单词数组
    const words = processedTitle.split(/\s+/);

    // 6. 统计词频
    for (let index = 0; index < words.length; index++) {
        const word = words[index];
        if (word.trim() === '') return;
        // 这个地方word要去翻译下看看
        if (frequencyMap[word]) {
            frequencyMap[word].count += 1
        } else {
            frequencyMap[word] = {
                count: 1,
                translate: ''
            }
            // 这个地方要翻译一次
            var appid = '20250605002374585';
            var key = 'fsr5px4yWEaneNGTyThC';
            var salt = (new Date).getTime();
            var query = word;
            var from = 'en'; // 英语
            var to = 'zh'; // 中文
            var str1 = appid + query + salt +key;
            var sign = md5(str1);
            const data = await axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate', {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    q: query,
                    appid: appid,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign
                }
            })
            if (data.data.trans_result.length) {
                // 有东西
                console.log(data.data.trans_result[0])
                // 这个就是翻译结果
                let result = data.data.trans_result[0]
                frequencyMap[word].translate = result.dst
            } else {
                // 这个单词咩有翻译成功
                console.log("我是错误的哦~", data.data.trans_result)
            }
            await delayFn()
        }
    }
    // 二维数组来的，第一个值是key，第二个值是value
    return frequencyMap
}

// 示例用法
let result_obj = {}
// const title = "High-quality Fish Food - Koi king Food, Rich in Nutrition";
const titleList = ["15 Catgrass Stick Hairball Freeze-dried Cat Snack Teeth Stick Instant Catgrass Granule Hair Cream Cat Grass Tablets For Cats","Premium Cat Grass Freeze-Dried Granules for Hairball Relief & Dental Health"]
async function fn() {
    for (let index = 0; index < titleList.length; index++) {
        const title = titleList[index];
        const result = await countWordFrequency(title, result_obj)   
        result_obj = result 
    }
    // 打印结果
    console.log(Object.entries(result_obj).map(([word, value]) => [word, value.count, value.translate]))
}
fn()
