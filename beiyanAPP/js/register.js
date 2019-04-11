var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数
$(function(){
	event();
//	失去焦点做验证
	$('.account').blur(unameCheck);
	$('.phone').blur(phoneCheck);
//	$('.pwd').blur(codeCheck);
	$('.pwd1').blur(pwdCheck);
	$(".pwd2").blur(pwdCheck2);
//	获取验证码
	$('.sendCode').click(function() {
		if(phoneCheck()) {
			sendCode();
		} else {
			$.alertView("请输入合理的手机号");
		}
	});
	$('button.next').click(function(){
		$('.pwd1').parents('div').removeClass('none');
		$('.pwd2').parents('div').removeClass('none');
		$(this).hide().siblings('button').show();
	})
	//提交注册
	$(".submit").click(function() {
		var U = new Url();
		var S = new Store();
		var uname = $.trim($(".account").val());
		var phone = $.trim($(".phone").val());
		var pwd = $.trim($(".pwd2").val());
//		var nickname = $.trim($('.nickname').val());
//		var fullname =  $.trim($('.fullname').val());
		if(unameCheck() && phoneCheck() && codeCheck() && pwdCheck()) {
			$.ajax({
				type: "post",
				url: url+"/registered/addRegisteredUsers.action ",
				async: false,
				data: {
					loginusername: uname,
					userspassword: pwd,
					phonenumber: phone,
					nickname: '',
					fullname: '',
					address: '',
					residentarea: ''
				},
				success: function(data) {
					data = JSON.parse(data);
					if(data.result==1){
						S.set('userid',data.userid);
						S.set('userType',1);
						S.set('uname',data.loginusername);
						location.href='my.html';
					}else{
						$.alertView(data.reason);
					}
				}
			});
		}
	});
});
function event(){
	$(".other i").click(function(){
		$(this).toggleClass("checked");
    	$(".submit").prop("disabled",$(this).prop("checked")).toggleClass("disabled");
  		if($('button.disabled').length==0){
  			$('.submit').attr('disabled',false);
	  	}else{
	  		$('.submit').attr('disabled',true);
	  	}
	});	
}
//验证用户名
function unameCheck() {
	var uname = $.trim($(".account").val());
	if(!uname) {
		$.alertView('用户名不能为空！');
		return false;
	} else if(!unameExist(uname)) {
		$.alertView('用户名已经被注册！');
		return false;
	} else {
		return true;
	}
}
function unameExist(uname) {
	var U = new Url();
	var back = false;
	$.ajax({
		type: "post",
		url: url+"/registered/checkLoginUserName.action",
		data: {
			loginusername: uname
		},
		async: false,
		success: function(d) {
			d = U.tJson(d);
			if(d.result == 1) { //用户名不存在
				back = true;
			} else {
				back = false;
			}
		}
	});
	return back;
}
//验证姓名
function fullnameCheck(){
	var fullname = $.trim($('.fullname').val());
	if(!fullname){
		$.alertView('姓名不能为空');
		return false;
	}else{
		return true;
	}
}
//验证手机号
function phoneCheck() {
	var phone = $.trim($(".phone").val());
//	var regPhone = /^(13[0-9]|15[0-9]|18[0-9]])\d{8}$/;
	var regPhone =  /^1[3|4|5|8][0-9]\d{8}$/;
	if(!phone) {
		$.alertView("请填写您的手机号");
		return false;
	} else if(!regPhone.test(phone)) {
		$.alertView("请输入正确的手机号码");
		return false;
	} else if(!phoneExist(phone)) {
		$.alertView("此手机号已被其他用户绑定");
		return false;
	} else {
		$("#phone").siblings("i").hide();
		return true;
	}
}
//验证手机号是否被注册
function phoneExist(phone) {
	var U = new Url();
	var back = false;
	$.ajax({
		type: "post",
		url: url+"/registered/checkPhoneNumber.action",
		async: false,
		data: {
			phonenumber: phone
		},
		success: function(d) {
			d = U.tJson(d);
			if(d.result == 1) {
				back = true;
			} else {
				back = false;
			}
		}
	});
	return back;
}
//验证码
function codeCheck() {
	var S = new Store();
	var code = $.trim($(".pwd").val());
	var cun_code = S.get('code');
	if(!code) {
		$.alertView("验证码不能为空");
		return false;
	} else if(code != cun_code) {
		$.alertView("验证码不正确");
		return false;
	} else {
		$('button.disabled').removeClass('disabled').attr('disabled',false);
		return true;
	}
}
function sendCode() {　
	var S = new Store();
	curCount = count;　　 //设置button效果，开始计时
	$(".sendCode").attr("disabled", "true");
	$(".sendCode").text(curCount + "秒后再次发送");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
	//向后台发送处理数据
	var phone = $.trim($(".phone").val());
	$.ajax({　　
		type: "POST", //用POST方式传输
		dataType: "text", //数据格式:JSON
		url : url+'/registered/getVerificationCode.action ', //目标地址
		data: {
			phonenumber: phone
		},
		success: function(data) {
			console.log(data);
			S.set('code', data);
		}
	});
}
//timer处理函数
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$(".sendCode").removeAttr("disabled"); //启用按钮
		$(".sendCode").text("重新发送验证码");
	} else {
		curCount--;
		$(".sendCode").text(curCount + "秒后再次发送");
	}
}
//验证密码
function pwdCheck() {
	var pwdSize = $.trim($(".pwd1").val()).length;
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
//验证重复密码
function pwdCheck2() {
	var pwd = $.trim($(".pwd1").val());
	var pwd2 = $.trim($(".pwd2").val());
	if(pwdCheck()) {
		if(pwd != pwd2) {
			$.alertView("两次输入的密码不一致");
			return false;
		} else {
			$('.submit').attr('disabled',false);
			return true;
		}
	}
}