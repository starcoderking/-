var schedule_arr; //保存课程表数组
var S = new Store();
var U = new Url();
//var userid = S.get('userId'); //用户id
var userid = 26;
var avatarImg = ''; //用来存储自己头像的链接
var teacherImg = ''; //用来存储聊天教师的头像链接
var time = ''; //用来存储查询聊天记录的时间
$(function() {
	//	页头加载
	$('.header_box').load('header.html', function() {
		main();
	});
	$('.detail').load('./personalCenter/personal_info.html',function(){
		personalInfo();
//		editEvent();
	});
	//	左侧导航项对应显示内容
	$('.nav ul li').click(function() {
		if($(this).index()==1){
			$('.detail').load('./personalCenter/changePwd.html',function(){
				changepwd();
			});
		}else if($(this).index()==0){
			$('.detail').load('./personalCenter/personal_info.html',function(){
				personalInfo();
				editEvent();
			});
		}else if($(this).index()==2){
			$('.detail').load('./personalCenter/student_info.html',function(){
				studentInit();
			});
		}else if($(this).index()==3){
			$('.detail').load('./personalCenter/mySchedule.html',function(){
				scheduleInit();
			});
		}else if($(this).index()==4){
			$('.detail').load('./personalCenter/my_order.html',function(){
				orderInit();
			});
		}else if($(this).index()==5){
			$('.detail').load('./personalCenter/my_message.html',function(){
				messageInit();
			});
		}else if($(this).index()==6){
			$('.detail').load('./personalCenter/my_coupon.html',function(){
				couponInit();
			});
		}else if($(this).index()==7){
			$('.detail').load('./personalCenter/my_huiminCard.html',function(){
				huiminCardInit();
			});
		}else if($(this).index()==8){
			$('.detail').load('./personalCenter/user_guide.html',function(){
			});
		}
		if($(this).hasClass('current')) {
			return false;
		} else {
			$(this).addClass('current').siblings('li').removeClass('current');
			var i = $(this).index();
			$('.detail>div').eq(i).show().siblings().hide();
			$('.container input').attr('disabled', true);
			$('.changePwd input').attr('disabled', false);
			$('.save').addClass('none');
			$('.edit').removeClass('none');
		}
	});
//	判断如果是试听课跳过来的直接订单选中
	var sourse = GetQueryString('sourse');
	if(sourse && sourse.indexOf('试听课')>-1){
		$('.nav ul li').eq(4).trigger('click');
	}
});
//从url中获取参数
function GetQueryString(name){	
　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　var r = window.location.search.substr(1).match(reg);
　　if(r!=null)return  decodeURI(r[2]); return null;
}
//验证用户名函数
function isRegisterUserName(s){   
var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;   
	if (!patrn.exec(s)) return false 
	return true 
}
function editEvent() { //编辑会员和学员信息事件
	$('input').attr('disabled', true);
	$('.changePwd input').attr('disabled', false);
	//	个人信息学员信息编辑
	$('.personal_info .edit').click(function() {
		$('.edit_avatar').show();
		$('.personal_info input').attr('disabled', false);
		if($('#nickname').val() !=''){
			$('#nickname').attr('disabled',true);
		}
		$(this).addClass('none');
		$('.personal_info .save').removeClass('none');
	});
	$('.personal_info .save').click(function() {
		subimtBtn(); //调取修改头像函数
		savePersonalInfo();//调取修改个人信息函数
		$('.edit_avatar').hide();
		$('.personal_info input').attr('disabled', true);
		$(this).addClass('none');
		$('.personal_info .edit').removeClass('none');
	});
	$('.student_info .edit').click(function() {
		$('.student_info input').attr('disabled', false);
		$(this).addClass('none');
		$('.student_info .save').removeClass('none');
	});
	$('.student_info .save').click(function() {
		$('.student_info input').attr('disabled', true);
		$(this).addClass('none');
		$('.student_info .edit').removeClass('none');
	});
//	用户名失去焦点时进行验证
	$('#nickname').blur(function(){
		var loginusername = $(this).val();
		var s=isRegisterUserName(loginusername);
		if(loginusername==''){
			SimplePop.alert('用户名不能为空');
		}else{
			if(s){
				return false;
			}else{
				SimplePop.alert('用户名不符合规则');
			}
		}
	})
}
//时间戳转换成日期格式函数
function fmtDate(obj) {
	var date = new Date(obj);
	var y = 1900 + date.getYear();
	var m = "0" + (date.getMonth() + 1);
	var d = "0" + date.getDate();
	return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}
//时间戳转换成日期到秒
function formatDateTimeSecond(inputTime) {
	var date = new Date(inputTime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};


//获取系统时间用来查询聊天记录
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}

//订单

