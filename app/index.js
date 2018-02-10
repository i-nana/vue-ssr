const Vue = require('vue');
const fs = require('fs');

module.exports = function createApp(context) {
    return new Vue({
        data: {
            url: context.url,
            title: 'Hello World'
        },
        template: fs.readFileSync('./views/index.template.html', 'utf-8')
    })
}