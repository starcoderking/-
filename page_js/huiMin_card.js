var S = new Store();
var userid = S.get('userId');
$(function() {
	$('.header_box').load('header.html', function() {
		main();
		navText('艺术教育惠民卡');
	});
	//	选择支付方式
	$(".pay_way .radio").click(function() {
		$(this).addClass('radioSel');
		$(this).parent().siblings().find('div').removeClass('radioSel');
	});
	$('.buy').click(function() {
		var paymentmethod = $('.radioSel').parent().find('span').attr('data-paymentmethod');
		if(userid == null) {
			location.href = 'login.html';
		} else {
			queryOrderid(paymentmethod);
		}
	})
});

function queryOrderid(paymentmethod) {
	$.ajax({
		type: "post",
		url: url + "/huimincard/pageHuiminOrderInit.action",
		async: false,
		data: {
			userid: userid,
			ordersource: 2,
			paymentmethod: paymentmethod
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.result == 2) {
				SimplePop.alert(data.failreason);
				return false;
			} else {
				var orderid = data.orderid;
				queryOrderInfo(orderid,paymentmethod);
			}
		},
		error: function() {
			SimplePop.alert('联系客服找后台');
		}
	});
}
function queryOrderInfo(orderid,paymentmethod) {
	$.ajax({
		type: "post",
		url: url + "/huimincard/pageOrderHuiminCard.action",
		async: false,
		data: {
			userid: userid,
			paymentmethod: paymentmethod,
			ordersource: 2,
			orderid:orderid
		},
		success: function(data) {
			//console.log(data);
			if(data != 'null' && data != '' && data != '{}') {
				S.set('orderInfoData', data);
				data = JSON.parse(data);
				if(data.result == 2) {
					SimplePop.alert(data.failreason);
					return false;
				} else {
					if(paymentmethod == 2) {
						location.href = 'wechatPay.html?source=1';
					} else {
						location.href = 'aliPay.html?source=1';
					}
				}
			} else {
				SimplePop.alert('当前不能购买惠民卡');
			}
		}
	});
}