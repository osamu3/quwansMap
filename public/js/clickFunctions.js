//変更ボタンクリックで発火
function reNameLatLngListItem(){
	var delPointId;
	var selectId;
	$(".mapPoint").each(function() {
		if($(this).css('fontWeight') == '700'){//フォントスタイルボールドのリストををセレクト
			if(confirm($(this).text()+'を変更しますか？')){
				selectId = $(this).attr("id");

				var resultKp = prompt('キロポストを入力してください', latLngLst[selectId].kp);//初期値表示
				if(Number(resultKp) >0) resultKp = Number(resultKp)
				else{
					alert("入力値は、数値ではありませんでした。");
					return false;
				}
				var resultTtl = prompt('標題があれば入力してください。', latLngLst[selectId].title);
				if(resultTtl =="") resultTtl = resultKp;//タイトルがなければKpを代入
				
				$(this).text(resultKp+"KP: "+ resultTtl);//テキスト変更
				latLngLst[selectId].kp = resultKp;
				latLngLst[selectId].title = resultTtl;
			}
		}
	});
}

//計測ボタンクリックで発火
function getRoute(){
// ルートを取得
	var request = {
		origin: route1Latlng,        // 出発地点の緯度、経度
		destination: route2Latlng,   // 到着地点の緯度、経度
		travelMode: google.maps.DirectionsTravelMode.WALKING // ルートの種類
	};
	directionsService.route(request, function(result, status) {
		directionsRenderer.setDirections(result); // 取得したルートをセット
		directionsRenderer.setMap(map); // ルートを地図に表示

		//配列のmap()メソッドを利用したループ。注)ここでのmapは、googleMapのmapではない。
		//map()メソッド利用：	result.routes[0].legs[0].steps.map( function(v) { console.log("result: "+v.lat_lngs)});
		//↑+アロー関数：result.routes[0].legs[0].steps.map( (v) =>{ console.log("result: "+v.lat_lngs)});
		//(){}省略
		//result.routes[0].legs[0].steps.map(v => {
		//	alert("result: "+v.lat_lngs)
		//});
		var oldLat = 0.0;
		var oldLng = 0.0;
		var saveJsonContent = '{\n';
		var jsonKey = 0;
		result.routes[0].legs[0].steps.map(v =>{
			v.lat_lngs.map(vv => {
				if(oldLat != vv.lat() ||  oldLng != vv.lng()){
					saveJsonContent=saveJsonContent+'\t"'+jsonKey+'": {\n'+ '\t\t"route": ' +'"9"' +'\n\t\t"lat": ' +vv.lat()+ ',\n\t\t"lng": '+vv.lng()+'\n\t},\n';
					oldLat=vv.lat();
					oldLng =vv.lng();
					jsonKey++;
				/*
					//計測したルートにマーカーを立てる。
					var marker = new google.maps.Marker({
						position:  {lat: vv.lat(), lng: vv.lng()},
						map: map,
						icon:  "img/markerHalf.png",
						title: "."
					  });
				*/
				}
			});
		});

		var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		var blob = new Blob([ bom, saveJsonContent], { "type" : "text/csv" });
		if(window.navigator.msSaveBlob){
			window.navigator.msSaveBlob(blob, "test.json"); 
		} else{
			alert("保存できません。IEを使用してください。")
		}


		//forEach利用	result.routes[0].legs[0].steps[0].forEach(function(v){ console.log( v.lat_lngs);})
	});
}