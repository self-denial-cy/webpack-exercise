const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        library: ['react', 'react-dom']
    },
    output: {
        filename: '[name].dll.js',
        path: path.join(__dirname, './dll'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(__dirname, './dll/[name].json')
        })
    ]
};
