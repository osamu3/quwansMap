var socket = io.connect();
var currentPoint="";//緯度経度リスト中の現在ポイント

$(function() {

//==========socketIO(サーバーからクライアントへ）=========================
	socket.on('S2C:Msg', function (data) {
		console.log('サーバーからメッセージがありました。\n');
		//alert("サーバーからメッセージがありました。["+data+"]");
	});

	//Blobから緯度経度リスト(Json-textファイル)が届いた。
	socket.on('S2C:sendLatLngLst', function (receivedData) {
		//alert("サーバーから緯度経度リストが届きました。["+latLngLst+"]");
		//latLngLst = JSON.parse(JSON.stringify(receivedData));//取得したテキスト念のため一旦json形式文字列にしてから、JSオブジェクトにする。
		latLngLst = JSON.parse(receivedData);//取得したテキスト念のため一旦json形式文字列にしてから、JSオブジェクトにする。
		var sortedArr = getSortedArr(latLngLst);//latLngLst中のキロポストで並び替えした配列を取得
		//リストに登録
		//$("#pointList").append('<ul id="ulList">');
		var html = "";
		for (var id in sortedArr) {//json配列中のキー(ショートUID）を繰り返し取得
			html = html+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + sortedArr[id].kp+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';
		}
		$("#ulList").empty();//一旦、子要素を削除してリストを空にする。
		$("#ulList").append(html);
		//$("#pointList").append("</ul");
	});
});

