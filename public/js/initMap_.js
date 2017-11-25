// Google Maps APIのコールバック関数
function initMap() {
  var currentWindow = null,
  markers = [],
  infowindows = [],
  markerCount = 0,
  markerMax = 1000,// マーカー最大数
  infowindowMax = 3;// フキダシ最大数
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.2586, lng: 137.6850},
    zoom: 7,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
    }
  });
  // 日本を含む矩形をfitBoundsすることで、画面サイズに依らず日本の中心を表示
  //map.fitBounds(new google.maps.LatLngBounds(
  //  new google.maps.LatLng(27.128750, 128.267736),
  //  new google.maps.LatLng(44.489597, 144.263829)
  //));
  // Socket.IOと接続
  var socket = io.connect();
  // Streaming APIからデータが来た際の処理
  socket.on('msg', function(data) {
    if (currentWindow) {
      currentWindow.close();
    }
    // 位置情報の名称があれば表示
    if (data.place && data.place.name) {
        text += '<hr><i class="fa fa-fw fa-map-marker text-danger"></i> <a href="https://twitter.com/search?q=place%' + data.place.id + '" target="_blank">' + data.place.name + '</a>';
    }
    text += '</div>';
    // 地図マーカーのフキダシ
    var infowindow = new google.maps.InfoWindow({
      content: '<div>' + 'tweet' + '</div>',
      maxWidth: 200,
      disableAutoPan: true
    });
    infowindows.push(infowindow);
    // 地図マーカー
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1]),
      animation: google.maps.Animation.DROP,
      title: '@' + data.user.screen_name
    });
    marker.infowindow = infowindow;
    // マーカーをクリックしたらフキダシ表示
    marker.addListener('click', function() {
      this.infowindow.open(map, this);
    });
    // デフォルトでフキダシを開く
    infowindow.open(map, marker);
    markers.push(marker);
    // ウインドウが最大数になったら前のものを閉じる
    if (markerCount >= infowindowMax) {
      var cls = markerCount - infowindowMax;
      infowindows[cls].close();
    }
    // マーカー数を記録
    markerCount++;
    // マーカーが最大数になったら徐々に透明になっていく（10段階）
    if (markerCount > markerMax) {
      var fade = (markerCount + 1) - markerMax;
      markers[fade].setOpacity(0.9);
      fade--;
      if (markers[fade]) {
        markers[fade].setOpacity(0.8);
        fade--;
        if (markers[fade]) {
          markers[fade].setOpacity(0.7);
          fade--;
          if (markers[fade]) {
            markers[fade].setOpacity(0.6);
            if (markers[fade]) {
              markers[fade].setOpacity(0.5);
              fade--;
              if (markers[fade]) {
                markers[fade].setOpacity(0.4);
                fade--;
                if (markers[fade]) {
                  markers[fade].setOpacity(0.3);
                  fade--;
                  if (markers[fade]) {
                    markers[fade].setOpacity(0.2);
                    fade--;
                    if (markers[fade]) {
                      markers[fade].setOpacity(0.1);
                      fade--;
                      if (markers[fade]) {
                        markers[fade].setMap(null);
                        markers[fade] = null;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}