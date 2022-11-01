const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer')();
const glob = require('glob');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');

// 体积分析
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

// 速度分析
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();

const TerserPlugin = require('terser-webpack-plugin');

// 启用缓存提升二次构建速度（babel-loader 开启缓存、terser-webpack-plugin 开启缓存、cache-loader 或者 hard-source-webpack-plugin）
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// 文件指纹：打包后输出的文件名的后缀；
// 1.用于版本管理
// 2.对于没有变更的文件可以使用浏览器缓存，可以加快访问速度

// 文件指纹类别
// 1.hash 和整个项目的构建相关，只要项目文件有变更，整个项目构建的 hash 值就会改变
// 2.chunkhash 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值
// 3.contenthash 根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

// 代码压缩
// js 压缩：webpack 内置了 uglifyjs-webpack-plugin（默认就会对 js 文件进行压缩）
// css 压缩：使用 optimize-css-assets-webpack-plugin 同时使用 cssnano
// html 压缩：使用 html-webpack-plugin，设置压缩参数

// 自动清理构建目录产物
// 通过 npm scripts 清理构建目录 rm -rf ./dist && webpack | rimraf ./dist && webpack（暴力，不够优雅）
// 使用 clean-webpack-plugin 默认会删除 output 指定的输出目录

// PostCSS 插件 autoprefixer 自动补齐 CSS3 前缀（因为 CSS3 尚未兼容各大浏览器）（根据 Can I Use 规则补齐前缀，最新的 autoprefixer 建议将 browserslist 配置在 package.json 或 .browserslistrc 文件中）
// IE（Trident -ms） 火狐（Geko -moz） 谷歌（Webkit -webkit） Opera（Presto -o）

// 移动端CSS px 自动转换为 rem（使用 px2rem-loader）
// 随着移动设备的流行，各种分辨率的机型层出不穷，对页面适配兼容的要求较高
// CSS 媒体查询实现响应式布局（缺陷：需要写多套适配样式代码）
// CSS3 提出 rem 的概念：font-size of the root element（rem 是相对单位，px 是绝对单位）
// 页面渲染时动态计算根元素的 font-size 值（使用 lib-flexible 库）

// 静态资源内联
// 代码层面：页面框架的初始化脚本、上报相关打点、css 内联避免页面闪动
// 请求层面：减少 HTTP 网络请求数（小图片或者字体内联 url-loader）
// HTML 和 JS 内联
// raw-loader 内联 html：${ require('raw-loader!./meta.html') }
// raw-loader 内联 JS：<script>${ require('raw-loader!babel-loader!../node_modules/lib-flexible') }</script>
// CSS 内联
// 方案一：借助 style-loader
// 方案二：html-inline-css-webpack-plugin

// 防止 webpack 配置文件不在项目根目录下的情况
const rootDir = process.cwd();

const PATHS = {
    src: path.join(rootDir, './src')
};

module.exports = smp.wrap({
    entry: {
        bundle1: './src/entry1.js',
        bundle2: './src/entry2.js'
    },
    output: {
        path: path.join(rootDir, 'dist'),
        // js 文件指纹建议使用 chunkhash
        filename: 'js/[name]_[chunkhash:8].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /.js$/,
                use: [{
                    // 多进程/多实例构建（适合模块数量多的情况下使用，否则没啥加速效果）
                    loader: 'thread-loader',
                    options: {
                        workers: 1
                    }
                }, {
                    loader: 'babel-loader',
                    options: {
                        exclude: 'node_modules', // 不对 node_modules 中的第三方包进行 babel 处理（基于第三方包质量高，发布到 npm 上时就已经 babel 处理过的前提）
                        cacheDirectory: true // babel-loader 开启缓存
                    }
                }]
            },
            {
                test: /.css$/,
                // style-loader 与 MiniCssExtractPlugin.loader 的功能互斥，不能同时使用
                // 前者将 css 代码通过 style 标签嵌入到 head 中
                // 后者将 css 代码单独抽离出文件
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'px2rem-loader',
                    options: {
                        // rem 与 px 转换比例 1rem = 37.5px
                        remUnit: 37.5,
                        // 转换后得到的 rem 保留小数点后 8 位
                        remPrecesion: 8
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [autoprefixer]
                    }
                }]
            },
            {
                test: /.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'px2rem-loader',
                    options: {
                        // rem 与 px 转换比例 1rem = 37.5px
                        remUnit: 37.5,
                        // 转换后得到的 rem 保留小数点后 8 位
                        remPrecesion: 8
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [autoprefixer]
                    }
                }, 'less-loader']
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
        }),
        new PurgecssWebpackPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new HtmlWebpackPlugin({
            template: path.join(rootDir, 'src/index.html'),
            filename: 'index.html',
            favicon: path.join(rootDir, 'src/favicon.ico'),
            inject: true,
            chunks: ['bundle1', 'bundle2'],
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
        new CleanWebpackPlugin(),
        // 日志优化
        new FriendlyErrorsWebpackPlugin(),
        // 捕获构建异常并中断进程（一般用于 webpack 参与 CI/CD 流的情况）
        function () {
            // 这里的 this 指代 compiler 对象，compiler 在每次构建结束后都会触发 done 这个 hook
            // console.log(this)
            this.hooks.done.tap('done', (stats) => {
                // 根据 errors 判断当前构建是否有异常
                // console.log(stats.compilation.errors);
                // process.exit 主动处理构建异常
                // process.exit(1);
                console.log('build complete');
            });
        },
        // 先关闭，防止 GitHub Actions 得不到 0 的进程退出代码
        // new BundleAnalyzerPlugin({
        //     openAnalyzer: false // 关闭自动打开浏览器行为
        // }),
        new HardSourceWebpackPlugin() // hard-source-webpack-plugin 缓存
        /*new webpack.DllReferencePlugin({
            manifest: path.join(__dirname, './dll/library.json')
        })*/
    ],
    // 日志优化
    stats: 'none',
    optimization: {
        minimizer: [
            // 开启多进程并行压缩代码（量多情况下效果明显）
            new TerserPlugin({
                parallel: true,
                cache: true // terser-webpack-plugin 开启缓存
            })
        ]
    },
    // 性能优化（缩小文件搜索范围）
    resolve: {
        // 减少模块搜索层级（webpack 在寻找第三方模块的时候，会先从当前项目中寻找，找不到再向上追溯，直至到全局中寻找）
        modules: [path.join(__dirname, 'node_modules')],
        // 指定第三方模块 package.json 中的 main 字段是其入口文件
        mainFields: ['main'],
        // 优化对无后缀文件的链路寻找（import './a' = import './a.js'）
        // 该配置项不宜过多，否则优化效果反而不佳
        extensions: ['.js'],
        // 直接指定引用路径（优先级高）
        alias: {
            'react': path.resolve(__dirname, './node_modules/react/index.js'),
            'react-dom/client': path.resolve(__dirname, './node_modules/react-dom/client.js')
        }
    }
});
