'use strict'

const { app, BrowserWindow, ipcMain } = require('electron');
const ffi = require("ffi-napi");
const path = require("path");

let mainWindow;

// 开发环境加载热重载的渲染进程，生产环境下加载打包好的入口文件（main进程的webpack配置下node.__dirname必须为false）
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:8181`
    : `file://${__dirname}/index.html`;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: '桌面应用程序',
        webPreferences: {
            // elecrton v5.0.0 以后该选项默认为false,需手动设为true
            nodeIntegration: true,
            // 设为false则禁用devtool开发者调试工具
            devTools: true
        }
    });
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(winURL);
});

var testdll = "";
if (process.env.NODE_ENV !== "development") {
    // 生产环境dll路径
    testdll = path.join(
        process.cwd(),
        "/resources/extraResources/test",
        "ZXLTest64.dll"
    );
} else {
    // 开发环境dll路径
    testdll = path.join(
        process.cwd(),
        "/extraResources/test",
        "ZXLTest64.dll"
    );
}
ipcMain.on('test-dll', (event, arg) => {
    // 查看xx.dll库的xxx.h文件，这里的ZXLSDK_Init为调用函数名，
    // 对应的数组第一个对象是返回对象，第二个对象为传参对象数组，result为调用dll的返回结果
    var ZXLTest64 = new ffi.Library(testdll, {
        ZXLSDK_Init: ["int", ["int"]],
    });
    var result = ZXLTest64.ZXLSDK_Init(666);
    event.reply('reply-test-dll', result);
});
