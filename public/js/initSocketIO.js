var socket = io.connect();
$(function() {
//=======================socketIO=========================

	socket.on('S2C:Msg', function (data) {
		console.log('\nsocket.ontest.jsのsocket.on関数の呼び出しがありました。\n');
		alert("サーバーからメッセージがありました。["+data+"]");
	});
});

//===========ソケットIO(クライアントからサーバーへ）================= 
function saveLatLngListToBlobWithSocket(latLngLst) {
	console.log('   サーバーへEmitする。');

	//socket.emit('C2S:SaveLatLngListToBlob', { "type":"mapClick","latLngLst":latLngLst });//
	socket.emit('C2S:SaveLatLngListToBlob', latLngLst);//

}
