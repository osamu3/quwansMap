/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/

var express = require("express");
var app = express();

//Express での静的ファイルの提供 ←重要
//http://expressjs.com/ja/starter/static-files.htmlより
//Cf:app.use('/static', express.static('public'));←別名定義例：public ディレクトリー内のファイルを /static パス・プレフィックスからロードできます。
app.use(express.static('public'));

// (クライアント側設定)View EngineにEJSを指定。
app.set('view engine', 'ejs');

/* 2. listen()メソッドを実行してポートで待ち受け。*/
var port = process.env.PORT || 1337;
var server = app.listen(port, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
    console.log("dirName=" + __dirname);
});

// "/"へのGETリクエストで/views/index.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function(req, res, next){
    res.render("index", {});
});
