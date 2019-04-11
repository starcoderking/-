function changepwd(){
	var S = new Store();
	$('#oldPwd').blur(pwdCheck);
	$('#upwd').blur(pwdCheck1);
	$("#upwd2").blur(pwdCheck2);
	$('.changePwd button').click(function() {
		var oldPwd = $('#oldPwd').val();
		var newPwd = $('#upwd2').val();
		var userid = S.get('userId');
		if(pwdCheck() && pwdCheck1() && pwdCheck2()) {
			$.ajax({
				type: "post",
				url: url + "/registered/editUsersPasswords.action",
				async: false,
				data: {
					userid: userid,
					oldpasswords: oldPwd,
					newpasswords: newPwd
				},
				success: function(data) {
					data = JSON.parse(data);
					if(data.result == 1) {
						SimplePop.alert('保存成功');
					} else {
						SimplePop.alert('保存失败！！！');
					}
				}
			});
		}
	});
}
//密码验证
function pwdCheck() {
	var pwdSize = $.trim($("#oldPwd").val()).length;
	if(!pwdSize) { //密码为空时
		$("#oldPwd").siblings("i").show().text("请输入您的密码");
		return false;
	} else if(pwdSize < 6 || pwdSize > 12) {
		$("#oldPwd").siblings("i").show().text("6~12个字符之间");
		return false;
	} else {
		$("#oldPwd").siblings("i").hide();
		return true;
	}
}

function pwdCheck1() {
	var pwdSize = $.trim($("#upwd").val()).length;
	if(!pwdSize) { //密码为空时
		$("#upwd").siblings("i").show().text("请输入您的密码");
		return false;
	} else if(pwdSize < 6 || pwdSize > 12) {
		$("#upwd").siblings("i").show().text("6~12个字符之间");
		return false;
	} else {
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
			$('.changePwd .save').removeClass('disabled').attr('disabled', false);
			return true;
		}
	}
}
