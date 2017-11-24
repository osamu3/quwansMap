function test2(){
	console.log('\n呼び出しがありました。\n');
	alert("called");
}


var socket = io.connect();

//socketIO.on('S2C_Msg', fncMsgPrint)
socket.on('S2C_Msg', function (data) {
	console.log('\nsocket.ontest.jsのsocket.on関数の呼び出しがありました。\n');
	alert("サーバーからメッセージがありました。["+data+"]");
});
 
function send(msg) {
  //var msg = $("input#message").val();
  //$("input#message").val("");
	console.log('   ログ：別ｊｓで、全員へscktEmitします。');
	socket.emit('C2S_Msg', { "type":"brdCast","msg":msg });
}