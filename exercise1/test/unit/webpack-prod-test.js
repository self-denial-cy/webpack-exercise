const assert = require('assert');

describe('webpack.prod.js test case', () => {
    const prodConfig = require('../../webpack.prod');
    console.log(prodConfig);

    it('entry', () => {
        assert.equal(prodConfig.entry.bundle1, './src/entry1.js');
        assert.equal(prodConfig.entry.bundle2, './src/entry2.js');
    });
});
