const JSZip = require('jszip');

const zip = new JSZip();

class ZipPlugin {
    constructor(options) {
        this.options = options;
    }
}

module.exports = ZipPlugin;
