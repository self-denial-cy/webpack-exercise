const fs = require('fs');
const path = require('path');

module.exports = function (source) {
    console.log(source);

    // 异步 loader 的处理
    const callback = this.async()

    // webpack 中默认开启 loader 缓存，使用以下方法可以关闭
    // loader 支持缓存的前提条件：loader 的结果在相同的输入下有确定的输出（且该 loader 不能存在依赖）
    this.cacheable(false);

    fs.readFile(path.join(__dirname, './async.txt'), 'utf-8', (err, content) => {
        if (err) {
            callback(err);
        }
        callback(null, content);
    });
};
