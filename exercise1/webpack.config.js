const path = require('path');

module.exports = {
    entry: {
        bundle: './src/index.js',
        main: './src/entry.js'
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
            }
        ]
    }
};
