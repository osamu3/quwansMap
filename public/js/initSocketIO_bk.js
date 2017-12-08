var socket = io.connect();
var currentPoint="";//緯度経度リスト中の現在ポイント

$(function() {

//==========socketIO(サーバーからクライアントへ）=========================
	socket.on('S2C:Msg', function (data) {
		console.log('サーバーからメッセージがありました。\n');
		//alert("サーバーからメッセージがありました。["+data+"]");
	});

	//Blobから緯度経度リスト(Jsonファイル)が届いた。
	socket.on('S2C:sendLatLngLst', function (receivedData) {
		//alert("サーバーから緯度経度リストが届きました。["+latLngLst+"]");
		latLngLst = JSON.parse(receivedData);

		var sId;
		//リストに登録
		$("#pointList").append("<ul>");
		var tmpId =0;
		for (var sUid in latLngLst) {//json配列中のキー(ショートUID）を繰り返し取得
			//sId = getShortUid(latLngLst);
			var html = '<a><li class="mapPoint" id="' + sUid + '">' + latLngLst[sUid].title + '</li></a>'
			
			$("#pointList").append(html);
			//ポイントリストをクリックしたときのイベントを登録、及びそのイベントファンクションに渡すデータオブジェクトを設定
			//cf:調査範囲.on( イベント名, セレクタ, object, function):http://www.jquerystudy.info/reference/events/on.htmlより
			$("body").on("click", "#"+sUid, {sUid: sUid}, function (e) {
				//ポイントリストごとに↓のコードを登録するのは無駄なので、関数呼び出しとすること。
				if(currentPoint != ""){//前に登録していたリストポイントがあれば、スタイルを元に戻す。
					currentPoint.style.backgroundColor = '#aaaaaa';
					currentPoint.style.fontWeight = 'normal';
					currentPoint.style.color = 'cornflowerblue';
				}
				this.style.backgroundColor = '#ccccca';
				this.style.fontWeight = 'bold';
				this.style.color = 'orangered';
				currentPoint = this;
				//alert(this);
				map_pan(e.data.sUid);//ファンクションに渡されたデータオブジェクトは、【e.data.sUid】で参照できる。
			});
			tmpId++;
		}
		$("#pointList").append("</ul");
	});
});

function getShortUid(latLngLst){
	var tmpId
	//乱数の桁数を増やすには、1000＜,減らすには、＜1000　　　↓ここ
	tmpId = new Date().getTime().toString(16)  + Math.floor(1000*Math.random()).toString(16);
}
	

//===========ソケットIO(クライアントからサーバーへ）================= 
//	サーバーへのBlobの緯度経度リスト送信リクエスト
//リスト保存ボタンクリックで発火
function postLatLngListToBlobWithSocket(latLngLst) {
	if(confirm('サーバーに、緯度経度リストを保存しますか？')){
		////ソケットIOを利用して、緯度経度リストをブロブに保存
		console.log('   サーバーへEmit：【緯度経度リスト保存[Post]】');
		socket.emit('C2S:postLatLngListToBlob', latLngLst);//
	}
}

function sendRequest_LatLngListFromBlobWithSocket() {
	console.log('   サーバーへ【データSendRequest】Emitする。');
	socket.emit('C2S:sendRequest_LatLngList');
}

