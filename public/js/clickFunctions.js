//変更ボタンクリックで発火
function reNameLatLngListItem(){
	////ソケットIOを利用して、緯度経度リストをブロブに保存
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