/**
 * 电商销量数据自动同步脚本 (Node.js 版)
 * 功能：将本地店铺销量数据文件夹中的文件自动上传到 Coze
 * 适用：Windows 定时任务，每天下午5点后执行
 * 运行：node auto_upload.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');

// ============== 配置区域（请根据实际情况修改） ==============

// 本地数据文件夹路径（修改为你实际的文件夹路径）
const DATA_FOLDER = 'C:\\Users\\Administrator\\Downloads\\node\\tiktok_data';

// Coze 访问令牌（PAT 或 SAT）
const COZE_TOKEN = 'sat_sHzzKjjNGgKL9eYycZWJ1e5ry0pNNfvlA3TkMtnFDZVMhIqq2hT07FIYcHM2TK86';

// Coze API 地址
const COZE_API_BASE = 'https://api.coze.cn';

// 支持的文件类型
const SUPPORTED_EXTENSIONS = new Set([
    '.xlsx', '.xls', '.csv', '.json', '.txt', '.pdf',
    '.doc', '.docx', '.zip', '.rar', '.7z'
]);

// ============== 配置区域结束 ==============

const SCRIPT_DIR = __dirname;
const TRACK_FILE = path.join(SCRIPT_DIR, '.upload_history.json');
const LOG_FILE = path.join(SCRIPT_DIR, 'upload.log');

// ============== 日志 ==============

function log(level, message) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const line = `${timestamp} [${level}] ${message}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n', 'utf-8');
}

const logger = {
    info: (msg) => log('INFO', msg),
    error: (msg) => log('ERROR', msg),
    debug: (msg) => log('DEBUG', msg),
};

// ============== 工具函数 ==============

function loadHistory() {
    try {
        if (fs.existsSync(TRACK_FILE)) {
            return JSON.parse(fs.readFileSync(TRACK_FILE, 'utf-8'));
        }
    } catch (e) {
        // 损坏了就重置
    }
    return {};
}

function saveHistory(history) {
    fs.writeFileSync(TRACK_FILE, JSON.stringify(history, null, 2), 'utf-8');
}

function fileHash(filepath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filepath);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 构造 multipart/form-data 请求体
 * 纯 Node.js 实现，不依赖第三方库
 */
function buildMultipart(fieldName, fileName, fileBuffer) {
    const boundary = '----FormBoundary' + crypto.randomBytes(8).toString('hex');
    const CRLF = '\r\n';

    const header = Buffer.from(
        `--${boundary}${CRLF}` +
        `Content-Disposition: form-data; name="${fieldName}"; filename="${fileName}"${CRLF}` +
        `Content-Type: application/octet-stream${CRLF}${CRLF}`
    );

    const footer = Buffer.from(`${CRLF}--${boundary}--${CRLF}`);

    const body = Buffer.concat([header, fileBuffer, footer]);

    return {
        contentType: `multipart/form-data; boundary=${boundary}`,
        body,
    };
}

// ============== 上传 ==============

async function uploadFile(filepath) {
    const fileName = path.basename(filepath);
    const stat = fs.statSync(filepath);

    if (stat.size > 500 * 1024 * 1024) {
        return { success: false, error: `文件过大: ${(stat.size / 1024 / 1024).toFixed(1)}MB` };
    }

    const fileBuffer = fs.readFileSync(filepath);
    const { contentType, body } = buildMultipart('file', fileName, fileBuffer);

    try {
        const response = await fetch(`${COZE_API_BASE}/v1/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COZE_TOKEN}`,
                'Content-Type': contentType,
            },
            body: body,
        });

        if (!response.ok) {
            const text = await response.text();
            return { success: false, error: `HTTP ${response.status}: ${text.substring(0, 200)}` };
        }

        const result = await response.json();
        if (result.code === 0) {
            return { success: true, fileId: result.data.id };
        } else {
            return { success: false, error: `API 错误: ${result.msg || '未知错误'}` };
        }
    } catch (err) {
        return { success: false, error: `请求异常: ${err.message}` };
    }
}

// ============== 递归扫描文件夹 ==============

function walkDir(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // 跳过隐藏文件和临时文件
        if (entry.name.startsWith('.') || entry.name.startsWith('~')) continue;

        if (entry.isDirectory()) {
            results.push(...walkDir(fullPath));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (SUPPORTED_EXTENSIONS.has(ext)) {
                results.push(fullPath);
            }
        }
    }

    return results;
}

// ============== 主流程 ==============

async function scanAndUpload() {
    if (!fs.existsSync(DATA_FOLDER)) {
        logger.error(`数据文件夹不存在: ${DATA_FOLDER}`);
        logger.error('请修改脚本中的 DATA_FOLDER 为你的实际数据文件夹路径');
        return false;
    }

    const history = loadHistory();
    const newHistory = {};
    let uploaded = 0, skipped = 0, failed = 0;

    logger.info(`开始扫描文件夹: ${DATA_FOLDER}`);
    logger.info('='.repeat(50));

    const files = walkDir(DATA_FOLDER);

    for (const filepath of files) {
        const currentHash = await fileHash(filepath);
        const relativePath = path.relative(DATA_FOLDER, filepath);

        // 检查是否已上传且未变化
        if (history[filepath] && history[filepath].hash === currentHash) {
            skipped++;
            newHistory[filepath] = history[filepath];
            continue;
        }

        logger.info(`正在上传: ${relativePath}`);
        const result = await uploadFile(filepath);

        if (result.success) {
            uploaded++;
            newHistory[filepath] = {
                hash: currentHash,
                fileId: result.fileId,
                filename: path.basename(filepath),
                uploadTime: new Date().toISOString(),
                relativePath,
            };
            logger.info(`  ✓ 成功 (file_id: ${result.fileId})`);
        } else {
            failed++;
            newHistory[filepath] = history[filepath] || {};
            logger.error(`  ✗ 失败: ${result.error}`);
        }

        // 避免请求过快（Coze API 限流 10 QPS）
        await sleep(150);
    }

    saveHistory(newHistory);

    logger.info('='.repeat(50));
    logger.info(`同步完成: 上传 ${uploaded} 个, 跳过 ${skipped} 个, 失败 ${failed} 个`);

    return true;
}

function cleanOldHistory(days = 90) {
    const history = loadHistory();
    const cutoff = Date.now() - days * 86400000;
    let cleaned = 0;

    for (const [filepath, record] of Object.entries(history)) {
        if (record.uploadTime && new Date(record.uploadTime).getTime() < cutoff) {
            delete history[filepath];
            cleaned++;
        }
    }

    if (cleaned > 0) {
        saveHistory(history);
        logger.info(`已清理 ${cleaned} 条过期历史记录`);
    }
}

// ============== 入口 ==============

async function main() {
    logger.info(`===== 电商销量数据同步 ${new Date().toLocaleString('zh-CN')} =====`);

    // 检查配置
    if (DATA_FOLDER === 'C:\\Users\\你的用户名\\Documents\\电商销量数据') {
        logger.error('请先修改脚本中的 DATA_FOLDER 为你的实际数据文件夹路径！');
        process.exit(1);
    }

    const success = await scanAndUpload();

    // 每周一清理过期记录
    if (new Date().getDay() === 1) {
        cleanOldHistory();
    }

    process.exit(success ? 0 : 1);
}

main().catch((err) => {
    logger.error(`未捕获异常: ${err.message}`);
    process.exit(1);
});