/*  socketIOでクライアントへ、ディレクトリ一覧通知用*/
let fs = require('fs');


/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
//var app = express();
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 1337;

// (クライアント側設定)View EngineにEJSを指定。
app.set('view engine', 'ejs');

// "/"へのGETリクエストで/views/index.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function(req, res, next){
    res.render("index", {});
});

/* 2. listen()メソッドを実行してポートで待ち受け。*/
http.listen(port,() => {
	console.log(`listening on *:${port}`);
});


//Express での静的ファイルの提供 ←重要
//http://expressjs.com/ja/starter/static-files.htmlより
app.use('/static', express.static('public'));//←別名定義例：public ディレクトリー内のファイルを /static パス・プレフィックスからロードできます。
app.use(express.static('public'));


//IOソケットイベント
io.sockets.on('connection', function (socket){
  // hello, worldはクライアントが接続するとすぐに1度だけ送信されます
  console.log('connected!!!!!!!!!!!!!!!!!!!!!!');
  //socket.emit('message_from_server', 'hello! client');
  //　クライアントからmessage_from_clientがemitされた時
  socket.on('C2S_Msg', function (msg){
    console.log('クライアントからのメッセージを受け取りました。メッセージは:', msg);

	//クライアントへサーバー側のカレントディレクトリの内容を返す
	fs.readdir('./public/dataJson', function(err, files){
  	if (err) throw err;
		socket.emit("S2C_Msg",files);
	  	console.log('サーバーからクライアントへブロードキャスト');
	});
  });
});

