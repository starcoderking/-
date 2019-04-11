var S = new Store();
$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	var orderInfoData = S.get('orderInfoData');
	//console.log(orderInfoData);
	orderInfoData = JSON.parse(orderInfoData);
	//console.log(orderInfoData);
	var source = GetQueryString('source');
	if(source == 2) {
		var orderNum = orderInfoData.orderid;
		var price = (orderInfoData.orderpaidmoney/ 100).toFixed(2);
		$('.orderNum b').text(orderNum);
		$('#price').text(price);
		//	生成二维码
		$("#qrcodeTable").qrcode({
			render: "canvas",
			text: orderInfoData.payurl,
			width: "200",
			height: "200"
		});
		setInterval(function(){coursePayStatus(orderNum)},3000);
	} else if(source == 1) {//惠民卡
		var orderNum = orderInfoData.orderid;
		$('.orderNum b').text(orderInfoData.orderid);
		var price = (orderInfoData.orderpaidmoney/ 100).toFixed(2);
		$('#price').text(price);
		//	生成二维码
		$("#qrcodeTable").qrcode({
			render: "canvas",
			text: orderInfoData.payurl,
			width: "200",
			height: "200"
		});
		setInterval(function(){huiminPayStatus(orderNum)},3000);
	}
});
//监控课程购买支付状态
function coursePayStatus(orderid) {
	$.ajax({
		type: "post",
		url: url + "/sysorder/queryPayResult.action",
		async: false,
		data: {
			orderid: orderid
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.orderpaystate == 3) {
				location.href = "transaction_detail.html";
			}
		}
	});
}
//监听惠民卡购买支付状态
function huiminPayStatus(orderid) {
	$.ajax({
		type: "post",
		url: url + "/huimincard/queryPayResult.action",
		async: false,
		data: {
			orderid: orderid
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.orderpaystate == 3) {
				location.href = "transaction_detail.html";
			}
		}
	});
}
//从url中获取参数值
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}