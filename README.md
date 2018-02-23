# VUE 服务器渲染

##  一、一个简单的服务器渲染（项目创建）

VUE服务器端渲染需要依赖Node环境。

+ 首先创建项目目录 **/vue-ssr**, 在该项目中新建文件 **package.json**用于定义该项目的配置信息和所需模块信息。

```json
{
    "name": "vue-ssr",
    "version": "1.0.0",
    "description": "vue-ssr",
    "main": "app.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "葳蕤",
    "license": "MIT",
    "dependencies": {}
}
```

+ 安装`express`、`vue`和`vue-server-renderer`模块

```bash
npm install express vue vue-server-renderer --save
```

+ 在项目根目录下创建**app.js**文件作为项目入口文件

```javascript
const port = process.env.PORT || 8333;
const path = require('path');
const express = require('express');
const server = express();
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();

// 设置静态资源目录
server.use(express.static(path.join(__dirname, 'public')));

server.get('*', (req, res) => {
    const app = new Vue({
        data: {
            url: req.url
        },
        template: `<div>您现在访问的URL是：{{ url }}</div>`
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
    });
});

server.listen(port, () => {
    console.log('服务已启动，端口号：' + port);
});
```

+ 启动服务`node app`，我们就可以访问：[http://localhost:8333/](http://localhost:8333/)了。

我们可以将上述代码中的路由提出到一个单独的文件中**/routes/index.js**。

```javascript
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();

module.exports = function(server) {
    server.get('*', (req, res) => {
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
            `);
        });
    });
}
```

在**app.js**中相应的代码可以修改为:

```javascript
require('./routes/index')(server);
```

> 代码详见：[**GitHub：iLikeTree/vue-ssr** - ୧(๑•̀⌄•́๑)૭✧ 好好学习，天天向上](https://github.com/iLikeTree/vue-ssr/commit/18fd697e20ca657bd337d3198d3ce1cd04ffd1f1)

---

## 二、使用模板

我们可以将HTML代码作为页面模板。利用Node的**fs**模块读取页面模板并传输到vue renderer中。

创建文件**views/index.template.html**，代码如下：

```html
<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <title>{{ title }}</title>
    </head>
    <body>
        <p>您正在访问的URL是：{{ url }}</p>
    </body>
</html>
```

在上面的代码中，有两个插值：`title` 和 `url`。在使用插值时，可以使用双花括号/三花括号：

+ 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation)
+ 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation)

创建好模板以后，我们需要通过**fs**模块读取并传输模板

```javascript
// app/index.js
const Vue = require('vue');
const fs = require('fs');

module.exports = function createApp(context) {
    return new Vue({
        data: {
            url: context.url,
            title: 'Hello World'
        },
        template: fs.readFileSync('./views/index.template.html', 'utf-8')
    });
}
```

在**routes/index.js**中，我们可以将代码修改为：

```javascript
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
```

