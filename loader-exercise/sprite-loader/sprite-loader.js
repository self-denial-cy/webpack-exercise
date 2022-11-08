const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');

module.exports = function (source) {
    const callback = this.async();
    console.log(source);
    const imgs = source.match(/url\('(\S*)\?__sprite'\)/g);
    console.log(imgs);
    const matchedImgs = [];
    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i].match(/url\('(\S*)\?__sprite'\)/)[1];
        console.log(img);
        const srcPath = path.join(__dirname, './src');
        matchedImgs.push(path.join(srcPath, img));
    }
    console.log(matchedImgs);
    Spritesmith.run({
        src: matchedImgs
    }, (err, result) => {
        err ? console.log(err) : console.log(result);
        // 为了方便，需要手动创建 dist 文件夹
        fs.writeFileSync(path.join(__dirname, './dist/sprite.png'), result.image);

        source = source.replace(/url\('(\S*)\?__sprite'\)/g, `url('dist/sprite.png')`);

        console.log(source);

        fs.writeFileSync(path.join(__dirname, './dist/index.css'), source);

        callback(null, source);
    });
};
