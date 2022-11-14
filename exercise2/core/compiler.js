const {SyncHook} = require('tapable');
const {toUnixPath} = require('./utils/index.js');
const path = require('path');
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

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

        // moduleCode 为 loader 处理后的代码
        this.moduleCode = source;

        // 2.调用 loader 进行处理
        this.handleLoader(modulePath);

        // 3.进行模块编译，获得最终的 module 对象
        const module = this.handleWebpackCompiler(moduleName, modulePath);

        return module;
    }

    // 进行模块编译
    handleWebpackCompiler(moduleName, modulePath) {
        // 将当前模块相对于项目启动根目录计算出相对路径，作为模块 ID
        const moduleId = './' + path.posix.relative(this.rootPath, modulePath);
        // 创建模块对象
        const module = {
            id: moduleId,
            dependencies: new Set(), // 该模块所依赖模块的绝对路径地址
            name: [moduleName] // 该模块所属的入口文件
        };
        // 调用 @babel/parser 将代码解析为 AST
        const ast = parser.parse(this.moduleCode, {
            sourceType: 'module'
        });
        // 深度优先，遍历 ast
        traverse(ast, {
            CallExpression: ({node}) => {
                if (node.callee.name === 'require') {
                    // 获取源代码中引入模块的相对路径
                    const requirePath = node.arguments[0].value;
                    // 获取引入模块的绝对路径
                    const moduleDirName = path.posix.dirname(modulePath);
                    const absolutePath = tryExtensions(
                        path.posix.join(moduleDirName, requirePath),
                        this.options.resolve.extensions,
                        requirePath,
                        moduleDirName
                    );
                    // 生成 moduleId —— 基于根路径的模块 ID
                    const moduleId = './' + path.posix.relative(this.rootPath, absolutePath);
                    // 修改源代码中的 require 变成 __webpack_require__ 语句
                    node.callee = t.identifier('__webpack_require__');
                    // 修改源代码中 require 语句引入的模块，全部修改为基于根路径的引入路径
                    node.arguments = [t.stringLiteral(moduleId)];
                    // 当前模块的 dependencies
                    module.dependencies.add(moduleId);
                }
            }
        });
        // 遍历结束根据 AST 生成新的代码
        const {code} = generator(ast);
        module._source = code;
        return module;
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
