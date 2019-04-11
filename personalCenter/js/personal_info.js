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
//验证用户名函数
function isRegisterUserName(s){   
var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;   
	if (!patrn.exec(s)) return false 
	return true 
}
//个人信息显示
function personalInfo() {
	var S = new Store();
	var U = new Url();
	var userid = S.get('userId');
	$('#userid').val(userid);
	$.ajax({
		type: "post",
		url: url + "/registered/getRegisteredUserByUserId.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
//			console.log(data);
			if(data != '' && data != null) {
				data = JSON.parse(data);
				if(data.topimageurl != '') {
					avatarImg = data.topimageurl;
					$('#imghead').attr('src', data.topimageurl);
					$('.user_info>img').attr('src', data.topimageurl);
				}
				$('.user_info .uname').text(data.loginusername);
				$('.personal_info #nickname').val(data.loginusername);
				$('.personal_info #name').val(data.fullname);
				$('.personal_info #phone').val(data.phonenumber);
				$('.personal_info #address').val(data.residentarea);
			} else {
				return false;
			}
		}
	});
}
//修改头像
function subimtBtn() {
	var form = $("#formImg");
	var options = {
		url: url + '/registered/uploadRegisteredUsersTopImage.action', //上传文件的路径  
		type: 'post',
		success: function(data) {
			data = JSON.parse(data);
			if(data.imgUrl && data.imgUrl != '') {
				$('#imghead').attr('src', data.imgUrl);
				$('.user_info>img').attr('src', data.imgUrl);
				avatarImg = data.imgUrl;
//				console.log(data, '上传图片');
//				SimplePop.alert('更改成功');
//				....       //异步上传成功之后的操作
			}
		}
	};
	form.ajaxSubmit(options);
}
//修改个人信息函数
function savePersonalInfo() {
	var S = new Store();
	var userid = S.get('userId');
	var nickname = $.trim($(".personal_info #nickname").val());
	var name = $.trim($(".personal_info #name").val());
	var phone = $.trim($(".personal_info #phone").val());
	var address = $.trim($(".personal_info #address").val());
	$.ajax({
		type: "post",
		url: url + "/registered/editRegisteredusers.action",
		async: false,
		data: {
			address:'',
			userid: userid,
			contactway: '',
			residentarea: '',
			residentarea: address,
			fullname: name,
			nickname: nickname,
			phonenumber: phone,
		},
		success: function(data) {
			data = U.tJson(data);
			if(data.result == 1) {
				$('.user_info .uname').text(nickname);
				SimplePop.alert('保存成功');
			} else {
				SimplePop.alert('保存失败');
				return false;
			}
		}
	});
}
//预览想要更改的头像
function previewImage(file) {
	/*验证上传文件的格式，图片格式验证*/
	var File = document.getElementById("previewImg");
	var i = File.value.lastIndexOf('.');
	var len = File.value.length;
	var extEndName = File.value.substring(i + 1, len);
	var extName = "GIF,BMP,JPG,JPEG,PNG"; //首先对格式进行验证
	if(extName.indexOf(extEndName.toUpperCase()) == -1) {
		SimplePop.alert('上传文件格式错误');
		return false;
	};
	if(file.files && file.files[0]) {
		var img = document.getElementById('imghead');
		var reader = new FileReader();
		reader.onload = function(evt) {
			img.src = evt.target.result;
			//		将文件的转码保存在变量imgcode中
			imgcode = evt.target.result;
		}
		reader.readAsDataURL(file.files[0]);
	} else //兼容IE
	{
		var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
		file.select();
		var src = document.selection.createRange().text;
		div.innerHTML = '<img id=imghead>';
		var img = document.getElementById('imghead');
		img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
		var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
		status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
		div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
	}
}