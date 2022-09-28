const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 多页面打包通用方案
// 动态获取 entry 和设置 html-webpack-plugin 数量
// 使用 glob.sync

// 使用 sourcemap（通过 sourcemap 可以定位到源代码）
// 一般情况下：开发环境开启便于调试，线上环境关闭（线上排查问题的时候可以将 sourcemap 上传到错误监控系统）

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(__dirname, 'src/mpa/*/index.js'));
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index];
        const chunk = entryFile.match(/src\/mpa\/(.*)\/index\.js/)[1];
        entry[chunk] = entryFile;
        htmlWebpackPlugins.push(new HtmlWebpackPlugin({
            template: path.join(__dirname, `src/mpa/${chunk}/index.html`),
            filename: `${chunk}.html`,
            favicon: path.join(__dirname, 'src/favicon.ico'),
            inject: true,
            chunks: [chunk],
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }));
    });

    return {entry, htmlWebpackPlugins};
}

const {entry, htmlWebpackPlugins} = setMPA();

module.exports = {
    entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
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
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            require('autoprefixer')({
                                browsers: [
                                    'last 2 version',
                                    '>1%',
                                    'ios 7'
                                ]
                            })
                        ]
                    }
                }]
            },
            {
                test: /.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            require('autoprefixer')({
                                browsers: [
                                    'last 2 version',
                                    '>1%',
                                    'ios 7'
                                ]
                            })
                        ]
                    }
                }, 'less-loader']
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: '[name]_[hash:8].[ext]'
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
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins)
};
