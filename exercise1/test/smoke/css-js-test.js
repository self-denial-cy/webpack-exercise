const glob = require('glob-all');

describe('Checking generated css and js files', () => {
    it('should generate css and js files', (done) => {
        const files = glob.sync([
            './dist/css/*.css',
            './dist/js/*.js'
        ]);

        if (files.length) {
            done();
        } else {
            throw new Error('no css and js files generated');
        }
    });
});
