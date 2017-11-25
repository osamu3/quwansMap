var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require('fs');
var port = process.env.PORT || 1337;

// (クライアント側設定)View EngineにEJSを指定。
app.set('view engine', 'ejs');

// "/"へのGETリクエストで/views/index.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function(req, res, next){
    res.render("index", {});
});

//listen()メソッドを実行してポートで待ち受け。
http.listen(port,() => {
	console.log(`listening on *:${port}`);
});

//Express での静的ファイルの提供 ←重要
//http://expressjs.com/ja/starter/static-files.htmlより
app.use('/static', express.static('public'));//←別名定義例(クライアント側で使用)これで、"public"を"/static" で利用できる。
app.use(express.static('public'));	//パス文字列無しで"public"を使用できるように設定。


//IOソケットイベント
io.sockets.on('connection', function (socket){
	//↓接続時に一度だけ実行
	console.log('クライアントの接続がありました。');
	socket.emit('S2C_Msg', 'hello! client');

	//　クライアントからemitされた時のイベント
	socket.on('C2S_Msg', function (msg){
		console.log('クライアントからのメッセージを受け取りました。メッセージは:', msg);
		//クライアントへサーバー側の./public/dataJson内容を返す
		fs.readdir('./public/dataJson', function(err, files){
  		if (err) throw err;
			socket.emit("S2C_Msg",files);
	  		console.log('サーバーからクライアントへブロードキャスト');
		});
	});

});

