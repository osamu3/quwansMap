$(function() {
	//=======================↓追加=========================
	var socket = io.connect();
	socket.on('S2C_Msg', function (data) {
		console.log('\nsocket.ontest.jsのsocket.on関数の呼び出しがありました。\n');
		alert("サーバーからメッセージがありました。["+data+"]");
	});
 
	function sendMsg(msg) {
		console.log('   サーバーへEmitしました。');
		socket.emit('C2S_Msg', { "type":"mapClick","msg":msg });
	}

//==========================↑追加======================
	var map = L.map('map'); //おまじない
	L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
		attribution: "<a href='https://maps.gis.go.jp/development/ichiran.html' target='_blank'>国土地理院タイル</a>",
	}).addTo(map);

	map.setView([35.23222265555128, 135.21938323974607],11);

	L.control.scale({metric: true, imperial: false}).addTo(map);

	map.on('click', function(e) {

	    console.log("クリックされました。");
		sendMsg("クライアントよりサーバーへ");

		var myPath = location.pathname;
		//フォルダパスを取得
		// var dir_path = myPath.split("/").reverse().slice(1).reverse().join("/");

		L.marker([e.latlng.lat, e.latlng.lng], {
			title: "シカ",
			icon: shikaIcon
		}).addTo(map).bindPopup("シカをクリックしました。dirName:"+myPath);
//		}).addTo(map).bindPopup("シカをクリックしました。").openPopup();

		//データ追加
		$("#dataRange").append(
            $("<tr></tr>")
                .append($("<td class='Lat'></td>").text(e.latlng.lat))
                .append($("<td class='Lng'></td>").text(e.latlng.lng))
        );

	});


	var inosisiIcon = L.icon({
		iconUrl: 'img/inosisi.png',
		iconRetinaUrl: 'img/inosisi.png',
		iconSize: [50, 50],
		iconAnchor: [25, 20],
		popupAnchor: [0, -30]
	});


	var shikaIcon = L.icon({
		iconUrl: 'img/shika.png',
		iconRetinaUrl: 'img/shika.png',
		iconSize: [50, 50],
		iconAnchor: [25, 20],
		popupAnchor: [0, -30]
	});

	//Jsonファイルの読み込み ファイル名=markers.json
	$.getJSON("dataJson/markers.json", function(animals) {
		for (var i in animals) {
			var animal = animals[i];
			if(animal.Type == "シカ"){
				L.marker([animal.lat, animal.lng], {
					title: "シカ",
					icon: shikaIcon
				}).addTo(map).on('click', function(e) {//setContent(animal.Type)とするとバグがでる。
					L.popup()
					.setLatLng([e.latlng.lat, e.latlng.lng])
					.setContent("シカ")
					.openOn(map);
				});
			}
			if(animal.Type == "イノシシ"){
				L.marker([animal.lat, animal.lng], {
					title: "イノシシ",
					icon: inosisiIcon
				}).addTo(map).on('click', function(e) {
					L.popup()
					.setLatLng([e.latlng.lat, e.latlng.lng])
					.setContent("イノシシ")
					.openOn(map);
				});
			}
		}
	});
});