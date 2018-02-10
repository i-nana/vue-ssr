const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();

module.exports = function(server) {
    server.get('/', (req, res) => {
        const app = new Vue({
            data: {
                url: req.url
            },
            template: `<div>您正在访问的URL是：{{ url }}</div>`
        });
        renderer.renderToString(app, (err, html) => {
            if(err) {
                res.status(500).end('Internal Server Error');
                return;
            }
            res.end(`
<!DOCTYPE html>
<html lang=zh>
    <head>
        <meta charset="utf-8">
        <title>新标签页</title>
        <body>${html}</body>
    </head>
</html>
            `)
        })
    });
    
}