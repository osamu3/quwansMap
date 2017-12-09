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
		latLngLst = JSON.parse(receivedData);//JSオブジェクトにする。
		var sortedArr = getSortedArr(latLngLst);//latLngLst中のキロポストで並び替えした配列を取得
		//リストに登録
		//$("#pointList").append('<ul id="ulList">');
		var html = "";
		var mapIconNm;
		var mapHalfKpIconNm="img/markerHalf.png";
		var kiroPost;
		for (var id in sortedArr) {//json配列中のキー(ショートUID）を繰り返し取得
			kiroPost = sortedArr[id].kp;
			html = html+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + kiroPost+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';
			if(Number.isInteger(kiroPost)) mapIconNm = "img/marker"+sortedArr[id].kp+".png"
			else mapIconNm = "img/markerHalf.png";
//alert("marker"+sortedArr[id].kp);
			var marker = new google.maps.Marker({
    			position: latLngLst[sortedArr[id].id].latlng,
    			map: map,
				icon: mapIconNm,
    			title: latLngLst[sortedArr[id].id].title
  			});
		}
		$("#ulList").empty();//一旦、子要素を削除してリストを空にする。
		$("#ulList").append(html);


		//マーカー
		//var marker = new google.maps.Marker({position: data.location.latLng,map: map,title: data.location.description});

//		var myLatLng = {"lat": 35.1665776892919, "lng": 135.42206508675656};
//		var marker = new google.maps.Marker({
//    		position: myLatLng,
//    		map: map,
//    		title: 'Hello World!'
//  		});


		//$("#pointList").append("</ul");
	});
});

