const VueSSR = require('vue-server-renderer');
const createApp = require('../app/index.js');

const renderer = VueSSR.createRenderer();

module.exports = function(server) {
    server.get('*', (req, res) => {
        const context = {
            title: 'Hello' + req.url,
            url: req.url
        };
        const app = createApp(context);
        renderer.renderToString(app, (err, html) => {
            if(err) {
                res.writeHead(500,{"Content-Type":"application/json;charset=utf-8"});
                res.end(`Internal Server Error：${err}`);
            }
            res.end(html);
        });
    }); 
}