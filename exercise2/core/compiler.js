const {SyncHook} = require('tapable');
const {toUnixPath} = require('./utils/index.js');
const path = require('path');

// Compiler 类进行核心编译实现
class Compiler {
    constructor(options) {
        this.options = options;

        this.rootPath = this.options.context || toUnixPath(process.cwd());

        // 创建内部 hooks
        this.hooks = {
            // 开始编译时的钩子
            run: new SyncHook(),
            // 输出 assets 到 output 目录之前执行（写入文件之前）
            emit: new SyncHook(),
            // 在 compilation 完成时执行，编译全部完成执行
            done: new SyncHook()
        };
    }

    // run 方法启动编译
    run(callback) {
        // 当调用 run 方法时，触发开始编译时的钩子，进而调用监听该钩子的插件
        this.hooks.run.call();

        // 获取 entry
        const entry = this.getEntry();
    }

    // 获取 entry
    getEntry() {
        let entry = Object.create(null);
        // 结构重命名
        const {entry: optionsEntry} = this.options;
        if (typeof optionsEntry === 'string') {
            entry['main'] = optionsEntry;
        } else {
            entry = optionsEntry;
        }

        // 将 entry 转换成绝对路径
        Object.keys(entry).forEach(key => {
            const val = entry[key];
            if (!path.isAbsolute(val)) {
                // 转换为绝对路径的同时统一路径分隔符为 /
                entry[key] = toUnixPath(path.join(this.rootPath, val));
            }
        });

        return entry;
    }
}


module.exports = Compiler;
