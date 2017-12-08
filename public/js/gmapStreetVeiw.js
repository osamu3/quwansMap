var map;
var svp;//ストリートビューパノラマオブジェクト
var svs;//ストリートビューサービスオブジェクト
var currentLatLng;//現在の緯度経度を一時保存
var LatLngList;
var BtnCnt = 1;

jQuery(function ($) {

	//最初の緯度経度リストをサーバーのBlobからダウンロード
	//サーバーへのBlobの緯度経度リスト送信リクエスト。応答は、socketIOで送受信
	sendRequest_LatLngListFromBlobWithSocket();
	
	google.maps.event.addDomListener(window, 'load', initialize);

	function initialize() {
		var opts = {zoom: 15,center: new google.maps.LatLng( 35.29757974932173, 135.13061450299858,false ) ,
			mapTypeId: google.maps.MapTypeId.ROADMAP,scrollwheel: true,
			//clickableIcons: false //Point Of Interest(POIアイコン)クリック無効
		};
		currentLatLng = opts.center;//初期値の緯度経度を保存

		map = new google.maps.Map(document.getElementById("mapCanvas"), opts);
 
		//地図上のPOIアイコンを消す。
		var styleOptions = [{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]}];

		map.setOptions({styles: styleOptions});

		var svs = new google.maps.StreetViewService();
		svp = new google.maps.StreetViewPanorama(
			   document.getElementById("mapView"),
				{addressControl: true,addressControlOptions: "BOTTOM_RIGHT",clickToGo: true, //移動
					disableDoubleClickZoom: true,imageDateControl:true,		//撮影日の表示
					enableCloseButton: false,	//閉じるボタンの表示
					imageDateControl: true,linksControl: true,panControl: true,	scrollwheel: true,visible: true,					zoomControl: true,
					position: map.getCenter()});

		//======地図クリックイベントを定義=========================
		map.addListener('click', function(e) {
			//移動とマーカーの登録 svs.getPanorama({location: event.latLng, radius: 50}, processSVData);

			//↓LatLng が渡されると、指定された領域でパノラマ データを検索し、【processSVData】関数を呼び出す。
			svs.getPanorama({
				location: e.latLng,// 目標物の座標
				radius: 50,// 指定座標からどれだけ離れた撮影地点までを選択するかメートル単位で設定。デフォルトでは50
				source: google.maps.StreetViewSource.OUTDOOR // 画像の種類を選択する。OUTDOOR ならインドアビューを除外
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
		document.getElementById("currentLatLng").innerHTML = "<h6>緯度経度：" + pos+"</h6>";
		map.panTo(pos);
	}

	//各種イベントは外部にまとめたいが、上手くいかない。
	//ファイル読み込みイベント登録 cf:http://tmlife.net/programming/javascript/html5-file-api-file-read.html
	$('#readFile').on('change', function(e) {
	    var file = e.target.files[0];	// File オブジェクトを取得
    	var reader = new FileReader();	// ファイルリーダー生成
    	reader.onload = function(e) { // 読み込み完了イベント登録

			//注意！！）要エラートラップ：読み込んだ文字列が、JSON型の文字列であるか判定する必要がある。
			latLngLst = JSON.parse(e.target.result);//読み込んだ文字列(JSON型の文字列のはず)をJavaScriptオブジェクトにする。

			var sortedArr = getSortedArr(latLngLst);//latLngLst中のキロポストで並び替えした配列を取得
			//読み込んだ緯度経度リストから新たなHTML要素を作る。
			var html="";
			for (var id in sortedArr) {//json配列中のキー(ショートUID）を繰り返し取得
				html = html+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + sortedArr[id].kp+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';
			}
			$("#ulList").empty();//一旦、子要素を削除してリストを空にする。
			$("#ulList").append(html);
		};
		reader.readAsText(file);		// テキストとしてファイルを読み込む
	});
});

function map_pan(latlngLstId) {
	svp.setPosition(latLngLst[latlngLstId].latlng);
	svp.setPov({heading: latLngLst[latlngLstId].heading, pitch: latLngLst[latlngLstId].pitch, zoom: latLngLst[latlngLstId].zoom});
	map.panTo(latLngLst[latlngLstId].latlng);
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
		//マーカーを立てるのは、止めた
		//var marker = new google.maps.Marker({position: data.location.latLng,map: map,title: data.location.description});

		svp.setPano(data.location.pano);
		// ストリートビューの表示が完了した後、カメラの向きを調整する必要あり
		//cf:http://scientre.hateblo.jp/entry/20150331/streetview_image
	    //svp.setPov({  heading: 270,  pitch: 0});
		svp.setVisible(true);

		//マーカーにイベントリストを登録
		//marker.addListener('click', function() {var markerPanoID = data.location.pano;// Set the Pano to use the passed panoID.
		//	svp.setPano(markerPanoID);svp.setPov({heading: 270,pitch: 0});svp.setVisible(true);});

	} else {//クリックした位置には、ストリートビュー画像がなかった
		console.log('Street View data not found for this location.');
	}
}

//ボタンクリックで発火
function postLatLngListToBlob(){
	////ソケットIOを利用して、カレント緯度経度をブロブに保存
	postLatLngListToBlobWithSocket(latLngLst);
};

//リスト削除ボタンクリックで発火
function deleteLatLngListItem(){
	////ソケットIOを利用して、緯度経度リストをブロブに保存
	var delPointId;
	var selectId;
	$(".mapPoint").each(function() {
		if($(this).css('fontWeight') == '700'){//フォントスタイルボールドのリストををセレクト
			if(confirm($(this).text()+'を削除しますか？')){
				selectId = $(this).attr("id");
				console.log("idは:"+selectId);
				//delPointId= $("#"+selectId).index("li");//リストから削除する対象の番号を取得
				$(this).remove();//現在の要素を削除
				//pointArr.splice(delPointId, 1); // リストから削除
				delete latLngLst[selectId];
			}
		}
	});
}

//リスト追加ボタンクリックで発火
function addLatLngListItem(){
	var resultKp = prompt('キロポストを入力してください', '');
	
	//入力値が数値に変換できれば数値にする。
	if(Number(resultKp) >0) resultKp = Number(resultKp)
	else{
		alert("入力値は、数値ではありませんでした。");
		return false;
	}
	var resultTtl = prompt('標題があれば入力してください。', '');
	if(resultTtl =="") resultTtl = resultKp;//タイトルがなければKpを代入

	//ショートUIDを作成
	var sUid = getShortUid(latLngLst,function(){alert("sUid checked!");});

	var pov=svp.getPov();//ストリートビューパノラマのカメラデータを取得
	latLngLst[sUid]={	
		latlng: {lat:currentLatLng.lat(),lng:currentLatLng.lng()},
		heading: pov["heading"],
		pitch: pov["pitch"],
		zoom: 0,
		title: resultTtl,
		kp:resultKp
	}

	//====タイトル(KP)順に並び替え====
	//一旦、一時配列に緯度経度リストをコピー(緯度経度リストのままでは、ソートできない。)
	var sortedArr = getSortedArr(latLngLst);//latLngLst中のキロポストで並び替えした配列を取得

	//ポイントが追加された新たなHTMLを作る。
	var html="";
	for(var id in sortedArr){
		html = html+'<a><li class="mapPoint" id="' + sortedArr[id].id + '" onClick="listClick(this)">' + sortedArr[id].kp+"KP: "+ latLngLst[sortedArr[id].id].title + '</li></a>';
	}

	$("#ulList").empty();//一旦、子要素を削除してリストを空にする。
	$("#ulList").append(html);
}

//並び替えボタンクリックで発火
/*
function sortLatLngListItem(){
	//====タイトル(KP)順に並び替え====
	//一旦、一時配列に緯度経度リストをコピー(緯度経度リストのままでは、ソートできない。)

	console.log("LIST:"+latLngLst);
	latLngLst = JSON.stringify(latLngLst);
latLngLst.sort(function(val1, val2) {;//キロポスト順に並び替え実施
			return ( val1.title < val2.title ? 1 : -1);
     	});
	var tmpArr=[];
	for(var sUid in latLngLst){
		tmpArr[tmpArr.length] = {id:sUid, title:latLngLst[sUid].title};
	}
	//一時配列をソート
	tmpArr.sort(function(a,b){
    	if(Number(a.title)>Number(b.title)) return 1;
    	if(Number(a.title)<Number(b.title)) return -1;
    	return 0;
	});

	//ポイントが追加された新たなHTMLを作る。
	var html="";
	for(var id in tmpArr){
		html = html+'<a><li class="mapPoint" id="' + tmpArr[id].id + '" onClick="listClick(this)">' + tmpArr[id].title+"KP" + '</li></a>';
	}

	$("#ulList").empty();//一旦、子要素を削除してリストを空にする。
	$("#ulList").append(html);
}
*/

function getSortedArr(latLngLst){//latLngLstはobj型
	var tmpArr=[];
	//一時配列を作る
	for(var sUid in latLngLst){
		tmpArr[tmpArr.length] = {id:sUid, kp:latLngLst[sUid].kp};
	}
	//一時配列をソート
	tmpArr.sort(function(a,b){
		//↓エラー回避のため、数値か否か判定し、文字列なら半角数値とピリオド以外を削除したのち数値にしてから判定
		//var valA = Number(a.kp.replace(/[^0-9^\.]/g,""));//半角数値と"."(ピリオド)以外を削除
		//var valB = Number(b.kp.replace(/[^0-9^\.]/g,""));

		var valA = Number(a.kp);//そのまま数値に変換を行う（文字列なら"NaN"になる。)
		var valB = Number(b.kp);

		//判定
		if(valA > valB)	return 1;
    	if(valA < valB)	return -1;
		
    	return 0;
	});
	return tmpArr;
}

function listClick(elm){
	if(currentPoint != ""){//前に登録していたリストポイントがあれば、スタイルを元に戻す。
		currentPoint.style.backgroundColor = '#aaaaaa';
		currentPoint.style.fontWeight = 'normal';
		currentPoint.style.color = 'mediumblue';
	}
	elm.style.backgroundColor = '#ccccca';
	elm.style.fontWeight = 'bold';
	elm.style.color = 'orangered';
	currentPoint = elm;
	map_pan(elm.id);//ファンクションに渡されたデータオブジェクトは、【e.data.sUid】で参照できる。
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

function getShortUid(lst){
	var tmpSuid

	do{	//新たなショートUIDを取得
		//仮のショートUIDを作成
		tmpSuid = new Date().getTime().toString(16)  + Math.floor(1000*Math.random()).toString(16);
	//凝ったコード↓
	//while文中の無名関数でリストの中に同じ値のsUidが存在していないかチェックしている。
	}while((function(){//関数内がfalseになるまでdoループ
		for(var itm in lst){//jsonリスト中の全てのキーをループ
			if(itm == tmpSuid)
				return true;
		}
		return false;
	})());//←括弧のオンパレード！"()"は、当関数が即時実行関数であることから必須

	return tmpSuid;
}

//===========ソケットIO(クライアントからサーバーへ）================= 
//	サーバーへのBlobの緯度経度リスト送信リクエスト
//リスト保存ボタンクリックで発火
function postLatLngListToBlobWithSocket(latLngLst) {
	if(confirm('サーバーに、緯度経度リストを保存しますか？')){
		////ソケットIOを利用して、緯度経度リストをブロブに保存
		console.log('   サーバーへEmit：【緯度経度リスト保存[Post]】');
		console.log('latLngLst:'+latLngLst);
		socket.emit('C2S:postLatLngListToBlob', JSON.stringify(latLngLst));//JSON型の文字列にしてからサーバに送る。
	}
}

function sendRequest_LatLngListFromBlobWithSocket() {
	console.log('   サーバーへ【データSendRequest】Emitする。');
	socket.emit('C2S:sendRequest_LatLngList');
}

//デバッグ用：jsonかどうかを判定する。
function isJSON(arg){
	arg = (typeof arg === "function") ? arg() : arg;
	if (typeof arg  !== "string") {
		return false;
	}
	try {
		arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
		return true;
	} catch (e) {
		return false;
	}
};
