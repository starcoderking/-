var S = new Store();
$(function() {
	//	禁止页面返回上一页
	history.pushState(null, null, document.URL);
	window.addEventListener('popstate', function() {
		history.pushState(null, null, document.URL);
	});
	//	判断支付来源(课程支付,订单支付)
	var orderid = GetQueryString('orderid');
	if(orderid && orderid != '') {
		$("#backCourse").text('返回订单详情');
		$.ajax({
			type: "post",
			url: url + "/sysorder/rePayment.action",
			async: false,
			data: {
				orderid: orderid,
				paymentmethod: 2,
				paysource: 4
			},
			success: function(data) {
				S.set('orderInfoData', data);
				data = JSON.parse(data);
				var cOrderHtml = '<li><em>购买账户：</em><span>' + data.phonenumber + '</span></li>' +
					'<li><em>应付金额：</em><span>' + (data.ordermoney / 100).toFixed(2) + '元</span></li>' +
					'<li><em>实付金额：</em><span>' + (data.orderpaidmoney / 100).toFixed(2) + '元</span></li>' +
					'<li><em>购买时间：</em><span>' + data.buytime + '</span></li>' +
					'<li><em>购买数量：</em><span>' + data.ordernumber + '</span></li>' +
					'<li><em>订单编号：</em><span>' + data.orderid + '</span></li>'
				$('.orderInfo').html(cOrderHtml);
				setTimeout('openWechatPay()', 2000);
			},
			error: function() {
				alert('获取数据错误，请联系客服');
			}
		});
		setInterval(function() {
			coursePayStatus()
		}, 3000);
		$("#backIndex").click(function() {
			location.href = "index.html";
		});
		$("#backCourse").click(function() {
			location.href='my-order.html';
		});
	} else {
		var orderInfoData = JSON.parse(S.get('orderInfoData'));
		if(orderInfoData != '' && orderInfoData != undefined) {
			var cOrderHtml = '<li><em>购买账户：</em><span>' + orderInfoData.phonenumber + '</span></li>' +
				'<li><em>应付金额：</em><span>' + (orderInfoData.ordermoney / 100).toFixed(2) + '元</span></li>' +
				'<li><em>实付金额：</em><span>' + (orderInfoData.orderpaidmoney / 100).toFixed(2) + '元</span></li>' +
				'<li><em>购买时间：</em><span>' + orderInfoData.buytime + '</span></li>' +
				'<li><em>购买数量：</em><span>' + orderInfoData.ordernumber + '</span></li>' +
				'<li><em>订单编号：</em><span>' + orderInfoData.orderid + '</span></li>'
			$('.orderInfo').html(cOrderHtml);
		}
		setTimeout('openWechatPay()', 2000);
		setInterval(function() {
			coursePayStatus()
		}, 3000);
		$("#backIndex").click(function() {
			location.href = "index.html";
		});
		$("#backCourse").click(function() {
			history.go(-2);
		});
	}
});

function openWechatPay() {
	//	var S = new Store();
	var orderInfoData = JSON.parse(S.get('orderInfoData'));
	var orderid = orderInfoData.orderid;
	var orderNum = S.get('orderNum');
	if(orderid != orderNum) {
		var payUrl = orderInfoData.payurl;
		S.set('orderNum', orderid);
		location.href = payUrl;
	}
}
//监控课程购买支付状态
function coursePayStatus() {
	//	var S = new Store();
	var orderInfoData = JSON.parse(S.get('orderInfoData'));
	if(orderInfoData != '' && orderInfoData != null) {
		var orderid = orderInfoData.orderid;
		$.ajax({
			type: "post",
			url: url + "/sysorder/queryPayResult.action",
			async: false,
			data: {
				orderid: orderid
			},
			success: function(data) {
				data = JSON.parse(data);
				if(data.orderpaystate == 6) {
					$('.mui-content h2 b').text('订单支付中!');
				} else if(data.orderpaystate == 3) {
					$('.mui-content h2 b').text('订单支付成功!');
				}
			}
		});
	}
}
//从url中获取参数值
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}