var S = new Store();
var orderid = '';//订单号
$(function() {
	event();
	var scid = GetQueryString('classid');
	var userid = S.get('userid');
	showClassinfo(userid, scid);
	getCoupon(userid); //获取优惠券列表
	//	getCourse(userid, scid);
	$("#pay").click(function() {
		var studentNum = jQuery('#select_child option').length;
		if(studentNum == 0) {
			$.alertView("暂无学员信息，请添加学员");
			return false;
		}
		var youhuijuanid = $('#coupon option:checked').attr('data-couponid');
		var mbid = $("#select_child option:checked").attr('data-mbid');
		$.ajax({
			type: "post",
			url: url + "/sysorder/pageOrderTrialVersion_h5.action",
			async: false,
			data: {
				userid: userid,
				mbid: mbid,
				scid: scid,
				paymentmethod: 2,
				youhuijuanid: youhuijuanid,
				orderid: orderid,
				ordersource:4
			},
			success: function(data) {
				S.set('orderInfoData', data);
				data = JSON.parse(data);
				//console.log(data);
				if(data.result == 2) {
					$.alertView(data.failreason);
				} else {
					location.href = 'transaction-detail.html';
				}
			}
		});
	});
	//	$("#ruturn").click(function(){
	//		history.go(-1);
	//	});
	$('#realcost').text(parseFloat($('#costmoney').text()) - $('#coupon').val() + '元');
	//	监听支付状态
	//	setInterval(function(){coursePayStatus()},3000);
});
//获取优惠券列表
function getCoupon(userid) {
	var couponHtml = '';
	$.ajax({
		type: "post",
		url: url + "/coupons/getCouponsList.action",
		async: false,
		data: {
			userid: userid,
			ctype: 1 //试听课优惠券
		},
		success: function(data) {
			if(data != '' && data != 'null' && data != 'undefined' && data != '[]') {
				data = JSON.parse(data);
				$.each(data, function(i, item) {
					var couponMoney = parseFloat(item.couponsmoney / 100);
					if(i == 0) {
						couponHtml += '<option selected="selected" value="' + couponMoney + '" data-couponid="' + item.id + '">' + couponMoney + '元</option>'
					} else {
						couponHtml += '<option value="' + couponMoney + '" data-couponid="' + item.id + '">' + couponMoney + '元</option>'
					}
				});
				couponHtml = '<option value="0" data-couponid="0">不使用优惠券</option>' + couponHtml;
			} else {
				couponHtml = '<option value="0" data-couponid="0">无可用优惠券</option>'
			}
			$('#coupon').html(couponHtml);
		}
	});
}
//显示课程信息
function showClassinfo(userid, scidarray) {
	var S = new Store();
	var classInfoHtml = '';
	var rmbHtml = '';
	$.ajax({
		type: "post",
		url: url + "/sysorder/pageOrderArrayInit.action",
		async: false,
		data: {
			userid: userid,
			scidarray: scidarray,
			ordersource: 4
		},
		success: function(data) {
			if(data != 'null') {
				data = JSON.parse(data);
				orderid = data.sysorder.orderid;
				for(var i = 0; i < 4; i++) {
					classInfoHtml += '<tr>' +
						'<td>' + data.sclist[i].classname + '</td>' +
						'<td>' + data.sclist[i].explains + '</td>' +
						'<td>' + data.sclist[i].schoolarea.schooladdress + '</td>' +
						'</tr>'
				}
				$('#userid').text(data.ruser.userid);
				$('.lesson-list tbody').html(classInfoHtml);
				//学员
				for(var j = 0; j < data.ruser.rmblist.length; j++) {
					rmbHtml += '<option value="' + (j + 1) + '" data-mbid="' + data.ruser.rmblist[j].mbid + '">' + data.ruser.rmblist[j].membername + '</option>'
				}
				jQuery("#select_child").html(rmbHtml);
			}
		}
	});
}
function event() {
	//	$('#card').change(function(){
	//		$('#realcost').text(costmoney-$('#card').val()-$('#coupon').val()+'元');
	//	});
	$('#coupon').change(function() {
		$('#realcost').text(parseFloat($('#costmoney').text()) - $('#coupon').val() + '元');
	});
}
//从url中获取参数值
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}