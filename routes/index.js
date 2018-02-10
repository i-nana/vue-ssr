const Vue = require('vue');
const VueSSR = require('vue-server-renderer');
const createApp = require('../app/index.js');

const renderer = VueSSR.createRenderer();

module.exports = function(server) {
    server.get('/', (req, res) => {
        const context = {
            url: req.url
        };
        const app = createApp(context);
        renderer.renderToString(app, (err, html) => {
            if(err) {
                res.status(500).end('Internal Server Error');
                return;
            }
            res.end(html);
        });
    });
    
}