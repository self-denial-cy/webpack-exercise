class Plugin {
    apply(compiler) {
        // 注册同步钩子
        compiler.hooks.run.tap('Plugin', () => {
            // console.log('Plugin');
        });
    }
}

module.exports = Plugin;
