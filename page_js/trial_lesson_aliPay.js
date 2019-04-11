var S = new Store();
var curCount=20;
$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	//	判断是否从个人中心我的订单链接过来的
	var orderid = GetQueryString('orderid');
	if(orderid && orderid != '') {
		var realPrice = GetQueryString('realPrice');
		var paymentmethod = GetQueryString('payMethod');
		$('.orderNum b').text(orderid);
		$('#price').text(realPrice);
		$.ajax({
			type: "post",
			url: url + "/sysorder/rePayment.action",
			async: false,
			data: {
				orderid: orderid,
				paymentmethod:paymentmethod,
				paysource:2
			},
			success: function(data) {
				data = JSON.parse(data);
				//	生成二维码
				$("#qrcodeTable").qrcode({
					render: "canvas",
					text: data.payurl,
					width: "200",
					height: "200"
				});
			}
		});
		setInterval(function() {trialLessonStatus(orderid)}, 3000);
//		InterValObj = window.setInterval(SetRemainTime, 1000);
	} else {
		var orderInfoData = S.get('orderInfoData');
//		console.log(orderInfoData);
		orderInfoData = JSON.parse(orderInfoData);
//		console.log(orderInfoData);
		//	var source = GetQueryString('source');
		var orderNum = orderInfoData.detail[0].usersorderid;
		var price = (orderInfoData.sysorder.orderpaidmoney / 100).toFixed(2);
		$('.orderNum b').text(orderNum);
		$('#price').text(price);
		//	生成二维码
		$("#qrcodeTable").qrcode({
			render: "canvas",
			text: orderInfoData.payurl,
			width: "200",
			height: "200"
		});
		setInterval(function() {trialLessonStatus(orderNum)}, 3000);
//		InterValObj = window.setInterval(SetRemainTime, 1000);
	}
});
//倒计时
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		location.href='personal_center.html';
	} else {
		curCount--;
		$(".countdown span").text(curCount);
	}
}
//监听试听课的支付状态
function trialLessonStatus(orderid){
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderByOrderId.action",
		async: false,
		data: {
			orderid: orderid
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.orderstate == 3) {
				location.href = "add_studentInfo.html";
			}
		}
	});
}
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