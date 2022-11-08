const JSZip = require('jszip');
const RawSource = require('webpack-sources').RawSource;

const zip = new JSZip();

class ZipPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            console.log(compilation.assets);
            for (const key in compilation.assets) {
                const source = compilation.assets[key].source();
                console.log(source);
                zip.file(key, source);
            }
            zip.generateAsync({
                type: 'nodebuffer'
            }).then((content) => {
                console.log(content);
                const outputPath = `${this.options.zipName}.zip`;
                compilation.assets[outputPath] = new RawSource(content);
                // 不调用 callback 是不会生成文件的
                callback();
            });
        });
    }
}

module.exports = ZipPlugin;
