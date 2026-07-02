const axios = require('axios');
const fs = require('fs');
const path = require('path');
let pictures_num = 0

/**
 * 模拟人为延迟，随机时间间隔
 * @param {number} min 最小延迟(ms)
 * @param {number} max 最大延迟(ms)
 */
const randomDelay = (min = 500, max = 2000) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * 获取验证码图片并下载
 * @param {string} captchaUrl 验证码接口地址
 * @param {string} saveDir 保存目录
 */
async function fetchAndSaveCaptcha(captchaUrl, saveDir = './captcha_images') {
  console.log('🖱️  模拟人为操作：准备请求验证码...');
  
  // 1. 模拟人为等待（像人在操作前思考）
  await randomDelay(1500, 3000);
  
  // 2. 构造请求头，模拟真实浏览器
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Referer': 'http://omsbackend.jaspers.com.cn:16017/',
    'Origin': 'http://omsbackend.jaspers.com.cn:16017',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  try {
    console.log('📡 发送请求获取验证码...');
    
    // 3. 模拟人为点击前的小停顿
    await randomDelay(300, 800);
    
    // 4. 发送请求
    const response = await axios.get(captchaUrl, {
      headers: headers,
      timeout: 10000,
      // 不自动跟随重定向，模拟浏览器行为
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });

    // 5. 模拟请求完成后的思考时间
    await randomDelay(200, 500);

    // 6. 检查响应状态
    if (response.status !== 200) {
      console.log(`⚠️  请求返回状态码: ${response.status}`);
      return null;
    }

    const result = response.data;
    
    // 7. 检查业务状态码
    if (result.code !== 200) {
      console.log(`❌ 业务接口返回错误: ${result.msg}`);
      return null;
    }

    const { img, uuid, captchaEnabled } = result.data;
    
    if (!captchaEnabled) {
      console.log('ℹ️  验证码功能未开启');
      return null;
    }

    if (!img) {
      console.log('❌ 未获取到验证码图片数据');
      return null;
    }

    console.log(`✅ 获取验证码成功，UUID: ${uuid}`);

    // 8. 模拟保存前的确认
    await randomDelay(300, 600);

    // 9. 确保保存目录存在
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    // 10. 生成文件名（使用UUID和时间戳，模拟自然命名）
    const timestamp = Date.now();
    const filename = `captcha_${uuid.slice(0,8)}_${pictures_num++}.png`;
    const filepath = path.join(saveDir, filename);
    

    // 11. 解码 base64 并保存
    const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    fs.writeFileSync(filepath, imageBuffer);
    
    console.log(`💾 验证码图片已保存: ${filepath}`);
    console.log(`🔑 UUID: ${uuid}`);
    
    // 12. 模拟保存后的停顿
    await randomDelay(200, 400);
    
    return {
      success: true,
      uuid: uuid,
      imagePath: filepath,
      imageBuffer: imageBuffer,
      base64: img
    };
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ 请求超时，模拟人为重试...');
    } else if (error.response) {
      console.log(`❌ 服务器响应错误: ${error.response.status}`);
    } else if (error.request) {
      console.log('❌ 网络连接失败，模拟人为检查网络...');
    } else {
      console.log(`❌ 请求失败: ${error.message}`);
    }
    
    // 模拟错误后的人为等待
    await randomDelay(1000, 2000);
    return null;
  }
}

/**
 * 带重试机制的获取（模拟人为重试）
 * @param {string} captchaUrl 
 * @param {string} saveDir 
 * @param {number} maxRetries 
 */
async function fetchCaptchaWithRetry(captchaUrl, saveDir, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    console.log(`\n📌 第 ${i + 1} 次尝试获取验证码...`);
    
    // 模拟人为重试前的等待（越来越长）
    if (i > 0) {
      const retryDelay = 2000 * i;
      console.log(`⏳ 等待 ${retryDelay/1000} 秒后重试...`);
      await randomDelay(retryDelay, retryDelay + 1000);
    }
    
    const result = await fetchAndSaveCaptcha(captchaUrl, saveDir);
    
    if (result && result.success) {
      return result;
    }
  }
  
  console.log('\n❌ 多次尝试后仍未获取到验证码');
  return null;
}

// 添加随机鼠标移动模拟（可选，需要 puppeteer 或 playwright）
// 这里提供一个简化的模拟函数
async function simulateHumanBehavior() {
  // 模拟随机的人为行为模式
  const patterns = [
    () => randomDelay(100, 300),  // 短暂思考
    () => randomDelay(800, 1200), // 正常反应时间
    () => randomDelay(1500, 2500) // 犹豫/慢速反应
  ];
  
  // 随机选择一个行为模式
  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
  await randomPattern();
}

// 使用示例
async function main() {
  const captchaUrl = 'http://omsbackend.jaspers.com.cn:16017/prod-api/oms/auth/code';
  const saveDir = './captcha_images';
  
  console.log('🤖 开始模拟人为操作获取验证码...\n');
  
  for (let index = 0; index < 20; index++) {
    // 模拟人打开网页后的自然停顿
    await simulateHumanBehavior();
    
    // 获取验证码（带重试）
    const result = await fetchCaptchaWithRetry(captchaUrl, saveDir, 20);
    
    if (result) {
        console.log('\n✨ 验证码获取完成！');
        console.log(`📁 文件路径: ${result.imagePath}`);
        console.log(`🆔 UUID: ${result.uuid}`);
        
        // 可选：如果需要识别验证码，可以在这里调用 OCR 或打码平台
        // 示例：识别验证码图片
        // const captchaCode = await recognizeCaptcha(result.imageBuffer);
        // console.log(`🔢 验证码内容: ${captchaCode}`);
    } else {
        console.log('\n💥 验证码获取失败');
    }
  }
}

// 运行
if (require.main === module) {
  main().catch(console.error);
}

// 导出函数供其他模块使用
module.exports = {
  fetchAndSaveCaptcha,
  fetchCaptchaWithRetry,
  randomDelay,
  simulateHumanBehavior
};