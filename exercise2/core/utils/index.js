const fs = require('fs');

/**
 * 统一路径分隔符，主要是为了后续生成模块 ID 方便
 */
exports.toUnixPath = function (path) {
    return path.replace(/\\/g, '/');
};

exports.tryExtensions = function (modulePath, extensions, originModulePath, moduleContext) {
    // 优先尝试不需要扩展名，防止用户已经传入了后缀的情况
    extensions.unshift('');
    for (const extension of extensions) {
        if (fs.existsSync(modulePath + extension)) {
            return modulePath + extension;
        }
    }

    // 未匹配对应文件
    throw new Error(`No Module, Error: Can't resolve ${originModulePath} in ${moduleContext}`);
};
