const {SyncHook} = require('tapable');
const {toUnixPath} = require('./utils/index.js');
const path = require('path');
const fs = require('fs');

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

        // 保存所有入口模块对象
        this.entries = new Set();

        // 保存所有依赖模块对象
        this.modules = new Set();

        // 保存所有代码块对象
        this.chunks = new Set();

        // 保存本次产出的文件对象
        this.assets = new Set();

        // 保存本次编译所有产出的文件名
        this.files = new Set();
    }

    // run 方法启动编译
    run(callback) {
        // 当调用 run 方法时，触发开始编译时的钩子，进而调用监听该钩子的插件
        this.hooks.run.call();

        // 获取 entry
        const entry = this.getEntry();

        // 开始编译
        this.buildEntryModule(entry);
    }

    // 从 entry 开始编译
    buildEntryModule(entry) {
        Object.keys(entry).forEach(key => {
            const val = entry[key];
            const result = this.buildModule(key, val);
            this.entries.add(result);
        });
    }

    // 模块编译方法
    buildModule(moduleName, modulePath) {
        // 1.读取文件原始代码
        let source = this.originSourceCode = fs.readFileSync(modulePath, 'utf-8');

        // moduleCode 为编译后的代码
        this.moduleCode = source;

        // 2.调用 loader 进行处理
        this.handleLoader(modulePath);
    }

    // 匹配 loader 进行处理
    handleLoader(modulePath) {
        const matchLoaders = [];
        // 1.获取所有传入的 loader 规则
        const rules = this.options.module.rules;
        rules.forEach(rule => {
            const testRule = rule.test;
            if (testRule.test(modulePath)) {
                if (rule.loader) {
                    // 考虑一条 rule 下仅配置一个 loader 的情况
                    matchLoaders.push(rule.loader);
                } else {
                    matchLoaders.push(...rule.use);
                }
            }
        });
        // 2.倒序执行 loader
        for (let i = matchLoaders.length - 1; i >= 0; i--) {
            // 目前 loader 仅支持 node_modules 中的包或指定绝对路径两种模式
            // require 引入对应 loader
            const loaderFn = require(matchLoaders[i]);
            // 通过 loader 同步处理上一个 loader 处理后的 moduleCode
            this.moduleCode = loaderFn(this.moduleCode);
        }
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
