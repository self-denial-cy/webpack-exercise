const path = require('path');
const Plugin = require('../plugins/plugin.js');

module.exports = {
    entry: {
        app1: path.join(__dirname, './src/entry1.js'),
        app2: path.join(__dirname, './src/entry2.js')
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js'
    },
    plugins: [
        new Plugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    path.join(__dirname, '../loaders/loader.js')
                ]
            }
        ]
    }
};
