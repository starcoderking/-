$(function() {
	$('.footer').load('footer.html',function(){
		main();
		navText('我的');
	});
	var S = new Store();
	var userid = S.get('userid');
	var Type = S.get('userType');//1教师，2普通会员
	if(Type==1){
		queryTeacherInfo(userid);
	}else if(Type==2){
		queryPerdonalInfo(userid);
	}
	$("#exit").click(function() {
		var json = {
			title: "提示",
			msg: "您确定要退出吗？",
			buttons: [{
					title: "确定",
					color: "red",
					click: function() {
						S.delAll();
						location.href = 'login.html';
					}
				},
				{
					title: "取消"
				}
			]
		}
		$.alertView(json);
	});
	$('.mySign>i').click(function(){//点击签到标签给学员进行签到
		location.href = 'teacher_sign_index.html';
	})
});
//获取会员信息显示
function queryPerdonalInfo(userid) {
	$.ajax({
		type: 'post',
		url: url + '/registered/getRegisteredUserByUserId.action',
		data: {
			userid: userid,
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.topimageurl!=''){
				$('.myPhoto>img').attr('src',data.topimageurl);
			}
			if(data.nickname!=''&&data.nickname!='null'){
				$('.myInfo').text(data.nickname);
			}else{
				$('.myInfo').text('');
			}
			if(data.address!=''&&data.address!='null'){
				$('.address').text('地址：'+data.address);
			}else{
				$('.address').text('');
			}
		}
	})
}
//获取教师信息显示
function queryTeacherInfo(userid) {
	$.ajax({
		type: 'post',
		url: url + '/teacher/getTeacherInfo.action',
		data: {
			teacherid: userid,
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.topimageurl!=''){
				$('.myPhoto>img').attr('src',data.topimageurl);
			}
			if(data.teachername!=''&&data.teachername!='null'){
				$('.myInfo').text(data.teachername);
			}else{
				$('.myInfo').text('');
			}
//			if(data.address!=''&&data.address!='null'){
//				$('.address').text('地址：'+data.address);
//			}else{
//				$('.address').text('');
//			}
		}
	})
}