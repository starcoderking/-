var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数
$(function(){
	$('.header_box').load('header.html', function() {
		main();
	});
	$('#phone').blur(phoneCheck);
	$('#upwd').blur(pwdCheck);
	$('#upwd2').blur(pwdCheck2);
		//	获取验证码
	$('.ver_code>button').click(function() {
		if(phoneCheck()) {
			sendMessage();
		} else {
			$("#phone").siblings("i").show().text("请输入合理的手机号");
		}
	});
	$('.save button').click(function(){
		if(phoneCheck()&&pwdCheck()&&pwdCheck2()){
			var phoneNumber = $.trim($('#phone').val());
			var verCode = $.trim($('#ver_code').val());
			var pwd = $.trim($('#upwd2').val());
			$.ajax({
				type:"post",
				url:url+"/registered/resetPassword.action",
				async:false,
				data:{newpasswords:pwd,newsmsmess:verCode,phonenumber:phoneNumber},
				success:function(data){
					data = JSON.parse(data);
					if(data.result==1){
//						显示提示框
						$('.mask').show();
						$('.promptInfo').show();
					}else if(data.result==2){
						SimplePop.alert('验证码不正确！');
					}else if(data.result==3){
						SimplePop.alert('验证码超时！');
					}
				}
			});
		}
	});
//	隐藏提示框
	$('.promptInfo button').click(function(){
		$('.mask').hide();
		$('.promptInfo').hide();
		location.href = 'login.html';
	});
})
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
	}else {
		$("#phone").siblings("i").hide();
		return true;
	}
}
//发送验证短信
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
		url: url+'/registered/forGetPassword.action', //目标地址
		data: {
			phonenumber: phone
		},
		success: function(data) {
//			console.log(data);
			data = JSON.parse(data);
			if(data.result==3){
				//S.set('code', data);
			}else if(data.result==1){
				SimplePop.alert('该手机号未注册!');
			}else if(data.result==2){
				SimplePop.alert('发送失败!');
			}
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
