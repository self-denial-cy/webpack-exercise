const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 文件指纹：打包后输出的文件名的后缀；
// 1.用于版本管理
// 2.对于没有变更的文件可以使用浏览器缓存，可以加快访问速度

// 文件指纹类别
// 1.hash 和整个项目的构建相关，只要项目文件有变更，整个项目构建的 hash 值就会改变
// 2.chunkhash 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值
// 3.contenthash 根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

module.exports = {
    entry: {
        bundle1: './src/entry1.js',
        bundle2: './src/entry2.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        // js 文件指纹建议使用 chunkhash
        filename: 'js/[name]_[chunkhash:8].js'
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
                // style-loader 与 MiniCssExtractPlugin.loader 的功能互斥，不能同时使用
                // 前者将 css 代码通过 style 标签嵌入到 head 中
                // 后者将 css 代码单独抽离出文件
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            // 针对文件资源的文件指纹设置的占位符：[ext] 资源后缀名 [name] 文件名称 [path] 文件相对路径 [folder] 文件所在文件夹 [contenthash] 文件内容hash（md5生成）
            // [hash] 文件内容hash（md5生成） [emoji] 一个随机的指代文件内容的 emoji
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            // 图片文件指纹推荐使用 hash
                            name: 'imgs/[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[contenthash:8].css'
        })
    ]
};
