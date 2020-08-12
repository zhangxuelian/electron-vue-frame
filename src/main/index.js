'use strict'

const { app, BrowserWindow } = require('electron');
const path = require('path');

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