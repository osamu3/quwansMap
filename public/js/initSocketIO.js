var socket = io.connect();
var currentPoint="";//緯度経度リスト中の現在ポイント
var points = {
	hwX6aOr7:{
		latlng: new google.maps.LatLng(35.29757974932173, 135.13061450299858),
		heading: 78.9508155097113,
		pitch: 2,
		zoom: 0,
		title: "福知山河川国土事務所"
	},

	eWRhpRV:{
		latlng: new google.maps.LatLng(35.627223, 139.77401299999997),
		heading: 143.19859411274888,
		pitch: 47.604296081932716,
		zoom: 0,
		title: "フジテレビ"
	},

	dogPzIz8:{
		latlng: new google.maps.LatLng(35.709723, 139.811511),
		heading: -35.77428934912274,
		pitch: 54.77805451608379,
		zoom: 0,
		title: "スカイツリー"
	},

	nYrnfYEv:{
		latlng: new google.maps.LatLng(35.713799, 139.77581099999998),
		heading: 120.93017211788424,
		pitch: 11.153057144630985,
		zoom: 0,
		title: "上野駅前"
	},

	a4vhAoFG:{
		latlng: new google.maps.LatLng(35.1665776892919,135.42206508675656),
		heading: 298.285050292608,
		pitch: -6.8910602699403825,
		zoom: 0,
		title: "46"
	}
}


$(function() {

//==========socketIO(サーバーからクライアントへ）=========================
	socket.on('S2C:Msg', function (data) {
		console.log('サーバーからメッセージがありました。\n');
		//alert("サーバーからメッセージがありました。["+data+"]");
	});

	//Blobから緯度経度リスト(Jsonファイル)が届いた。
	socket.on('S2C:SendLatLngLst', function (latLngLst) {
		//alert("サーバーから緯度経度リストが届きました。["+latLngLst+"]");
//		pointArr = JSON.parse(latLngLst)
pointArr = points;
		var sId;
		//リストに登録
		$("#pointList").append("<ul>");
		var tmpId =0;
		for (var point in pointArr) {
			//sId = getShortUid(latLngLst);
//			var html = '<a><li class="mapPoint" id="pointListClickEventMethod' + BtnCnt + '">' + pointArr[point].title + '</li></a>'
			var html = '<a><li class="mapPoint" id="' + point + '">' + pointArr[point].title + '</li></a>'
			
			$("#pointList").append(html);
			//ポイントリストをクリックしたときのイベントを登録、及びそのイベントファンクションに渡すデータオブジェクトを設定
			//cf:調査範囲.on( イベント名, セレクタ, object, function):http://www.jquerystudy.info/reference/events/on.htmlより
//			$("body").on("click", "#pointListClickEventMethod" + BtnCnt, {btnCnt: BtnCnt - 1}, function (e) {
			$("body").on("click", "#"+point, {sId: point}, function (e) {
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
//				map_pan(e.data.btnCnt);//ファンクションに渡されたデータオブジェクトは、【e.data.btnCnt】で参照できる。
				map_pan(e.data.sId);//ファンクションに渡されたデータオブジェクトは、【e.data.sId】で参照できる。
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

