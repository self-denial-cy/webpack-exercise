const path = require('path');

process.chdir(path.join(__dirname, '../../exercise1'));

describe('webpack test case', () => {
    require('./unit/webpack-prod-test');
});
