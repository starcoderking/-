var count = 60; //间隔函数，1秒执行
var curCount; //当前剩余秒数
$(function(){
	$('.phone').blur(phoneCheck);
	$('.pwd1').blur(pwdCheck);
	$('.pwd2').blur(pwdCheck2);
		//	获取验证码
	$('.send-code').click(function() {
		if(phoneCheck()) {
			sendMessage();
		} else {
			$.alertView('请输入合理的手机号');
		}
	});
	$('.save').click(function(){
		if(phoneCheck()&&pwdCheck()&&pwdCheck2()){
			var phoneNumber = $.trim($('.phone').val());
			var verCode = $.trim($('.ver-code').val());
			var pwd = $.trim($('.pwd2').val());
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
					}else if(data.result==2){
						$.alertView('验证码不正确！');
					}else if(data.result==3){
						$.alertView('验证码超时！');
					}
				}
			});
		}
	});
//	隐藏提示框
	$('.promptInfo .true-login').click(function(){
		$('.mask').hide();
		$('.promptInfo').hide();
		location.href = 'login.html';
	});
})
//验证手机号
function phoneCheck() {
	var phone = $.trim($(".phone").val());
//	var regPhone = /^(13[0-9]|15[0-9]|18[0-9]])\d{8}$/;
	var regPhone =  /^1[3|4|5|8][0-9]\d{8}$/;
	if(!phone) {
		$.alertView('请输入手机号');
		return false;
	} else if(!regPhone.test(phone)) {
		$.alertView('手机号错误');
		return false;
	}else {
		return true;
	}
}
//发送验证短信
function sendMessage() {　
	var S = new Store();
	curCount = count;　　 //设置button效果，开始计时
	$(".send-code").attr("disabled", "true");
	$(".send-code").text(curCount + "秒后再次发送");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
	//向后台发送处理数据
	var phone = $.trim($(".phone").val());
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
				$.alertView('该手机号未注册!');
			}else if(data.result==2){
				$.alertView('发送失败!');
			}
		}
	});
}
//timer处理函数
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器
		$(".send-code").removeAttr("disabled"); //启用按钮
		$(".send-code").text("重新发送验证码");
	} else {
		curCount--;
		$(".send-code").text(curCount + "秒后再次发送");
	}
}
//验证密码
function pwdCheck() {
	var pwdSize = $.trim($(".pwd1").val()).length;
	if(!pwdSize) { //密码为空时
		$.alertView('请输入密码');
		return false;
	}else {
		return true;
	}
}
//验证重复密码
function pwdCheck2() {
	var pwd = $.trim($(".pwd1").val());
	var pwd2 = $.trim($(".pwd2").val());
	if(pwdCheck()) {
		if(pwd != pwd2) {
			$.alertView('两次输入密码不一致');
			return false;
		} else {
			return true;
		}
	}
}
