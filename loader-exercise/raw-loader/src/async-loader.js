const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function (source) {
    console.log(source);

    console.log(this);

    // 异步 loader 的处理
    const callback = this.async();

    // webpack 中默认开启 loader 缓存，使用以下方法可以关闭
    // loader 支持缓存的前提条件：loader 的结果在相同的输入下有确定的输出（且该 loader 不能存在依赖）
    this.cacheable(false);

    // loader 进行文件输出
    const url = loaderUtils.interpolateName(this, '[contenthash].[ext]', {
        content: source
    });
    console.log(url);
    // emitFile 方法只有当 loader 运行在 webpack 环境中时才可用
    // this.emitFile(url, source);

    fs.readFile(path.join(__dirname, './async.txt'), 'utf-8', (err, content) => {
        if (err) {
            callback(err);
        }
        callback(null, content);
    });
};
