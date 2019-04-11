$(function() {
	var S = new Store();
	var I = new Interfaces();
	$('.pwd').blur(pwdCheck);
	$('.pwd1').blur(pwdCheck1);
	$(".pwd2").blur(pwdCheck2);
	$('.submit').click(function() {
		var userid = S.get('userid');
		var oldPwd = $('.pwd').val();
		var newPwd = $('.pwd2').val();
		var data_json = {
			'userid': userid,
			'oldpasswords': oldPwd,
			'newpasswords': newPwd
		};
		var result = I.change_pwd(data_json);
		result = JSON.parse(result);
		if(result.result == 1) {
			alert('更改成功');
		} else {
			alert('更改失败！！！');
		}
	});
});
//密码验证
function pwdCheck() {
	var pwdSize = $.trim($(".pwd").val()).length;
	if(!pwdSize) { //密码为空时
		$.alertView("请输入您的原密码");
		return false;
	} else if(pwdSize < 6 || pwdSize > 12) {
		$.alertView("6~12个字符之间");
		return false;
	} else {
		return true;
	}
}
//密码验证
function pwdCheck1() {
	var pwdSize = $.trim($(".pwd1").val()).length;
	if(pwdCheck()) {
		if(!pwdSize) { //密码为空时
			$.alertView("请输入您的新密码");
			return false;
		} else if(pwdSize < 6 || pwdSize > 12) {
			$.alertView("6~12个字符之间");
			return false;
		} else {
			return true;
		}
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
			$('.submit').attr('disabled', false);
			return true;
		}
	}
}