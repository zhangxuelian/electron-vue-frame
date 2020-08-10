'use strict'

const path = require('path');
const { spawn } = require('child_process');
const electron = require('electron');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const mainConfig = require('./webpack.main.config.js');
const rendererConfig = require('./webpack.renderer.config.js');

var runner = {
    /**
     * electron 进程
     */
    electronProcess: null,
    /**
     * 是否重启
     */
    manualRestart: false,
    /**
     * 渲染进程(HMR: hot module replacement)
     */
    startRenderer() {
        var promise = new Promise((resolve, reject) => {
            // 设置该mode会将process.env.NODE_ENV 的值设为development,启用NamedChunksPlugin和NamedModulesPlugin
            rendererConfig.mode = 'development';
            // rendererConfig.target = 'web';

            // 配置并返回一个compiler对象
            var compiler = webpack(rendererConfig);

            // 执行打包，输出结果，热加载则不需要，相关模块将其结果保存在内存中
            // compiler.run();

            // 监听编译过程(webpack-dev-server)
            compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
                console.log('render process is compiling...');
                done();
            });
            // 编译完成
            compiler.hooks.done.tap('done', stats => {
                console.log('render process compiled done.');
            });

            // 创建服务
            var server = new WebpackDevServer(compiler, {
                // 指定一个虚拟路径来让devServer服务器提供内容
                contentBase: path.join(__dirname, "../"),
                // 在浏览器中打开
                // open: true,
                after() {
                    resolve();
                }
            });
            // 监听端口
            server.listen(8181);
        });
        return promise;
    },
    /**
     * 主进程
     */
    startMain() {
        var self = this;
        var promise = new Promise((resolve, reject) => {
            // 设置该mode会将process.env.NODE_ENV 的值设为development,启用NamedChunksPlugin和NamedModulesPlugin
            mainConfig.mode = 'development';

            // 配置并返回一个compiler对象
            var compiler = webpack(mainConfig);

            // 编译完成
            /* compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
                console.log('main process is compiling...');
                done();
            }); */
            compiler.hooks.done.tap('done', stats => {
                console.log('main process compiled done.');
            });

            compiler.watch({}, (err, stats) => {
                if (err) {
                    console.log(err)
                    return
                }

                if (self.electronProcess && self.electronProcess.kill) {
                    self.manualRestart = true;
                    process.kill(self.electronProcess.pid)
                    self.electronProcess = null;
                    self.startElectron();

                    setTimeout(() => {
                        self.manualRestart = false;
                    }, 5000)
                }

                resolve();
            });

        });
        return promise;
    },
    /**
     * 启动electron终端
     */
    startElectron() {
        var self = this;
        var args = [
            '--inspect=5858',
            path.join(__dirname, '../dist/electron/main.js')
        ];

        self.electronProcess = spawn(electron, args);

        self.electronProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        self.electronProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        self.electronProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (!self.manualRestart) process.exit();
        });
    },
    init() {
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