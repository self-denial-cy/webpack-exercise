const path = require('path');
const {HotModuleReplacementPlugin} = require('webpack');

module.exports = {
    // 文件监听是在发现源码发生变化时，自动重新构建出新的输出文件
    // 开启监听模式有两种方法：1.启动 webpack 命令时，带上 --watch 参数；2.配置 webpack.dev.js 中设置 watch:true
    // 唯一缺陷：新的构建输出必须手动重新加载（重新刷新浏览器等）
    watch: false,
    // 文件监听的原理分析：轮询判断文件的最后编辑时间是否变化（某个文件发生了变化，并不会立刻告知监听者，而是先缓存起来，等 aggregateTimeout 后统一告知）
    watchOptions: {
        // 默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored: /node_modules/,
        // 监听到变化发生后会等 300 ms 后再去重新构建，默认 300 ms
        aggregateTimeout: 300,
        // 判断文件是否发生变化是通过不停询问系统指定文件是否发生变化实现的，默认每秒询问 1000 次
        poll: 1000
    },
    entry: {
        bundle1: './src/entry1.js',
        bundle2: './src/entry2.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                // loader 调用顺序从后往前，先使用 css-loader 再使用 style-loader
                // css-loader 用于加载 css 文件，并且转换为 commonjs 对象
                // style-loader 将样式通过 style 标签插入到 head 中
                use: ['style-loader', 'css-loader']
            },
            {
                test: /.less$/,
                // less-loader 用于将 less 转换为 css
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                // use: 'file-loader'
                // url-loader 内部也使用了 file-loader，设置 limit 后，低于该阈值的文件则会被 base64
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 51200
                        }
                    }
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        // 除了 webpack 自带的 HotModuleReplacementPlugin 插件，还可以使用 webpack-dev-middleware 实现热更新
        // WDM 可以将 webpack 输出的文件传输给服务器，适用于更灵活的定制场景（有相应业务场景的时候可以研究下）
        // WDS 的功能类似封装好的 Express + WDM，开箱即用的同时缺少灵活的定制性
        new HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    }
};
