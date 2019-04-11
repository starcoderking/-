var S = new Store();
var scid = GetQueryString('classid');
var userid = S.get('userId');
var orderid = '';//订单编号
$(function() {
	$('.header_box').load('header.html', function() {
		main();
		navText('特色课程');
	});
	getCoupon(userid); //获取优惠券列表
	getCourse(userid, scid);
	$("#pay").click(function() {
		if($('#select_child li').length==0){
			SimplePop.alert('请添加学员信息');
			return false;
		}
		var paymentmethod = $('.pay_way .radioSel').parent().find('span').attr('data-paymentmethod');
		var mbid = $("#select_child li div.radioSel").attr('data-mbid');
		var huimincardid = '';
		var length = $('#huiminCard input:checked').length;//选择使用的惠民卡数
		if(length==0){
			huimincardid = 0;
		}else{
			for(var i=0;i<length;i++){
				if(i==0){
					huimincardid = 	$('#huiminCard input:checked').eq(i).attr('data-huimincardid');
				}else{
					huimincardid+=','+$('#huiminCard input:checked').eq(i).attr('data-huimincardid');
				}
			}
		}
		var youhuijuanid = $('#coupon option:checked').attr('data-couponid');
		if(youhuijuanid&&youhuijuanid!=undefined){
			youhuijuanid = youhuijuanid;
		}else{
			youhuijuanid = 0;
		}
		$.ajax({
			type: "post",
			url: url + "/sysorder/pageOrderClearing.action",
			async: false,
			data: {
				userid: userid,
				mbid: mbid,
				scid: scid,
				paymentmethod: paymentmethod,
				ordersource: 2,
				orderid:orderid,
				huimincardid: huimincardid,
				youhuijuanid: youhuijuanid
			},
			success: function(data) {
				S.set('orderInfoData', data);
				data = JSON.parse(data);
				if(data.result == 2) {
					SimplePop.alert(data.failreason);
				} else {
					if(paymentmethod == 2) {
						location.href = 'wechatPay.html?source=2';
					} else {
						location.href = 'aliPay.html?source=2';
					}
				}
			}
		});
	});
	calculatePrice();
	event();
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
			ctype:2			//普通课优惠券
		},
		success: function(data) {
			if(data != '' && data != 'null' && data != 'undefined'&& data!='[]') {
				data = JSON.parse(data);
				$.each(data, function(i, item) {
					var couponMoney = parseFloat(item.couponsmoney / 100);
					if(i == 0) {
						couponHtml += '<option selected="selected" value="' + couponMoney + '" data-couponid="' + item.id + '">-' + couponMoney + '元</option>'
					} else {
						couponHtml += '<option value="' + couponMoney + '" data-couponid="' + item.id + '">-' + couponMoney + '元</option>'
					}
				});
				couponHtml = '<option value="0" data-couponid="0">不使用优惠券</option>' + couponHtml;
			} else {
				$('#coupon').parent('span').parent('li').hide();
			}
			$('#coupon').html(couponHtml);
		}
	});
}
function getCourse(userid, scid) {
	var rmbHtml = '';
	var cardHtml = '';
	var sex = '';
	$.ajax({
		type: "post",
		url: url + "/sysorder/pageOrderInit.action",
		async: false,
		data: {
			'userid': userid,
			'scid': scid,
			 ordersource:2
		},
		success: function(data) {
			data = JSON.parse(data);
//			console.log(data);
			orderid = data.sysorder.orderid;//订单编号
			//课程详情信息
			$("#courseDetail img").attr('src', data.sclist[0].courese.coursepicture);
			$("#courseDetail h3").text(data.sclist[0].courese.coursename);
			$("#teacher").text(data.sclist[0].courese.parentspecialtyname);
			$("#specialtyname").text(data.sclist[0].courese.specialtyname);
			if(data.sclist[0].courese.courseopendata!=''&&data.sclist[0].courese.courseopendata!=undefined){
				$("#courseopendata").text(data.sclist[0].courese.courseopendata);
			}else{
				$("#courseopendata").text('待教务老师通知');
			}
			if(data.sclist[0].schoolarea.schooladdress != null) {
				$("#schoolarea").text(data.sclist[0].schoolarea.schooladdress);
			} else {
				$("#schoolarea").text(data.sclist[0].schoolarea.schoolareaname);
			}
			$("#cost").text(data.sclist[0].cost / 100);
			//学员信息 
			if(data.ruser.rmblist.length != 0) {
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
			}else{
				$('.select_title').html('无学员信息请添加');
			}
			//订单详情
			$("#userid").text(data.ruser.userid);
			$("#loginusername").text(data.ruser.loginusername);
			$("#registrationdate").text(data.sysorder.createtime);
			$("#costmoney").text(data.sysorder.ordermoney / 100 + '元');
			if(data.ruser.hclist.length != 0) {
				for(var k = 0; k < data.ruser.hclist.length; k++) {
					var hmCardMoney = parseFloat(data.ruser.hclist[k].cardmoney / 100);
					if(k == 0) {
						cardHtml += '<p><input checked="checked" type="checkbox" name="huiminCard" data-huimincardid="'+data.ruser.hclist[k].huimincardid+'" value="'+hmCardMoney+'" /><span>-'+hmCardMoney+'元</span></p>'
					} else {
						cardHtml += '<p><input type="checkbox" name="huiminCard" data-huimincardid="'+data.ruser.hclist[k].huimincardid+'" value="'+hmCardMoney+'" /><span>-'+hmCardMoney+'元</span></p>'
					}
				}
			} else {
				$('#huiminCard').parent('li').hide();
			}
			$("#huiminCard").html(cardHtml);
		}
	});
	if($("#select_child li").length > 2) {
		$("#select_child").css('height', '62px');
		$(".down").show();
		$(".up").hide();
	}
	$(".select_child .radio").click(function() {
		$(this).addClass('radioSel');
		$(this).parent().siblings().find('div').removeClass('radioSel');
	});
//	mblist = $("#select_child li div.radioSel").attr('data-mbid');
}

function event() {
	$('.select_title').on('click','.down',function(){
		$("#select_child").css('height', 'auto');
		$(".down").hide();
		$(".up").show();
	});
	$('.select_title').on('click','.up',function(){
		$("#select_child").css('height', '62px');
		$(".down").show();
		$(".up").hide();
	});
//	惠民卡选择事件
	$('#huiminCard').on('click','input',function(){
		calculatePrice();
	});
//	优惠券选择事件
	$('#coupon').change(function() {
		calculatePrice();
	});
	$('.select_title').on('click','.addStudent',function(){
		$('.mask').removeClass('none');
		$('.studentInfo').removeClass('none');
	});
	$('.right h2').on('click','.addStudent',function(){
		$('.mask').removeClass('none');
		$('.studentInfo').removeClass('none');
	});
	$('.studentInfo>h3>span').click(function(){
		$('.mask').addClass('none');
		$('.studentInfo').addClass('none');
	});
	$('.saveStudentInfo').click(function(){
		if($('#membername').val=='' || $('#Wdate').val()==''){
			SimplePop.alert('学员姓名生日必填！');
		}else{
			$('.mask').addClass('none');
			$('.studentInfo').addClass('none');
			addstudentInfo();
		}
	});
	$(".pay_way .radio").click(function() {
		$(this).addClass('radioSel');
		$(this).parent().siblings().find('div').removeClass('radioSel');
	});
}
//计算实付金额
function calculatePrice(){
	var originalPrice = parseFloat($('#costmoney').text());//应付金额
	var currentPrice=originalPrice;//实付金额
	var huiminPrice='';//惠民卡抵扣金额
	var couponPrice='';//优惠券抵用金额
	var length=$('#huiminCard input:checked').length;
	if(length!=0){
		for(var i=0;i<length;i++){
			currentPrice = currentPrice-$('#huiminCard input:checked').eq(i).val();
		}
	}
	currentPrice = currentPrice-$('#coupon').val();
	if(currentPrice<0){
		currentPrice = 0;
	}
	$('#realcost').text(currentPrice+'元');
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
				getCourse(userid, scid);
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