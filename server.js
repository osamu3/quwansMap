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
var BLOCK_BLOB_NAME = 'blobcreatetestfile5.txt';


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

//blobService.createContainerIfNotExists(CONTAINER_NAME, { 'publicAccessLevel': 'blob' }, function (error) {
//	handleError(error);

	console.log('Text writing\n');
	blobService.createAppendBlobFromText(CONTAINER_NAME, BLOCK_BLOB_NAME, "text text text text 6", function(error){
		handleError(error);

		console.log('4. Listing blobs in container\n');
		blobService.listBlobsSegmented(CONTAINER_NAME, null, function (error, data) {
			handleError(error);

			for (var i = 0; i < data.entries.length; i++) {
				console.log("name: "+ data.entries[i].name+"blobType: "+ data.entries[i].blobType);
			}
			console.log('\n');
		});
	});
//});

/*
blobService.createContainerIfNotExists(CONTAINER_NAME, { 'publicAccessLevel': 'blob' }, function (error) {
	handleError(error);

	var CONTAINER_NAME = 'container01';
	var BLOCK_BLOB_NAME = 'blobcreatetestfile.txt';

	console.log('1. Creating a container with public access:', CONTAINER_NAME, '\n');

	console.log('*2. Creating a file in ~/Documents folder to test the upload and download\n');

	console.log('3. Uploading BlockBlob:', BLOCK_BLOB_NAME, '\n');
	blobService.createBlockBlobFromLocalFile(CONTAINER_NAME, BLOCK_BLOB_NAME, "blobcreatetestfile.txt", function (error) {
	//blobService.createBlockBlobFromText(CONTAINER_NAME, blob, 'HelloWorld', function(error) {
	    handleError(error);
		console.log('   Uploaded Blob URL:', blobService.getUrl(CONTAINER_NAME, BLOCK_BLOB_NAME), '\n');

		console.log('4. Listing blobs in container\n');
    	blobService.listBlobsSegmented(CONTAINER_NAME, null, function (error, data) {
			handleError(error);

			for (var i = 0; i < data.entries.length; i++) {
				console.log("name: "+ data.entries[i].name+"blobType: "+ data.entries[i].blobType);
			}
			console.log('\n');
		}
	}
}
*/

function handleError(error) {
  if (error) {
    console.error('Exception thrown:\n', error);
    process.abort();
  }
}

