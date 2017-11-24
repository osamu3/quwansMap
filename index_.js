var express = require("express");
var app = express();

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});





var http = require('http'),
 fs = require('fs');
var server = http.createServer();

server.on('request',function(req, res) {
	fs.readFile(__dirname+'/views/index.html','utf-8',function(err,htmlSorce){
		if(err){
			res.writeHead(404,{'Content-Type':'text/plain'});
			res.write("index.html file not found!");
			return res.end();
		}
    res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('Read File Success !!!');
		//res.write(htmlSorce);
  	res.end();
	});
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running port:%d", port);
