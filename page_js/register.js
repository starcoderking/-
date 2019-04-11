var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数
$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	//	文本框失去焦点时
	$('#uname').blur(unameCheck);
	$('#phone').blur(phoneCheck);
//	$('#ver_code').blur(codeCheck);
	$('#upwd').blur(pwdCheck);
	$("#upwd2").blur(pwdCheck2);
	//点击用户注册协议复选框时，控制注册按钮是否可用
	$(".li_checkbox input").click(function() {
		$(".li_btn>button").prop("disabled", !$(this).prop("checked")).toggleClass("disabled");
	});
	//	获取验证码
	$('.ver_code>button').click(function() {
		if(phoneCheck()) {
			sendMessage();
		} else {
			$("#phone").siblings("i").show().text("请输入合理的手机号");
		}
	})
	//提交注册
	$(".li_btn>button").click(function() {
		var U = new Url();
		var S = new Store();
		var uname = $.trim($("#uname").val());
		var phone = $.trim($("#phone").val());
		var pwd = $.trim($("#upwd").val());
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
//					console.log(data);
					if(data.result==1){
						S.set('userId',data.userid);
						if(data.loginusername!=''){
							S.set('uname',data.loginusername);
						}else{
							S.set('uname',data.phonenumber);
						}
						var classid = GetQueryString('classid');//判断来源是否为试听课
						if(classid!=null){
							location.href='trial_lesson_buy.html?classid='+classid;
						}else{
							location.href='personal_center.html';
						}
					}else{
						SimplePop.alert(data.reason);
					}
				}
			});
		}
	});
});
//验证用户名
function unameCheck() {
	var uname = $.trim($("#uname").val());
	if(!uname) {
		$("#uname").siblings("i").show().text("请输入用户名");
		return false;
	} else if(!unameExist(uname)) {
		$("#uname").siblings("i").show().text("该用户名已经被注册");
		return false;
	} else {
		$("#uname").siblings("i").hide();
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
//验证手机号
function phoneCheck() {
	var phone = $.trim($("#phone").val());
//	var regPhone = /^(13[0-9]|15[0-9]|18[0-9]])\d{8}$/;
	var regPhone =  /^1[3|4|5|8][0-9]\d{8}$/;
	if(!phone) {
		$("#phone").siblings("i").show().text("请填写您的手机号");
		return false;
	} else if(!regPhone.test(phone)) {
		$("#phone").siblings("i").show().text("请输入正确的手机号码");
		return false;
	} else if(!phoneExist(phone)) {
		$("#phone").siblings("i").show().text("此手机号已被其他用户绑定");
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
	var code = $.trim($("#ver_code").val());
	var cun_code = S.get('code');
	if(!code) {
		$("#ver_code").siblings("i").show().text("验证码不能为空");
		return false;
	} else if(code != cun_code) {
		$("#ver_code").siblings("i").show().text("验证码不正确");
		return false;
	} else {
		$("#ver_code").siblings("i").hide();
		return true;
	}
}

function sendMessage() {　
	var S = new Store();
	curCount = count;　　 //设置button效果，开始计时
	$(".ver_code>button").attr("disabled", "true");
	$(".ver_code>button").text(curCount + "秒后再次发送");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
	//向后台发送处理数据
	var phone = $.trim($("#phone").val());
	$.ajax({　　
		type: "POST", //用POST方式传输
		dataType: "text", //数据格式:JSON
		url: url+'/registered/getVerificationCode.action ', //目标地址
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
		$(".ver_code>button").removeAttr("disabled"); //启用按钮
		$(".ver_code>button").text("重新发送验证码");
	} else {
		curCount--;
		$(".ver_code>button").text(curCount + "秒后再次发送");
	}
}
//验证密码
function pwdCheck() {
	var pwdSize = $.trim($("#upwd").val()).length;
	if(!pwdSize) { //密码为空时
		$("#upwd").siblings("i").show().text("请输入您的密码");
		return false;
	}else {
		$("#upwd").siblings("i").hide();
		return true;
	}
}
//验证重复密码
function pwdCheck2() {
	var pwd = $.trim($("#upwd").val());
	var pwd2 = $.trim($("#upwd2").val());
	if(pwdCheck()) {
		if(pwd != pwd2) {
			$("#upwd2").siblings("i").show().text("两次输入的密码不一致");
			return false;
		} else {
			$("#upwd2").siblings("i").hide();
			return true;
		}
	}
}
//从url中获取参数
function GetQueryString(name){	
　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　var r = window.location.search.substr(1).match(reg);
　　if(r!=null)return  decodeURI(r[2]); return null;
}