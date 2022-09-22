const path = require('path');

module.exports = {
    entry: {
        bundle1: './src/entry1.js',
        bundle2: './src/entry2.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'production',
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
                use: 'file-loader'
            }
        ]
    }
};
