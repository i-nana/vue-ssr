const port = process.env.PORT || 8333;
const path = require('path');
const favicon = require('serve-favicon');
const express = require('express');
const server = express();

server.use(express.static(path.join(__dirname, 'public')));
server.use(favicon(__dirname + '/favicon.ico'));

require('./routes/index')(server);

server.listen(port, () => {
    console.log('服务已启动，端口号：' + port);
});