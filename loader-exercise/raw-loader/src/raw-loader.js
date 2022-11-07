const loaderUtils = require('loader-utils');

module.exports = function (source) {
    // loader 的参数获取
    const {param} = loaderUtils.getOptions(this);

    console.log(param);

    const json = JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

    // return json;

    // 同步 loader 的异常处理（直接 throw、this.callback）
    // throw new Error('Error');
    // this.callback(new Error('Error'));
    this.callback(null, json, 2, 3, 4); // 可以回传多个值
};
