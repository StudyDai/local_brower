@echo off
chcp 65001 >nul
echo ============================================
echo   电商销量数据自动同步 - 安装定时任务
echo ============================================
echo.

:: 获取当前目录
set "SCRIPT_DIR=%~dp0"
set "NODE_SCRIPT=%SCRIPT_DIR%sendFileToCoze.js"

:: 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查脚本是否存在
if not exist "%NODE_SCRIPT%" (
    echo [错误] 找不到 sendFileToCoze.js 脚本
    echo 路径: %NODE_SCRIPT%
    pause
    exit /b 1
)

:: 创建定时任务
:: 任务名: CozeSalesDataSync
:: 触发时间: 每天 17:05
schtasks /create /tn "CozeSalesDataSync" /tr "node \"%NODE_SCRIPT%\"" /sc daily /st 17:05 /f

if errorlevel 1 (
    echo [错误] 创建定时任务失败，请尝试以管理员身份运行
    pause
    exit /b 1
)

echo.
echo [成功] 定时任务已创建！
echo.
echo   任务名称: CozeSalesDataSync
echo   执行时间: 每天 17:05
echo   执行脚本: %NODE_SCRIPT%
echo.
echo 注意事项:
echo   1. 请先修改 auto_upload.js 中的 DATA_FOLDER 为你的数据文件夹路径
echo   2. 无需安装任何 npm 依赖（纯 Node.js 内置模块）
echo   3. 查看日志: %SCRIPT_DIR%upload.log
echo   4. 删除定时任务: schtasks /delete /tn "CozeSalesDataSync" /f
echo.

:: 询问是否立即运行一次测试
set /p RUN_NOW="是否立即运行一次测试？(Y/N): "
if /i "%RUN_NOW%"=="Y" (
    echo.
    echo 正在执行测试...
    node "%NODE_SCRIPT%"
    echo.
    echo 测试完成，请检查上方输出和日志文件。
)

pause
