class SimplePlugin {
    constructor(options) {
        // 通过插件的构造函数获取传递的参数
        this.options = options;

        // 插件的错误处理
        // 参数校验阶段可以直接 throw
        // throw new Error
        // 进入到 webpack 的 hooks 中时可以通过 compilation 上的 warnings 和 errors 收集
        // compilation.warnings.push('warning')...
    }

    // webpack 会调用 plugin 的 apply 方法
    apply(compiler) {
        console.log(compiler);
        console.log(this.options);
    }
}

// 插件扩展：插件的插件
// 插件自身也可以通过暴露 hooks 的方式进行自身扩展，比如说 html-webpack-plugin（有空再看）
// html-webpack-plugin-alter-chunks  Sync
// html-webpack-plugin-before-html-generation  Async
// ...

module.exports = SimplePlugin;
