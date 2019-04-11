var S = new Store();
var scid = GetQueryString('classid');
var userid = S.get('userId');
var orderid = ''; //订单号
$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	event();
	showClassinfo(userid, scid);
	getCoupon(userid); //获取优惠券列表
	//	getCourse(userid, scid);
	$("#pay").click(function() {
		if($('#select_child li').length == 0) {
			SimplePop.alert('请添加学员信息');
			return false;
		}
		var youhuijuanid = $('#coupon option:checked').attr('data-couponid');
		var paymentmethod = $('.pay_way .radio').parent().find('span').attr('data-paymentmethod');
		var mbid = $("#select_child li div.radioSel").attr('data-mbid');
		$.ajax({
			type: "post",
			url: url + "/sysorder/pageOrderTrialVersion_web.action",
			async: false,
			data: {
				userid: userid,
				mbid: mbid,
				scid: scid,
				paymentmethod: paymentmethod,
				youhuijuanid: youhuijuanid,
				orderid: orderid,
				ordersource: 2
			},
			success: function(data) {
				//				console.log(data);
				S.set('orderInfoData', data);
				data = JSON.parse(data);
				if(data.result == 2) {
					SimplePop.alert(data.failreason);
				} else {
					if(paymentmethod == 2) {
						location.href = 'trial_lesson_wechatPay.html';
					} else {
						location.href = 'trial_lesson_aliPay.html';
					}
				}
			}
		});
	});
	$('#realcost').text(parseFloat($('#costmoney').text()) - $('#coupon').val() + '元');
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
function showClassinfo() {
	var classInfoHtml = '';
	$.ajax({
		type: "post",
		url: url + "/sysorder/pageOrderArrayInit.action",
		async: false,
		data: {
			userid: userid,
			scidarray: scid,
			ordersource: 2
		},
		success: function(data) {
			if(data != '' && data != '[]') {
				data = JSON.parse(data);
				//				console.log(data);
				for(var i = 0; i < 4; i++) {
					classInfoHtml += '<li>' +
						'<ul>' +
						'<li>班级名称：<span>' + data.sclist[i].classname + '</span></li>' +
						'<li style="display:none;">上课时间：<span>' + data.sclist[i].explains + '</span></li>' +
						'<li>上课地点：' + data.sclist[i].schoolarea.schooladdress + '</li>' +
						'</ul>' +
						'</li>'
				}
				$('#userid').text(data.ruser.userid);
				$('#loginusername').text(data.ruser.phonenumber);
				$('#courseDetail>ul').html(classInfoHtml);
				orderid = data.sysorder.orderid;
				//学员信息 
				if(data.ruser.rmblist.length != 0) {
					var rmbHtml = '';
					//				$('.right h2:first-child').html('选择学员<buttin class="addStudent" style="float:right;color:#F39704;cursor:pointer;font-size:14px;">添加学员</button>')
					//				$('.select_title').html('<li><span>姓名</span><em>性别</em><i>学校名</i><div class="down btn">更多</div><div class="up btn">收起</div></li>');
					for(var j = 0; j < data.ruser.rmblist.length; j++) {
						if(data.ruser.rmblist[j].sex == 1) {
							sex = '男';
						} else {
							sex = '女';
						}
						if(j == 0) {
							rmbHtml += '<li><span>' + data.ruser.rmblist[j].membername + '</span>' +
								'<em>' + sex + '</em>' +
								'<i>' + data.ruser.rmblist[j].schoolname + '</i>' +
								'<div class="radio radioSel" data-mbid="' + data.ruser.rmblist[j].mbid + '"></div>' +
								'</li>'
						} else {
							rmbHtml += '<li><span>' + data.ruser.rmblist[j].membername + '</span>' +
								'<em>' + sex + '</em>' +
								'<i>' + data.ruser.rmblist[j].schoolname + '</i>' +
								'<div class="radio" data-mbid="' + data.ruser.rmblist[j].mbid + '"></div>' +
								'</li>'
						}
					}
					$("#select_child").html(rmbHtml);
				} else {
					$('.select_title').html('无学员信息请添加');
				}
				if($("#select_child li").length > 2) {
					$("#select_child").css('height', '62px');
					$(".down").show();
					$(".up").hide();
				}
				$(".select_child .radio").click(function() {
					$(this).addClass('radioSel');
					$(this).parent().siblings().find('div').removeClass('radioSel');
				});
			}
		}
	});
}

function event() {
	//	有更多学员时点击更多和收起事件
	$('.select_title').on('click', '.down', function() {
		$("#select_child").css('height', 'auto');
		$(".down").hide();
		$(".up").show();
	});
	$('.select_title').on('click', '.up', function() {
		$("#select_child").css('height', '62px');
		$(".down").show();
		$(".up").hide();
	});
	//	$('#card').change(function(){
	//		$('#realcost').text(costmoney-$('#card').val()-$('#coupon').val()+'元');
	//	});
	$('#coupon').change(function() {
		$('#realcost').text(parseFloat($('#costmoney').text()) - $('#coupon').val() + '元');
	});
	$("#ruturn").click(function() {
		history.go(-1);
	});
	//	添加学员
	$('.select_title').on('click', '.addStudent', function() {
		$('.mask').removeClass('none');
		//		$('.studentInfo').removeClass('none');
	});
	$('.right h2').on('click', '.addStudent', function() {
		$('.mask').removeClass('none');
		//		$('.studentInfo').removeClass('none');
	});
	$('.studentInfo>h3>span').click(function() {
		$('.mask').addClass('none');
		//		$('.studentInfo').addClass('none');
	});
	$('.saveStudentInfo').click(function() {
		if($('#membername').val == '' || $('#Wdate').val() == '') {
			SimplePop.alert('学员姓名生日必填！');
		} else {
			$('.mask').addClass('none');
			//			$('.studentInfo').addClass('none');
			addstudentInfo();
		}
	});
	//	选择支付方式的事件
	$(".pay_way .radio").click(function() {
		paymentmethod = $(this).parent().find('span').attr('data-paymentmethod');
		$(this).addClass('radioSel');
		$(this).parent().siblings().find('div').removeClass('radioSel');
	});
}
//添加学员
function addstudentInfo() {
	var membername = $.trim($("#membername").val());
	var gender = $.trim($("#choice_sex").val());
	var birthday = $.trim($(".Wdate").val());
	var school = $.trim($("#school").val());
	var like = $.trim($("#like").val());
	$.ajax({
		type: "post",
		url: url + "/registered/editRegisteredUsersMemberBody.action",
		async: false,
		data: {
			userid: userid,
			mbid: 0,
			membername: membername,
			sex: gender,
			dateofbirth: birthday,
			grade: '',
			schoolname: school,
			interests: like,
			remarks: ''
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data && data.result == 1) {
				SimplePop.alert('添加成功');
				showClassinfo();
			} else {
				SimplePop.alert('添加失败！');
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