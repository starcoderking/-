$(function() {
	var classid = GetQueryString('classid');
	queryClassInfo(classid);
	$('.choiceTime .past').click(function() {
		location.href = "sign_detail.html?classid=" + classid + '&arrangingid=' + $(this).attr('data-id')+'&state=0';
	});
	$('.choiceTime .curday').click(function() {
		location.href = "sign_detail.html?classid=" + classid + '&arrangingid=' + $(this).attr('data-id')+'&state=1';
	});
});
//获取课程信息
function queryClassInfo(scid) {
	var infoHtml = '';
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/class/getPageSchoolClassByid.action",
		async: false,
		data: {
			scid: scid
		},
		success: function(data) {
			data = JSON.parse(data);
			var openclassDate = data.courese.courseopendata;
			if(openclassDate==''){
				openclassDate = '待教务老师通知';
			}
			infoHtml += '<img src="' + data.courese.coursepicture + '" />' +
				'<div>' +
				'<h3><span>班级名称：</span>' + data.classname + '</h3>' +
				'<p><span>开课日期：</span>' + openclassDate + '</p>' +
				'<p><span>专业名称：</span>' + data.courese.specialtyname + '</p>' +
				'<p><span>招生人数：</span>' + data.studentnum + '</p>' +
				'<p><span>校区名称：</span>' + data.schoolareaname + '</p>'
			$('.class-info').html(infoHtml);
			for(var i = 0; i < data.arranging.length; i++) {
				var openTime = formatDateTimeSecond(data.arranging[i][7]);
				var endTime = formatDateTimeSecond(data.arranging[i][8]);
				var index = i + 1;
				if(data.arranging[i][14] == 0) {
					cHtml += '<li data-id="' + data.arranging[i][4] + '" class="past">' + index + '<span>' +openTime+'至'+endTime+ '</span><span>' + data.arranging[i][5] + '</span></li>'
				} else if(data.arranging[i][14] == 1) {
					cHtml += '<li data-id="' + data.arranging[i][4] + '" class="curday">' + index + '<span>' +openTime+'至'+endTime+ '</span><span>' + data.arranging[i][5] +'</span></li>'
				} else {
					cHtml += '<li data-id="' + data.arranging[i][4] + '" class="future">' + index + '<span>' +openTime+'至'+endTime+'</span><span>' + data.arranging[i][5] +'</span></li>'
				}
			}
			$('.choiceTime').append(cHtml);
		}
	});
}
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return decodeURI(r[2]);
	return null;　　
}
//时间戳转换成日期到秒
function formatDateTimeSecond(inputTime) {
	var date = new Date(inputTime);
//	var y = date.getFullYear();
//	var m = date.getMonth() + 1;
//	m = m < 10 ? ('0' + m) : m;
//	var d = date.getDate();
//	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return h + ':' + minute + ':' + second;
};