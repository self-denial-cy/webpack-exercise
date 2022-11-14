/**
 * 统一路径分隔符，主要是为了后续生成模块 ID 方便
 */
exports.toUnixPath = function (path) {
    return path.replace(/\\/g, '/');
}
