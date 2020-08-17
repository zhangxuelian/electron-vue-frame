'use strict'

const path = require('path');
const webpack = require('webpack');

let mainConfig = {
    entry: {
        main: path.join(__dirname, '../src/main/index.js')
    },
    //这个模块包含原生 C代码，所以要在运行的时候再获取，而不是被webpack打包到bundle中
    externals: ['ffi-napi'],
    node: {
        // true: 输入文件(打包前)的目录名 false: 输出文件(打包后)的目录名 (不设默认为'/')
        __dirname: process.env.NODE_ENV !== 'production',
        // true: 输入文件(打包前)的文件名 false: 输出文件(打包后)的文件名 (不设默认为'index.js')
        __filename: process.env.NODE_ENV !== 'production'
    },
    output: {
        filename: '[name].js',
        // 入口起点的返回值将分配给 module.exports 对象,若不设，externals的对象无法使用
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist/electron')
    },
    plugins: [
        // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        // 自动解析，引入文件不需要加以下后缀
        extensions: ['.js', '.json']
    },
    // https://www.webpackjs.com/configuration/target/
    target: 'electron-main'
}

if (process.env.NODE_ENV === 'production') {
    mainConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    )
}

module.exports = mainConfig;