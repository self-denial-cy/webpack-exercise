if (typeof window === 'undefined') global.window = {}

const fs = require('fs');
const path = require('path');
const express = require('express');
const {renderToString} = require('react-dom/server');
const SSR = require('../dist/home');
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
// 首屏数据（只是首屏数据而已）（tag:暂时还不清楚这个首屏数据搁哪使用）
const data = require('./data.json');

const renderMarkup = (html) => {
    const json = JSON.stringify(data);
    return template.replace('<!--HTML_PLACEHOLDER-->', html).replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__initial_data__=${json}</script>`);
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
