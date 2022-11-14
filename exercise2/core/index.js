const webpack = require('./webpack.js');
const config = require('../example/webpack.config.js');

const compiler = webpack(config);

// 调用 compiler run 方法进行打包
compiler.run((err, stats) => {
    if (err) {
        console.log(err);
    }
});
