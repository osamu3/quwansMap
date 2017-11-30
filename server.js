var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require('fs');
var path = require('path');
//var readlineSync = require('readline-sync');

var storage = require('azure-storage');

var connectionString = 'DefaultEndpointsProtocol=https;AccountName=cs4fe87546c74cbx40b5x946;AccountKey=vYGAo3BUcdzTsQhqmWQP4J179K3W6OjR/sBmueUpaKOdY/b6cmk6q8+8XurGKKGqDBpiMwnTm29QRu91AjeI5Q==;EndpointSuffix=core.windows.net';
var blobService = storage.createBlobService(connectionString);
var CONTAINER_NAME = 'container01';
//書き込むファイル(ブロブ)名 
var BLOCK_BLOB_NAME = 'latLngLst.json';

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
	socket.emit('S2C:Msg', 'hello----!!! client');

	//【受信イベント定義】イベント名:C2S:SaveListToBlob
	socket.on('C2S:SaveLatLngListToBlob', function (latLngLst){
		//クライアントからsocketIOで送られてきたリスト(緯度経度)をブロブに書き込み
//  	console.log('Blobへ書き込み:'+latLngLst);
		createTextBlob(latLngLst,function(){//←コールバック関数で↓クライアントへ保存完了のソケットメッセージ送信
	 		console.log('Send:S->C:サーバーからクライアントへ返信');
			socket.emit("S2C:Msg","緯度経度リスト保存完了");
		});
	});
});

//blobService.createContainerIfNotExists(CONTAINER_NAME, { 'publicAccessLevel': 'blob' }, function (error) {
//	handleError(error);

//Blobへの書き込み関数を定義
var createTextBlob = function (writeDt,aCllback){
	//console.log('書き込みデータ確認 = \n'+ JSON.stringify(writeDt,undefined,2) + '\n\n');
								//文法：JSON.stringify(value[, replacer[, space]])　replacerを[undefined]とすることで、第二引数を省略
	blobService.createAppendBlobFromText(CONTAINER_NAME, BLOCK_BLOB_NAME, JSON.stringify(writeDt,undefined,2), function(error){
		handleError(error);

		aCllback();//呼び出し側の関数(コールバック)をここで実行

		/*console.log('コンテナ内のファイル(blob)を一覧を表示\n');
		blobService.listBlobsSegmented(CONTAINER_NAME, null, function (error, data) {
			handleError(error);

			for (var i = 0; i < data.entries.length; i++) {
				console.log("name: "+ data.entries[i].name+"blobType: "+ data.entries[i].blobType);
			}
			console.log('\n');
		});
		*/
	});
}

function handleError(error) {
  if (error) {
    console.error('Exception thrown:\n', error);
    process.abort();
  }
}

