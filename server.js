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

	//========【受信イベント定義】========
	//        【緯度経度リスト要求】
	socket.on('C2S:sendRequest_LatLngList', function (){
		//クライアントからの緯度経度List送信要求にたいして、Blobからリストを取り出し、クライアントへ送る
		readLatLngListFromBlob(function(listData){//←コールバック関数でクライアントへソケットでデータ送信
			socket.emit("S2C:SendLatLngLst",listData);
		});
	});

	//         【緯度経度リスト保存】
	socket.on('C2S:SaveLatLngListToBlob', function (latLngLst){
		console.log("きたきた:"+latLngLst);
		createJsonToBlob(latLngLst,function(){//←コールバック関数で↓クライアントへ保存完了のソケットメッセージ送信
	 		console.log('Send:S->C:サーバーからクライアントへ保存完了を返信');
			socket.emit("S2C:Msg","緯度経度リスト保存完了");
		});
	});
});

//Blobへの読み込み関数を定義
var createJsonToBlob = function (writeDt,aCllback){
								//文法：JSON.stringify(value[, replacer[, space]])　replacerを[undefined]とすることで、第二引数を省略
	blobService.createAppendBlobFromText(CONTAINER_NAME, BLOCK_BLOB_NAME, JSON.stringify(writeDt,undefined,2), function(error){
		handleError(error);
 		console.log('Blobへの保存成功');
		aCllback();//呼び出し側の関数(コールバック)をここで実行
	});
}

//Blobへの書き込み関数を定義
//cf：https://docs.microsoft.com/ja-jp/azure/storage/blobs/storage-nodejs-how-to-use-blob-storage#upload-a-blob-into-a-container
var readLatLngListFromBlob = function (aCllback){
	blobService.getBlobToText(CONTAINER_NAME, BLOCK_BLOB_NAME, function(error, result, response){
		handleError(error);
		//呼び出し時にセットしたコールバック関数:『socket.emit("S2C:SendLatLngLst",listData)』実行
		aCllback(result);//result===listData
	});
}

function handleError(error) {
  if (error) {
    console.error('Exception thrown:\n', error);
    process.abort();
  }
}

