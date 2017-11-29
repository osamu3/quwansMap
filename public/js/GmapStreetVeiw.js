var map;
var svp;//ストリートビューパノラマオブジェクト
var svs;//ストリートビューサービスオブジェクト
var currentLatLng;//現在の緯度経度を一時保存

jQuery(function ($) {
	var pointArr = [];

	pointArr[0] = {
		latlng: new google.maps.LatLng(35.29757974932173, 135.13061450299858),
		heading: 78.9508155097113,
		pitch: 2.0,
		zoom: 0,
		title: "福知山河川国道事務所",
	}
	pointArr[1] = {
		latlng: new google.maps.LatLng(35.627223, 139.77401299999997),
		heading: 143.19859411274888,
		pitch: 47.604296081932716,
		zoom: 0,
		title: "フジテレビ前",
	}
	pointArr[2] = {
		latlng: new google.maps.LatLng(35.709723, 139.811511),
		heading: -35.77428934912274,
		pitch: 54.77805451608379,
		zoom: 0,
		title: "スカイツリー前"
	}
	pointArr[3] = {
		latlng: new google.maps.LatLng(35.713799, 139.77581099999998),
		heading: 120.93017211788424,
		pitch: 11.153057144630985,
		zoom: 0,
		title: "上野駅前",
	}
 
	//初期設定：リストに登録
	var btncnt = 1;
	$("#pointList").append("<ul>");
	for (var point in pointArr) {
		var html = '<a><li class="mapPoint" id="pointListClickEventMethod' + btncnt + '">' + pointArr[point].title + '</li></a>'
		$("#pointList").append(html);
		//ポイントリストをクリックしたときのイベントを登録、及びそのイベントファンクションに渡すデータオブジェクトを設定
		//cf:調査範囲.on( イベント名, セレクタ, object, function):http://www.jquerystudy.info/reference/events/on.htmlより
		$("body").on("click", "#pointListClickEventMethod" + btncnt, {opt: btncnt - 1}, function (eo) {
			map_pan(eo.data.opt);//ファンクションに渡されたデータオブジェクトは、【eo.data.opt】で参照できる。
		});
		btncnt++;
	}
	$("#pointList").append("</ul");
 
	google.maps.event.addDomListener(window, 'load', initialize);
	function initialize() {
		var opts = {
			zoom: 15,
			center: pointArr[0].latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: true,
			//clickableIcons: false //Point Of Interest(POIアイコン)クリック無効
		};
		currentLatLng = pointArr[0].latlng;//初期値の緯度経度を保存

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
					enableCloseButton: false, //閉じるボタンの表示
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

		svp.setPov({heading: pointArr[0].heading, pitch: pointArr[0].pitch, zoom: pointArr[0].zoom});
		map.setStreetView(svp);
		//google.mapsのイベントをセット、呼び出される関数名は【review】
		google.maps.event.addListener(svp, 'tilesloaded', review);   //地図タイルが変更されたときにはkk
		//google.maps.event.addListener(svp, 'pano_changed', review);//パノラマIDが変更されたときに発火
		//google.maps.event.addListener(svp, 'pov_changed', review); //カメラの向が変更されたときに発火
		google.maps.event.addListener(svp,'position_changed', review); //ストリートビューの緯度経度が変更されたときに発火
	}
 
	function review() {
		var pos = svp.getPosition();
		document.getElementById("currentLatLng").innerHTML = "緯度経度：" + pos;
		map.panTo(pos);
	}
 
	function map_pan(no) {
		svp.setPosition(pointArr[no].latlng);
		svp.setPov({heading: pointArr[no].heading, pitch: pointArr[no].pitch, zoom: pointArr[no].zoom});
		map.panTo(pointArr[no].latlng);
	}


});

//ストリートビュー画像があったか否か
//http://scientre.hateblo.jp/entry/20150331/streetview_image
//https://developers.google.com/maps/documentation/javascript/streetview?hl=ja
//}, function(panoramaData, status) {
//	switch (status) {
//	case google.maps.StreetViewStatus.OK:
		// 画像あり。ストリートビューを表示する

function processSVData(data, status) {
  if (status === 'OK') {//// 画像あり→マーカーを立て、ストリートビューを表示する
    var marker = new google.maps.Marker({
      position: data.location.latLng,
      map: map,
      title: data.location.description
    });

    svp.setPano(data.location.pano);
	// ストリートビューの表示が完了した後、カメラの向きを調整する必要あり
	//cf:http://scientre.hateblo.jp/entry/20150331/streetview_image
    //svp.setPov({
    //  heading: 270,
    //  pitch: 0
    //});
    svp.setVisible(true);

    marker.addListener('click', function() {
      var markerPanoID = data.location.pano;
      // Set the Pano to use the passed panoID.
      svp.setPano(markerPanoID);
      svp.setPov({
        heading: 270,
        pitch: 0
      });
      svp.setVisible(true);
    });
  } else {
    console.log('Street View data not found for this location.');
}
}

function funcTest(){
	alert('これはテストです');
	var latLng = new google.maps.LatLng(35.627223, 139.77401299999997);
	svp.setPosition( latLng);
	map.panTo(latLng);
};

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
