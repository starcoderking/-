var S = new Store();
var classid = GetQueryString('classid');//判断来源?有：试听课
$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	if(classid!=null){
		$('.reg').attr('href','register.html?classid='+classid);
	}
	reloadVerifyCode();//初始换验证码
	$('#uname').blur(unameCheck);
	$('#upwd').blur(pwdCheck);
	$('.li_btn button').click(function() {
		var U = new Url();
		if(unameCheck() && pwdCheck()) {
			var uname = $.trim($('#uname').val());
			var upwd = $.trim($('#upwd').val());
			var typenum = $('#choice_login_way input:checked').val();
			var vcode = $.trim($('#vcode').val());
			$.ajax({
				type: 'post',
				url: url + '/registered/registeredLogin.action',
				data: {
					phonenumber: uname,
					userspassword: upwd,
					typenum:typenum,
					vcode:vcode
				},
				success: function(data) {
					jsondata=JSON.parse(data);
					if(jsondata.result == 1) {
						if(jsondata.loginusername!=''&&jsondata.loginusername!='null'){
							S.set('uname', jsondata.loginusername);
						}else{
							S.set('uname', jsondata.phonenumber);
						}
						S.set('userId', jsondata.userid);
						if(classid&&classid!=''){
							location.href='trial_lesson_buy.html?classid='+classid;
						}else{
							location.href = 'index.html';
						}
					} else if(jsondata.result==2){
						$('#captcha_img').trigger('click');
						SimplePop.alert(jsondata.reason);
//						$('#uname').siblings('i').show().text('用户名或密码不正确');
					}else if(jsondata.result==3){
						$('#captcha_img').trigger('click');
						S.set('logindata',data);
						$('.mask').removeClass('none');
						$('.mask_content').removeClass('none');
					}
				}
			})
		}
	});
	$('.mask_content .yes').click(function(){
		$('.mask').addClass('none');
		$('.mask_content').addClass('none');
		synchronizeLogin();
	});
	$('.mask_content .no').click(function(){
		$('.mask').addClass('none');
		$('.mask_content').addClass('none');
	});
});
//同步北演信息登录
function synchronizeLogin(){
	var logindata = S.get('logindata');
	logindata = JSON.parse(logindata);
	$.ajax({
		type:"post",
		url:url+"/registered/confirmSyncLogin.action",
		async:false,
		data:{memberid:logindata.memberid,phonenumber:logindata.phonenumber,fullname:logindata.fullname,userid:logindata.userid},
		success:function(data){
			data = JSON.parse(data);
			if(data.result==1){
				if(data.loginusername!='null'&&data.loginusername!='undefined'&&data.loginusername!=''){
					S.set('uname', data.loginusername);
				}else{
					S.set('uname', data.phonenumber);
				}
				S.set('userId', data.userid);
			}
			location.href = 'personal_center.html';
		}
	});
}
function unameCheck(){
	var uname = $.trim($("#uname").val());
	if(!uname){
		$('#uname').siblings("i").show().text("请输入用户名或手机号");
		return false;
	}else{
		return true;
	}
}
//验证手机号
function phoneCheck(){
  var phone= $.trim($("#uname").val());
//var regPhone= /^(13[0-9]|15[0-9]|18[0-9]])\d{8}$/;
  var regPhone = /^1[3|4|5|8][0-9]\d{8}$/;
  if(!phone){
    $("#uname").siblings("i").show().text("请填写您的手机号");
    return false;
  }else if(!regPhone.test(phone)){
    $("#uname").siblings("i").show().text("无效的手机号");
    return false;
  }else{
    $("#uname").siblings("i").hide();
    return true;
  }
}
//验证密码
function pwdCheck(){
  var pwdSize= $.trim($("#upwd").val()).length;
  if(!pwdSize){//密码为空时
    $("#upwd").siblings("i").show().text("请输入您的密码");
    return false;
  }else{
    $("#upwd").siblings("i").hide();
    return true;
  }
}
//登录验证码
function reloadVerifyCode() {
	var timenow = new Date().getTime();
	document.getElementById("captcha_img").src = url+"/servlet/VerificationCodeServlet?d=" + timenow;
}
//从url中获取参数
function GetQueryString(name){	
　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　var r = window.location.search.substr(1).match(reg);
　　if(r!=null)return  decodeURI(r[2]); return null;
}