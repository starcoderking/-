$(function(){
	var S = new Store();
	event();
	$('#userid').val(S.get('userid'));//给表单中设置会员id
	$('.submit').click(function(){
		subimtBtn();
	})
})
//从url中获取参数值函数
function GetQueryString(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  decodeURI(r[2]); return null;
}
function event(){
	var src = GetQueryString('src');
	$('#imghead').attr('src',src);
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
				alert('更改成功')
//				$('#imghead').attr('src', data.imgUrl);
				console.log(data, '上传图片');
			}
		}
	};
	form.ajaxSubmit(options);
}
//个人信息头像修改
//图片上传预览    IE是用了滤镜。
function previewImage(file) {
	/*验证上传文件的格式，图片格式验证*/
	var File = document.getElementById("previewImg");
	var i = File.value.lastIndexOf('.');
	var len = File.value.length;
	var extEndName = File.value.substring(i + 1, len);
	var extName = "GIF,BMP,JPG,JPEG,PNG"; //首先对格式进行验证
	if(extName.indexOf(extEndName.toUpperCase()) == -1) {
		//alert('上传文件格式错误');
		$.alertView("上传文件格式错误");
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
	} 
}