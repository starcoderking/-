$(function() {
	var teacherid = GetQueryString('teacherid');
	teacherInfo(teacherid);
	teaCourse(teacherid);
});
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}
//获取教师信息
function teacherInfo(id) {
	var tHtml = "";
	$.ajax({
		type: "post",
		url: url + "/teacher/getTeacherInfo.action",
		async: false,
		data: {
			teacherid: id
		},
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			tHtml += '<h4>' + data.teachername + '</h4>' +
				'<ul>' +
				'<li><span>教师职称：</span>' + data.teachertype + '</li>' +
				'<li><span>性别：</span>' + data.sex + '</li>' +
				'<li><span>工作类型：</span>' + data.jobtype + '</li>' +
				'<li><span>民族：</span>' + data.nation + '</li>' +
				'<li><span>所属单位：</span>' + data.specialty + '</li>' +
				'</ul>'
			$('.teacher_avatar').attr('src', data.topimageurl);
			$('.teacher-intro').html(tHtml);
			$(".personal-profile>p").html(data.cont);
		}
	});
}
//获取教师所教的课程
function teaCourse(tid) {
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/course/getCourseListByTeacherId.action",
		async: false,
		data: {
			teacherid: tid
		},
		success: function(data) {
			//			console.log(data);
			if(data != '' && data != '[]') {
				data = JSON.parse(data);
				$.each(data, function(i, item) {
					var price = parseInt(item[17] / 100);
					cHtml += '<li>' +
						'<a href="course-detail.html?id=' + item[0] + '">' +
						'<img src="' + item[9] + '">' +
						'<div><h3>' + item[1] + '</h3><p class="price">￥<span>' + price + '</span></p></div>' +
						'</a>' +
						'</li>'
				});
				$('.course>ul').html(cHtml);
			}else{
				$('.course>ul').html('<h3 style="text-align:center;color:#666;">暂无教授课程</h3>');
			}
		}
	});
}