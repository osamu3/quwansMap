var socket = io.connect();
var tmpArr;
$(function() {
//==========socketIO(サーバーからクライアントへ）=========================
	socket.on('S2C:Msg', function (data) {
		console.log('socket.ontest.jsのsocket.on関数の呼び出しがありました。\n');
		//alert("サーバーからメッセージがありました。["+data+"]");
	});

	//Blobから緯度経度リスト(Jsonファイル)が届いた。
	socket.on('S2C:SendLatLngLst', function (latLngLst) {
		//alert("サーバーから緯度経度リストが届きました。["+latLngLst+"]");
		pointArr = JSON.parse(latLngLst)

		//リストに登録
		$("#pointList").append("<ul>");
		for (var point in pointArr) {
			var html = '<a><li class="mapPoint" id="pointListClickEventMethod' + BtnCnt + '">' + pointArr[point].title + '</li></a>'
			$("#pointList").append(html);
			//ポイントリストをクリックしたときのイベントを登録、及びそのイベントファンクションに渡すデータオブジェクトを設定
			//cf:調査範囲.on( イベント名, セレクタ, object, function):http://www.jquerystudy.info/reference/events/on.htmlより
			$("body").on("click", "#pointListClickEventMethod" + BtnCnt, {opt: BtnCnt - 1}, function (eo) {
				map_pan(eo.data.opt);//ファンクションに渡されたデータオブジェクトは、【eo.data.opt】で参照できる。
			});
			BtnCnt++;
		}
		$("#pointList").append("</ul");
	});
});

//===========ソケットIO(クライアントからサーバーへ）================= 
function postLatLngListToBlobWithSocket(latLngLst) {
	console.log('   サーバーへ【データPOST】Emitする。');
	socket.emit('C2S:PostLatLngList', latLngLst);
}
function sendRequest_LatLngListFromBlobWithSocket() {
	console.log('   サーバーへ【データSendRequest】Emitする。');
	socket.emit('C2S:sendRequest_LatLngList');
}
