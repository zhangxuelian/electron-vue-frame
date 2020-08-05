'use strict'

const path = require('path');
const electron = require('electron');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const mainConfig = require('./webpack.main.config.js');
const rendererConfig = require('./webpack.renderer.config.js');

var runner = {
    startRenderer: function () {
        var promise = new Promise((resolve, reject) => {
            var compiler = webpack(rendererConfig);
            compiler.run((err, stats) => {
                if (err || stats.hasErrors()) {
                    var info = stats.toJson();
                    console.error(info.errors);
                }
                console.log('startRenderer');
                resolve('startRenderer');
            });
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