$(function() {
	$('#uname').blur(unameCheck);
	$('#upwd').blur(pwdCheck);
	/*登录方式*/
	$("#login_way .radio").click(function() {
		$(".radio").removeClass('radioSel');
		$(this).addClass('radioSel');
	});
	$("#submit").click(function() {
		var U = new Url();
		var S = new Store();
		if(unameCheck() && pwdCheck()) {
			var uname = $.trim($('#uname').val());
			var upwd = $.trim($('#upwd').val());
			var classid = GetQueryString('classid');//判断来源?有：试听课
			//var typenum = $('#login_way input:checked').val();
			var typenum;
			if($(".radio").hasClass('radioSel')) {
				typenum = $(".radioSel").siblings('span').attr('data-value');
			}
			//			var vcode = $.trim($('#vcode').val());
			$.ajax({
				type: 'post',
				url: url + '/registered/registeredLogin_app.action',
				data: {
					phonenumber: uname,
					userspassword: upwd,
					typenum: typenum
				},
				success: function(data) {
					jsondata = JSON.parse(data);
					if(jsondata.result == 1) {
						if(jsondata.loginusername != '' && jsondata.loginusername != 'null') {
							S.set('uname', jsondata.loginusername);
						} else {
							S.set('uname', jsondata.phonenumber);
						}
						S.set('userid', jsondata.userid);
						S.set('userType', jsondata.type);//1为教师，2为普通会员
						if(classid && classid != '') {
							location.href = 'trial_lesson_buy.html?classid=' + classid;
						} else {
							location.href = 'index.html';
						}
					} else if(jsondata.result == 2) {
						$.alertView(data.reson);
					} else if(jsondata.result == 3) {
						S.set('logindata', jsondata);
						$('.mask').removeClass('none');
						$('.mask_content').removeClass('none');
					}
				}
			})
		}
	});
	$('.mask_content .yes').click(function() {
		$('.mask').addClass('none');
		$('.mask_content').addClass('none');
		synchronizeLogin();
	});
	$('.mask_content .no').click(function() {
		$('.mask').addClass('none');
		$('.mask_content').addClass('none');
	});
});
//同步北演信息登录
function synchronizeLogin() {
	var logindata = S.get('logindata');
	logindata = JSON.parse(logindata);
	$.ajax({
		type: "post",
		url: url + "/registered/confirmSyncLogin.action",
		async: false,
		data: {
			memberid: logindata.memberid,
			phonenumber: logindata.phonenumber,
			fullname: logindata.fullname,
			userid: logindata.userid
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.result == 1) {
				if(data.loginusername != 'null' && data.loginusername != 'undefined' && data.loginusername != '') {
					S.set('uname', data.loginusername);
				} else {
					S.set('uname', data.phonenumber);
				}
				S.set('userid', data.userid);
			}
			location.href = 'personal_center.html';
		}
	});
}
//验证用户名
function unameCheck() {
	var uname = $.trim($("#uname").val());
	if(!uname) {
		$.alertView("请输入用户名或手机号");
		return false;
	} else {
		return true;
	}
}
//验证手机号
/*function phoneCheck(){
  var phone= $.trim($("#phone").val());
  var regPhone= /^(13[0-9]|15[0-9]|18[0-9]])\d{8}$/;
  if(!phone){
    $.alertView("请填写您的手机号");
    return false;
  }else if(!regPhone.test(phone)){
    $.alertView("请输入正确的手机号码");
    return false;
  }else{
    return true;
  }
}*/
//验证密码
function pwdCheck() {
	var pwdSize = $.trim($("#upwd").val()).length;
	if(!pwdSize) { //密码为空时
		$.alertView("请输入您的密码");
		return false;
	} else if(pwdSize < 6 || pwdSize > 12) {
		$.alertView("密码长度应为6~12个字符之间");
		return false;
	} else {
		return true;
	}
}
//引导页动画函数
function adDis() {
	$('.ad').css({
		'height': $(window).height()
	});
	setTimeout("$('.ad').hide('slow')", 5000);
}
//登录验证码
function reloadVerifyCode() {
	var timenow = new Date().getTime();
	document.getElementById("captcha_img").src = url + "/servlet/VerificationCodeServlet?d=" + timenow;
}
//从url中获取参数
function GetQueryString(name){	
　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　var r = window.location.search.substr(1).match(reg);
　　if(r!=null)return  decodeURI(r[2]); return null;
}