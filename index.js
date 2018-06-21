var http = require('http');
 
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello Dammio!');
}).listen(3000, '116.93.97.239');