const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
    timeout: 10000
});

// 切换 process 运行目录
process.chdir(path.join(__dirname, '../../../exercise1'));
// console.log(process.cwd());

rimraf('./dist', () => {
    const webpackConfig = require('../../webpack.prod');
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.log(err);
            process.exit(2);
        }

        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false
        }));

        console.log('Start run test...');

        mocha.addFile(path.join(__dirname, 'html-test.js'));
        mocha.addFile(path.join(__dirname, 'css-js-test.js'));

        mocha.run();
    });
});
