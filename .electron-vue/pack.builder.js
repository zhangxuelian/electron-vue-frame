
'use strict'

process.env.NODE_ENV = 'production';

const del = require('del');
const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');
const webpack = require('webpack');

var builder = {
    /**
     * 根据webpack配置进行打包
     */
    pack(config) {
        return new Promise((resolve, reject) => {
            // 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.
            config.mode = 'production';
            webpack(config, (err, stats) => {
                if (err) {
                    reject(err.stack || err);
                } else if (stats.hasErrors()) {
                    reject(stats.toString({
                        chunks: false,
                        colors: true
                    }));
                } else {
                    resolve(stats.toString({
                        chunk: false,
                        colors: true
                    }));
                }
            });
        });
    },
    /**
     * 执行构建打包
     */
    run() {
        var self = this;
        // 删除构建
        del.sync(['build/*', '!build/icons']);
        // 打包主进程
        self.pack(mainConfig).then(ret => {
            console.log(ret);
            // 打包渲染进程
            self.pack(rendererConfig).then(ret => {
                console.log(ret);
                process.exit();
            }, err => {
                console.log(err);
                process.exit(1);
            });
        }, err => {
            console.log(err);
            process.exit(1);
        });

    }
};

builder.run();