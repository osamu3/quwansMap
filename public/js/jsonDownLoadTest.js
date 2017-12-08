//ファイル操作モジュールの追加
var fs = require('fs');
var ioSct=require("socket.io/socket.io.js");



//ファイル読み込み関数
function readFile(path) {
	fs.readFile(path, 'utf8', function (err, data) {

    //エラーの場合はエラーを投げてくれる
    if (err) {
        throw err;
    }
    
    //ここに処理
	var jsonFl = JSON.stringify(data);
    console.log(jsonFl);
	jsonFl = JSON.parse(jsonFl);
    console.log(jsonFl);
		
 console.log("ioSct");
 console.log("ioSct");
 console.log(ioSct);
 console.log("ioSct");

  });
}

//使用例
readFile("latlngLst.json");

//ボタンクリックで発火
/*
function uplodLatLngListToBlob(){

	var fs=require("fs");

	fs.writeFile(filename,data,function(err){
   if(err) throw err;
   console.log("書き込み完了");
}

*/


	////ソケットIOを利用して、カレント緯度経度をブロブに保存
//	postLatLngListToBlobWithSocket(latLngLst);//サーバへはオブジェクトとして送るが、サーバ側で文字列に変換して保存される。
//};



function postLatLngListToBlobWithSocket(jsonData){

	alertt("ここに来た！");
}

/*
	//====タイトル(KP)順に並び替え====
	//一旦、一時配列に緯度経度リストをコピー(緯度経度リストのままでは、ソートできない。)
	var tmpArr=[];
	for(var sUid in latLngLst){
		tmpArr[tmpArr.length] = {id:sUid, title:latLngLst[sUid].title};
	}
	//一時配列をソート
	tmpArr.sort(function(a,b){
    	if(Number(a.title)>Number(b.title)) return 1;
    	if(Number(a.title)<Number(b.title)) return -1;
    	return 0;
	});

	//ポイントが追加された新たなHTMLを作る。
	var html="";
	for(var id in tmpArr){
		html = html+'<a><li class="mapPoint" id="' + tmpArr[id].id + '" onClick="listClick(this)">' + tmpArr[id].title+"KP" + '</li></a>';
	}

	$("#ulList").empty();//一旦、子要素を削除してリストを空にする。
	$("#ulList").append(html);
}




//並び替えボタンクリックで発火
function sortLatLngListItem(){
	//====タイトル(KP)順に並び替え====
	//一旦、一時配列に緯度経度リストをコピー(緯度経度リストのままでは、ソートできない。)


	console.log("LIST:"+latLngLst);
	latLngLst = JSON.stringify(latLngLst);
latLngLst.sort(function(val1, val2) {;//キロポスト順に並び替え実施
			return ( val1.title < val2.title ? 1 : -1);
     	});
}

function objTypeJsonDataSort(latLngLst){//latLngLstはobj型
	var tmpArr=[];
	for(var sUid in latLngLst){
		tmpArr[tmpArr.length] = {id:sUid, kp:latLngLst[sUid].kp};
	}
	//一時配列をソート
	tmpArr.sort(function(a,b){
		var valA = Number(a.title.replace(/[^0-9^\.]/g,""));
		var valB = Number(b.title.replace(/[^0-9^\.]/g,""));

    	if(valA > valB)	return 1;
    	if(valA < valB)	return -1;
    	return 0;
	});
	return tmpArr;
}

//===========ソケットIO(クライアントからサーバーへ）================= 
//	サーバーへのBlobの緯度経度リスト送信リクエスト
//リスト保存ボタンクリックで発火
function postLatLngListToBlobWithSocket(latLngLst) {
	if(confirm('サーバーに、緯度経度リストを保存しますか？')){
		////ソケットIOを利用して、緯度経度リストをブロブに保存
		console.log('   サーバーへEmit：【緯度経度リスト保存[Post]】');
		console.log('latLngLst:'+latLngLst);
		socket.emit('C2S:postLatLngListToBlob', latLngLst);//
	}
}
*/