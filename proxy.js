// test-proxy.js
const http = require('http');
const https = require('https');

function testProxy(port) {
    console.log(`\n测试端口 ${port}...`);
    
    const req = http.request({
        host: '127.0.0.1',
        port: port,
        path: '/',
        method: 'CONNECT',
        timeout: 3000
    });
    
    req.on('connect', (res, socket) => {
        console.log(`✅ 端口 ${port} 代理可用`);
        socket.destroy();
        process.exit(0);
    });
    
    req.on('error', (err) => {
        console.log(`❌ 端口 ${port} 不可用: ${err.code}`);
    });
    
    req.on('timeout', () => {
        console.log(`⏱️ 端口 ${port} 超时`);
        req.destroy();
    });
    
    req.end();
}

// 测试常见端口
const ports = [7890, 10809, 10808, 8888, 1080, 8118];
ports.forEach(testProxy);

// 30秒后如果没有找到，退出
setTimeout(() => {
    console.log('\n⚠️ 未找到可用的代理端口，请检查代理软件是否运行');
    process.exit(1);
}, 30000);