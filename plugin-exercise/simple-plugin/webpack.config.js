const path = require('path');
const SimplePlugin = require('./plugin.js');
const ZipPlugin = require('./zip-plugin.js');

module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    mode: 'none',
    plugins: [
        new SimplePlugin({
            tips: 'this is a simple plugin'
        }),
        new ZipPlugin({})
    ]
};
