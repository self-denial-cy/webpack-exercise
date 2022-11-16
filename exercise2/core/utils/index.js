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

exports.getSourceCode = function (chunk) {
    const {name, entryModule, modules} = chunk;
    return `
        (() => {
            var __webpack_modules__ = {
                ${modules.map(module => {
                    return `
                        '${module.id}': (module, exports, __webpack_require__) => {
                            ${module._source}
                        }
                    `;
                }).join(',')}
            };
            
            var __webpack_module_cache__ = {};
            
            function __webpack_require__(moduleId) {
                var cacheModule = __webpack_module_cache__[moduleId];
                if (cacheModule !== undefined) {
                    return cacheModule.exports;
                }
                var module = (__webpack_module_cache__[moduleId] = {
                    exports: {}
                });
                __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
                return module.exports;
            }
            
            (() => {
                ${entryModule._source}
            })();
        })();
    `;
};
