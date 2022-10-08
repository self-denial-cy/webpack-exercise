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
// 原理：利用 ES6 模块的特点：1.只能作为模块顶层的语句出现；2.import 的模块名只能是字符串常量；3.import binding 是 immutable 的
// DCE（dead code elimination）：代码不会被执行，不可到达|代码执行的结果不会被用到|代码只会影响死变量（只写不读）

// Scope Hoisting
// 现象：构建后的代码中存在大量闭包代码
// 导致问题：1.大量函数闭包包括代码，导致体积增大（模块越多越明显）；2.运行代码时创建的函数作用域变多，内存开销变大
// 模块转换分析：1.被 webpack 转换后的模块会带上一层包裹；2.import 会被转换成 __webpack_require__、export 会被转换成 __webpack_exports__
// 进一步分析 webpack 的模块机制：
// 1.打包出来的是一个 IIFE（匿名闭包）
// 2.modules 是一个数组，每一项是一个模块初始化函数
// 3.__webpack_require__ 用来加载模块，返回 module.exports
// 4.通过 __webpack_require__(0) 启动（模块 0 一般是入口文件）
// Scope Hoisting（与 tree shaking 一样都是借鉴自 rollup）
// 原理：将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
// 对比：通过 Scope Hoisting 可以减少函数声明代码和内存开销
// 使用：webpack mode 为 production 默认开启（必须是 ES6 语法，CJS 不支持）

// 代码分割和动态 import
// 意义：对于大型 Web 应用来讲，将所有代码都放在一个文件中显然是不够有效的，特别是当某些代码块是在某些特殊的时候才会被使用到。webpack 有一个功能就是将代码库分割成 chunks，当代码运行到需要它们的时候再进行加载
// 适用场景：1.抽离相同代码到一个共享块；2.脚本懒加载，使得初始下载的代码更小
// 懒加载 JS 脚本的方式：1.CommonJS：require.ensure；2.ES6：动态 import（目前还没有原生支持，需要 babel 转换（@babel/plugin-syntax-dynamic-import））

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
                use: [
                    'babel-loader',
                    // 开启 eslint
                    // 'eslint-loader'
                ]
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
