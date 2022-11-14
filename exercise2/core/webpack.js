const Compiler = require('./compiler');

function webpack(options) {
    // step1：初始化参数，根据配置文件和 shell 参数合并参数
    // 合并参数，得到合并后的参数
    const mergedOptions = _mergeOptions(options);

    // step2：创建 compiler 对象
    const compiler = new Compiler(mergedOptions);

    // step3：加载插件
    _loadPlugins(options.plugins, compiler);

    return compiler;
}

// 合并参数方法
function _mergeOptions(options) {
    console.log(process.argv);
    const shellOptions = process.argv.slice(2).reduce((option, argv) => {
        // argv -> --mode=production
        const [key, val] = argv.split('=');
        if (key && val) {
            const parseKey = key.slice(2);
            option[parseKey] = val;
        }
        return option;
    }, {});
    return {...options, ...shellOptions};
}

// 加载插件函数
function _loadPlugins(plugins, compiler) {
    if (plugins && Array.isArray(plugins)) {
        plugins.forEach(plugin => {
            plugin.apply(compiler);
        });
    }
}

module.exports = webpack;
