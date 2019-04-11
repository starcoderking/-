var S = new Store();
var userid = S.get('userid');
var orderid = '';
mui.init({
	swipeBack: true //启用右滑关闭功能  
});
jQuery(function() {
	jQuery('.header_box').load('header.html', function() {
		main();
		navText('特色课程');
	});
	var scid = GetQueryString('classid');
	getCoupon(); //获取优惠券
	getCourse(scid);
	event();
	document.getElementById("pay").addEventListener('tap', function() {
		//		判断是否有学员,无学员前往添加
		var studentNum = jQuery('#select_child option').length;
		if(studentNum == 0) {
			$.alertView("暂无学员信息，请添加学员");
			return false;
		}
		var paymentmethod = jQuery('.pay .radio:checked').parent().find('span').attr('data-paymentmethod');
		var mbid = $("#select_child option:checked").attr('data-mbid');
		var huimincardid = '';
		var length = $('#card input:checked').length; //选择使用的惠民卡数
		if(length == 0) {
			huimincardid = 0;
		} else {
			for(var i = 0; i < length; i++) {
				if(i == 0) {
					huimincardid = $('#card input:checked').eq(i).attr('data-huimincardid');
				} else {
					huimincardid += ',' + $('#card input:checked').eq(i).attr('data-huimincardid');
				}
			}
		}
		var youhuijuanid = $('#coupon option:checked').attr('data-couponid');
		if(youhuijuanid && youhuijuanid != undefined) {
			youhuijuanid = youhuijuanid;
		} else {
			youhuijuanid = 0;
		}
		$.ajax({
			type: "post",
			url: url + "/sysorder/pageOrderClearing_h5.action",
			async: false,
			data: {
				userid: userid,
				mbid: mbid,
				scid: scid,
				paymentmethod: paymentmethod,
				ordersource: 4,
				orderid:orderid,
				huimincardid: huimincardid,
				youhuijuanid: youhuijuanid
			},
			success: function(data) {
				S.set('orderInfoData', data);
				data = JSON.parse(data);
				if(data.result == 2) {
					$.alertView(data.failreason);
				} else {
					location.href = "transaction-detail.html";
				}
			}
		});
		//location.href="transaction-detail.html?mblist="+mblist+"&paymentmethod="+paymentmethod+"&scid="+scid+"&huimincardid="+huimincardid;
	});
	calculatePrice();
});
function getCourse(scid) {
	var rmbHtml = '';
	var cardHtml = '';
	var sex = '';
	jQuery.ajax({
		type: "post",
		url: url + "/sysorder/pageOrderInit.action",
		async: false,
		data: {
			'userid': userid,
			'scid': scid,
			ordersource: 4
		},
		success: function(data) {
			data = JSON.parse(data);
			//			console.log(data);
			if(data.result == 1) {
				orderid = data.sysorder.orderid;//订单编号
				//课程详情信息
				jQuery(".top-info img").attr('src', data.sclist[0].courese.coursepicture);
				jQuery("#teacher").text(data.sclist[0].courese.parentspecialtyname);
				jQuery("#specialtyname").text(data.sclist[0].courese.specialtyname);
				if(data.sclist[0].courese.courseopendata != '') {
					jQuery("#courseopendata").text(data.sclist[0].courese.courseopendata);
				} else {
					jQuery("#courseopendata").text('待教务老师通知');
				}
				if(data.sclist[0].schoolarea.schooladdress != null) {
					$("#schoolarea").text(data.sclist[0].schoolarea.schooladdress);
				} else {
					$("#schoolarea").text(data.sclist[0].schoolarea.schoolareaname);
				}
				$("#cost").text(data.sclist[0].cost / 100);
				//学员信息 
				for(var j = 0; j < data.ruser.rmblist.length; j++) {
					rmbHtml += '<option value="' + (j + 1) + '" data-mbid="' + data.ruser.rmblist[j].mbid + '">' + data.ruser.rmblist[j].membername + '</option>'
				}
				jQuery("#select_child").html(rmbHtml);
				//订单详情
				jQuery("#userid").text(data.ruser.userid);
				jQuery("#loginusername").text(data.ruser.loginusername);
				jQuery("#registrationdate").text(data.sysorder.createtime);
				jQuery("#costmoney").text(data.sysorder.ordermoney / 100 + '元');
				if(data.ruser.hclist.length != 0) {
					for(var k = 0; k < data.ruser.hclist.length; k++) {
						var hmCardMoney = parseFloat(data.ruser.hclist[k].cardmoney / 100);
						if(k == 0) {
							cardHtml += '<p><input checked="checked" type="checkbox" name="huiminCard" data-huimincardid="' + data.ruser.hclist[k].huimincardid + '" value="' + hmCardMoney + '" /><span>-' + hmCardMoney + '元</span></p>'
						} else {
							cardHtml += '<p><input type="checkbox" name="huiminCard" data-huimincardid="' + data.ruser.hclist[k].huimincardid + '" value="' + hmCardMoney + '" /><span>-' + hmCardMoney + '元</span></p>'
						}
					}
					jQuery("#card").html(cardHtml);
				} else {
					jQuery("#card").parent('li').hide();
				}
			}else{
				mui.alert(data.failreason);
			}
		}
	});
}
//事件
function event() {
	//	惠民卡选择事件
	$('#huiminCard').on('click', 'input', function() {
		calculatePrice();
	});
	//	优惠券选择事件
	$('#coupon').change(function() {
		calculatePrice();
	});
}
//获取优惠券列表
function getCoupon() {
	var couponHtml = '';
	jQuery.ajax({
		type: "post",
		url: url + "/coupons/getCouponsList.action",
		async: false,
		data: {
			userid: userid,
			ctype: 2 //普通课优惠券
		},
		success: function(data) {
			console.log(data);
			if(data != '' && data != 'null' && data != 'undefined' && data != '[]') {
				data = JSON.parse(data);
				jQuery.each(data, function(i, item) {
					var couponMoney = parseFloat(item.couponsmoney / 100);
					if(i == 0) {
						couponHtml += '<option selected="selected" value="' + couponMoney + '" data-couponid="' + item.id + '">' + couponMoney + '元</option>'
					} else {
						couponHtml += '<option value="' + couponMoney + '" data-couponid="' + item.id + '">' + couponMoney + '元</option>'
					}
				});
				couponHtml = '<option value="0" data-couponid="0">不使用优惠券</option>' + couponHtml;
				jQuery('#coupon').html(couponHtml);
			} else {
				$('#coupon').parent('li').hide();
			}
		}
	});
}
//计算实付金额
function calculatePrice() {
	var originalPrice = parseFloat($('#costmoney').text()); //应付金额
	var currentPrice = originalPrice; //实付金额
	var huiminPrice = ''; //惠民卡抵扣金额
	var couponPrice = ''; //优惠券抵用金额
	var length = $('#card input:checked').length;
	if(length != 0) {
		for(var i = 0; i < length; i++) {
			currentPrice = currentPrice - $('#huiminCard input:checked').eq(i).val();
		}
	}
	currentPrice = currentPrice - $('#coupon').val();
	if(currentPrice < 0) {
		currentPrice = 0;
	}
	$('#realcost').text(currentPrice + '元');
}
//从url中获取参数值
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}