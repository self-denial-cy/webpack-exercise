if (typeof window === 'undefined') global.window = {}

const express = require('express');
const {renderToString} = require('react-dom/server');
const SSR = require('../dist/home');

const renderMarkup = (html) => {
    return `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><title>Home</title></head><body><div id="react-app">${html}</div></body></html>`;
};

const server = (port) => {
    const app = express();

    app.use(express.static('dist'));

    app.get('/home', (req, res) => {
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html);
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

server(process.env.PORT || 3000);
