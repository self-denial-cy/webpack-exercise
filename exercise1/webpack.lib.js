// webpack 打包库和组件
// webpack 除了可以用来打包应用，也可以用来打包 js 库
// 实现库的打包：
// 1.需要打包压缩版和非压缩版本
// 2.支持 AMD|CJS|ESM 模块引入
// 支持 ESM（ES module）：import lib from 'lib';
// 支持 CJS（CommonJS）：const lib = require('lib');
// 支持 AMD：require(['lib'], function (lib) {});
// 支持直接通过 script 引入

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: {
        'lib': './lib/index.js',
        'lib.min': './lib/index.js'
    },
    output: {
        filename: '[name].js',
        library: 'lib',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/
            })
        ]
    }
};
