const path = require('path');

module.exports = {
    entry: {
        bundle1: './src/entry1.js',
        bundle2: './src/entry2.js'
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
