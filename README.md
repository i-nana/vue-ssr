# VUE 服务器渲染

## 创建&初始化项目

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
const renderer = require('vue-server-renderer').createRender();

// 设置静态资源目录
server.use(express.static(path.join(__dirname, 'public')));

server.get('*', (req, res) => {
    const app = new Vue({
        data: {
            url: req.url
        },
        template: `<div>您现在访问的URL是：{{ url }}</div>`
    });
    render.renderToString(app, (err, html) => {
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
