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

// 提取页面公共资源
// 1.基础库分离：思路（将 react react-dom 基础库包通过 cdn 引入，不打入 bundle 中）；方法（使用 html-webpack-externals-plugin）（使用好像有点问题，先暂时不用）
// 2.利用 SplitChunksPlugin 分离基础包|页面公共文件

// tree shaking（摇树优化）
// 概念：模块中可能有多个方法，只要其中的某个方法使用到了，则整个模块都会被打包到 bundle 中，tree shaking 就是只把使用到的方法打包到 bundle 中。没用到的方法会在 uglify 阶段被擦除掉
// 要求：必须是 ES6 的语法，CJS 的方式不支持（ES6 的语法支持静态分析）
// 使用：webpack 默认支持，production mode 的情况下默认开启

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
    ].concat(htmlWebpackPlugins),
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                vendors: {
                    test: /(react|react-dom)/,
                    priority: 2,
                    name: 'vendor'
                },
                commons: {
                    priority: 1,
                    name: 'common',
                    minChunks: 2
                }
            }
        }
    }
};
