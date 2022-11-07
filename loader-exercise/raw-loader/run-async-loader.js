const {runLoaders} = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders({
    resource: path.join(__dirname, './src/index.js'),
    loaders: [
        {
            loader: path.join(__dirname, './src/async-loader.js')
        }
    ],
    context: {
        minimize: true
    },
    readResource: fs.readFile.bind(fs)
}, (err, result) => {
    err ? console.log(err) : console.log(result);
});
