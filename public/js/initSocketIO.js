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

		//一旦キロポスト用マーカ配列を削除
		KpMarkerArray.forEach(function (marker) { marker.setMap(null); });

		var html = "";
		var mapIconNm;
		var mapHalfKpIconNm="img/markerHalf.png";
		//読み込んだ緯度経度リストから新たなHTML要素を作る。↓配列にすること！！
		var html9_1="";		var html9_2="";		var html9_3="";		var html9_4="";
		var html27_1="";	var html27_2="";	var html27_3="";
		var kiroPost;
		for (var id in sortedArr) {//json配列中のキー(ショートUID）を繰り返し取得
			kiroPost = sortedArr[id].kp;
			if(sortedArr[id].route == 9)
				if(kiroPost < 60.22) 
					html9_1 = html9_1+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + kiroPost+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';
				else if(kiroPost < 71.405) 
					html9_2 = html9_2+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + kiroPost+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';
				else if(kiroPost < 98.106) 
					html9_3 = html9_3+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + kiroPost+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';
				else 
					html9_4 = html9_4+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + kiroPost+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';

			//キロポストから適切なマーカーアイコン名を設定
			if(Number.isInteger(kiroPost)) mapIconNm = "img/marker"+sortedArr[id].kp+".png"
			else mapIconNm = mapHalfKpIconNm;

			var marker = new google.maps.Marker({
    			position: latLngLst[sortedArr[id].id].latlng,
    			map: map,
				icon: mapIconNm,
    			title: latLngLst[sortedArr[id].id].title
  			});
			KpMarkerArray.push(marker);//キロポスト用マーカー配列に保存
		}

		$("#ulList9-1").empty();//一旦、子要素を削除してリストを空にする。
		$("#ulList9-2").empty();
		$("#ulList9-3").empty();
		$("#ulList9-4").empty();
		$("#ulList9-1").append(html9_1);
		$("#ulList9-2").append(html9_2);
		$("#ulList9-3").append(html9_3);
		$("#ulList9-4").append(html9_4);


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

