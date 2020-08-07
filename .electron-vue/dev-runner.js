'use strict'

const path = require('path');
const electron = require('electron');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const mainConfig = require('./webpack.main.config.js');
const rendererConfig = require('./webpack.renderer.config.js');

var runner = {
    /**
     * 热加载渲染进程
     */
    startRenderer: function () {
        var promise = new Promise((resolve, reject) => {
            // 设置该mode会将process.env.NODE_ENV 的值设为development,启用NamedChunksPlugin和NamedModulesPlugin
            rendererConfig.mode = 'development';
            rendererConfig.target = 'web';

            // 配置并返回一个compiler对象
            var compiler = webpack(rendererConfig);

            // 执行打包，输出结果，热加载则不需要，相关模块将其结果保存在内存中
            // compiler.run(); 
            compiler.hooks.done.tap('done', stats => {
                console.log('render compiled done');
            });

            // 创建服务
            var server = new WebpackDevServer(compiler, {
                // 指定一个虚拟路径来让devServer服务器提供内容
                contentBase: path.join(__dirname, "../"),
                // 在浏览器中打开
                open: true
            });
            server.listen(8181);

        });
        return promise;
    },
    startMain: function () {
        var promise = new Promise((resolve, reject) => {
            resolve('startMain');
        });
        return promise;
    },
    startElectron: function () {
        var promise = new Promise((resolve, reject) => {
            resolve('startElectron')
        });
        return promise;
    },
    init: function () {
        var self = this;
        Promise.all([self.startRenderer(), self.startMain()])
            .then(() => {
                self.startElectron();
            })
            .catch(err => {
                console.error(err);
            });
    }
}

runner.init();