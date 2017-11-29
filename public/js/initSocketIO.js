var socket = io.connect();
$(function() {
//=======================socketIO=========================

	socket.on('S2C_Msg', function (data) {
		console.log('\nsocket.ontest.jsのsocket.on関数の呼び出しがありました。\n');
		alert("サーバーからメッセージがありました。["+data+"]");
	});
});

//===========ソケットIO(クライアントからサーバーへ）================= 
function sendMsg(msg) {
	console.log('   サーバーへEmitしました。');
	socket.emit('C2S_Msg', { "type":"mapClick","msg":msg });
}
