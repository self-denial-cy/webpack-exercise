module.exports = function (source) {
    // console.log('Loader');
    return source + `\n console.log('this is additional content by loader');`;
};
