var map;
var svp;//ストリートビューパノラマオブジェクト
var svs;//ストリートビューサービスオブジェクト
var currentLatLng;//現在の緯度経度を一時保存
var pointArr = [];
var BtnCnt = 1;

jQuery(function ($) {
	//最初の緯度経度リストをサーバーのBlobからダウンロード
	//サーバーへのBlobの緯度経度リスト送信リクエスト。応答は、socketIOで送受信
	sendRequest_LatLngListFromBlobWithSocket();
	google.maps.event.addDomListener(window, 'load', initialize);
	function initialize() {
		var opts = {
			zoom: 15,
			center: new google.maps.LatLng( 35.29757974932173, 135.13061450299858,false ) ,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: true,
			//clickableIcons: false //Point Of Interest(POIアイコン)クリック無効
		};
		currentLatLng = opts.center;//初期値の緯度経度を保存

		map = new google.maps.Map(document.getElementById("mapCanvas"), opts);
 
		//地図上のPOIアイコンを消す。
		var styleOptions = [{
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]}
		];

		map.setOptions({styles: styleOptions});

		var svs = new google.maps.StreetViewService();
		svp = new google.maps.StreetViewPanorama(
			   document.getElementById("mapView"),
				{
					addressControl: true,
					addressControlOptions: "BOTTOM_RIGHT",
					clickToGo: true, //移動
					disableDoubleClickZoom: true,
					imageDateControl:true,		//撮影日の表示
					enableCloseButton: false,	//閉じるボタンの表示
					imageDateControl: true,
					linksControl: true,
					panControl: true,
					scrollwheel: true,
					visible: true,
					zoomControl: true,
					position: map.getCenter()
				});

		//======地図クリックイベントを定義=========================
		map.addListener('click', function(e) {
			//移動とマーカーの登録
			//svs.getPanorama({location: event.latLng, radius: 50}, processSVData);

			//↓LatLng が渡されると、指定された領域でパノラマ データを検索し、【processSVData】関数を呼び出す。
			svs.getPanorama({
					// 目標物の座標
				location: e.latLng,
					// 指定座標からどれだけ離れた撮影地点までを選択するかメートル単位で設定。デフォルトでは50
				radius: 50,
					// 画像の種類を選択する。OUTDOOR ならインドアビューを除外
				source: google.maps.StreetViewSource.OUTDOOR
			}, processSVData);
			//placeMarkerAndPanTo(e.latLng);
		});
		//=====================================================

		svp.setPov({heading: 0, pitch: 0, zoom: 0});
		map.setStreetView(svp);
		//google.mapsのイベントをセット、呼び出される関数名は【review】
		google.maps.event.addListener(svp, 'tilesloaded', review);   //地図タイルが変更されたときにはkk
		//google.maps.event.addListener(svp, 'pano_changed', review);//パノラマIDが変更されたときに発火
		//google.maps.event.addListener(svp, 'pov_changed', review); //カメラの向が変更されたときに発火
		google.maps.event.addListener(svp,'position_changed', review); //ストリートビューの緯度経度が変更されたときに発火
	}
 
	function review() {
		var pos = svp.getPosition();
		currentLatLng = pos;
		document.getElementById("currentLatLng").innerHTML = "緯度経度：" + pos;
		map.panTo(pos);
	}
 });

function map_pan(latlngId) {
	svp.setPosition(pointArr[latlngId].latlng);
	svp.setPov({heading: pointArr[latlngId].heading, pitch: pointArr[latlngId].pitch, zoom: pointArr[latlngId].zoom});
	map.panTo(pointArr[latlngId].latlng);
}


//ストリートビュー画像があったか否か
//http://scientre.hateblo.jp/entry/20150331/streetview_image
//https://developers.google.com/maps/documentation/javascript/streetview?hl=ja
//}, function(panoramaData, status) {
//	switch (status) {
//	case google.maps.StreetViewStatus.OK:
		// 画像あり。ストリートビューを表示する

function processSVData(data, status) {
	if (status === 'OK') {//// ストリートビュー画像あり→マーカーを立て、ストリートビューを表示する
		/*マーカーを立てるのは、止めた
		var marker = new google.maps.Marker({position: data.location.latLng,map: map,title: data.location.description});
		*/

		svp.setPano(data.location.pano);
		// ストリートビューの表示が完了した後、カメラの向きを調整する必要あり
		//cf:http://scientre.hateblo.jp/entry/20150331/streetview_image
	    //svp.setPov({  heading: 270,  pitch: 0});
		svp.setVisible(true);

		/*マーカーにイベントリストを登録
		marker.addListener('click', function() {var markerPanoID = data.location.pano;// Set the Pano to use the passed panoID.
			svp.setPano(markerPanoID);
			svp.setPov({heading: 270,pitch: 0});
			svp.setVisible(true);});
		*/

	} else {//クリックした位置には、ストリートビュー画像がなかった
		console.log('Street View data not found for this location.');
	}
}

//ボタンクリックで発火
function postLatLngListToBlob(){
	//alert($("#pointList").html());
	//alert(JSON.stringify(pointArr));
	////ソケットIOを利用して、カレント緯度経度をブロブに保存
	//saveLatLngListToBlobWithSocket($("#pointList").html());

	//ここを＊＊＊＊＊＊＊＊＊＊＊＊＊↓latLangListにする
	postLatLngListToBlobWithSocket(points);
	//alert(JSON.stringify(pointArr,undefined,4));
};

//リスト削除ボタンクリックで発火
function deleteLatLngListItem(){
	////ソケットIOを利用して、緯度経度リストをブロブに保存
	var delPointId;
	var selector;
	$(".mapPoint").each(function() {
		if($(this).css('fontWeight') == '700'){//フォントスタイルボールドのリストををセレクト
			if(confirm($(this).text()+'を削除しますか？')){
				console.log("indexは:"+$(this).index());
				selector = '#'+$(this).attr("id");
				delPointId= $(selector).index("li");//リストから削除する対象の番号を取得
				$(this).remove();
				pointArr.splice(delPointId, 1); // リストから削除
		
			}
		}
	});
}

//リスト追加ボタンクリックで発火
function addLatLngListItem(){
	var result = prompt('現在地をリストに追加します。キロポストを入力してください', '');
	if(result){
		var pov=svp.getPov();//ストリートビューパノラマのカメラデータを取得

		pointArr.push({		//緯度経度リストに追加
			latlng: svp.position,
			heading: pov["heading"],
			pitch: pov["pitch"],
			zoom: 0,
			title: result
		});

		var html = '<a><li class="mapPoint" id="pointListClickEventMethod' + BtnCnt + '">' + pointArr[pointArr.length-1].title + '</li></a>'
		$("ul").append(html);
		//ポイントリストをクリックしたときのイベントを登録、及びそのイベントファンクションに渡すデータオブジェクトを設定
		$("body").on("click", "#pointListClickEventMethod" + BtnCnt, {opt: BtnCnt - 1}, function (eo) {
			map_pan(eo.data.opt);//ファンクションに渡されたデータオブジェクトは、【eo.data.opt】で参照できる。
		});
		BtnCnt++;

		// マーカーを立てる。
		var marker = new google.maps.Marker({
			position: svp.position,
			map: map,
			title: result
		});

		//マーカーにイベントリストを登録 ===>不必要とする。
		//marker.addListener('click', function() {//var markerPanoID = data.location.pano;// Set the Pano to use the passed panoID.
		//	svp.setPano(svp.getPano);svp.setPov(svp.getPov);{heading: 270,pitch: 0});svp.setVisible(true);		});
	}
}

//地図クリック位置に移動しマーカをセット
function placeMarkerAndPanTo(latLng) {
	var marker = new google.maps.Marker({
		position: latLng,
		map: map	//この時の【map】変数は、クリックされた位置情報を持っている。
	});
	map.panTo(latLng);
	svp.setPosition( latLng);
	currentLatLng=latLng;//現在の緯度経度を保存
}
