var map;
var svp;

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
            scrollwheel: true
        };
        map = new google.maps.Map(document.getElementById("mapCanvas"), opts);
 
		//地図クリックイベントを定義
		map.addListener('click', function(e) {
			placeMarkerAndPanTo(e.latLng, map);//この時の【map】変数は、クリックされた位置情報を持っている。
        });

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
        svp.setPov({heading: pointArr[0].heading, pitch: pointArr[0].pitch, zoom: pointArr[0].zoom});
        map.setStreetView(svp);
        google.maps.event.addListener(svp, 'tilesloaded', review);
        google.maps.event.addListener(svp, 'pano_changed', review);
        google.maps.event.addListener(svp, 'pov_changed', review);
    }
 
    function review() {
        var pov = svp.getPov();
        document.getElementById("currentLatLng").innerHTML = "緯度経度：" + svp.getPosition() + "<br>" +
                "方角:" + pov["heading"] + "<br>" +
                "角度:" + pov["pitch"] + "<br>" +
                "ズーム:" + pov["zoom"];
    }
 
    function map_pan(no) {
        svp.setPosition(pointArr[no].latlng);
        svp.setPov({heading: pointArr[no].heading, pitch: pointArr[no].pitch, zoom: pointArr[no].zoom});
        map.panTo(pointArr[no].latlng);
    }


});

function funcTest(){
	alert('これはテストです');
	var latLng = new google.maps.LatLng(35.627223, 139.77401299999997);
	svp.setPosition( latLng);
	map.panTo(latLng);
};
function placeMarkerAndPanTo(latLng, clickedMap) {
	var marker = new google.maps.Marker({
		position: latLng,
		map: clickedMap
	});
	map.panTo(latLng);
	svp.setPosition( latLng);
}