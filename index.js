/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/

var express = require("express");
var app = express();

//Express での静的ファイルの提供 ←重要
//http://expressjs.com/ja/starter/static-files.htmlより
//Cf:app.use('/static', express.static('public'));←これで、public ディレクトリー内のファイルを /static パス・プレフィックスからロードできます。
app.use(express.static('public'));
// (クライアント側設定)View EngineにEJSを指定。
app.set('view engine', 'ejs');

var fs = require('fs');

var port = process.env.PORT || 1337;

/* 2. listen()メソッドを実行してポートで待ち受け。*/
var server = app.listen(port, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
    console.log("dirName=" + __dirname);
});


// "/"へのGETリクエストで/views/index.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function(req, res, next){
    res.render("index", {});
});

/*


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
*/

console.log("Server running port:%d", port);
