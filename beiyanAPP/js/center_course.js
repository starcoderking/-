$(function() {
	var U = new Url();
	var S = new Store();
	var I = new Interfaces();
	var introId = GetQueryString('newid');
	I.query_center_intro(introId);
	var center_intro = JSON.parse(S.get('center_intro'));
	$('.mui-title').text(center_intro.infoname);
	var cHtml = ''; //用来存储中心标签和名称
	if(center_intro.sysinformationid == 5) {
		cHtml += '<i class="iconfont icon-xiganqiaochenfufc9702"></i>' + center_intro.infoname
	} else if(center_intro.sysinformationid == 6) {
		cHtml += '<i class="iconfont icon-gangqin"></i>' + center_intro.infoname
	} else if(center_intro.sysinformationid == 7) {
		cHtml += '<i class="iconfont icon-xiqu"></i>' + center_intro.infoname
	} else if(center_intro.sysinformationid == 8) {
		cHtml += '<i class="iconfont icon-quyizatan"></i>' + center_intro.infoname
	} else if(center_intro.sysinformationid == 9) {
		cHtml += '<i class="iconfont icon-wudao"></i>' + center_intro.infoname
	} else if(center_intro.sysinformationid == 10) {
		cHtml += '<i class="iconfont icon-yishuquan2"></i>' + center_intro.infoname
	}
	$('.courseTitle').html(cHtml);
	$('.courseInfo>div').html(center_intro.infocontent);
	var centerId = GetQueryString('centerid');
	var more = '<a href="course-centerList.html?centerid=' + centerId + '&centername=' + center_intro.infoname + '">查看更多&gt;&gt;</a>'
	$('.readmores').html(more);
	I.query_center_course(centerId);
	var center_course = JSON.parse(S.get('center_course'));
	var lHtml = '';
	var length = center_course.length;
	if(length > 4) {
		length = 4;
	} else {
		length = length;
		$('.readmores').hide();
	}
	//console.log(center_course.length);
	for(var i = 0; i < length; i++) {
		var price = parseFloat(center_course[i][11] / 100);
		var startTime = center_course[i][3];
		if(startTime == '' || startTime == null) {
			startTime = '待教务老师通知';
		}
		minNum = Number(center_course[i][8]);
		maxNum = Number(center_course[i][9]);
		var proportion = minNum / maxNum;
		var stateHtml = '';
		if(proportion <= 0.3&&proportion>=0) {
			stateHtml = '<b class="state01">余' +(maxNum-minNum)+ '</b>'
		} else if(proportion < 0.6 && proportion > 0.3) {
			stateHtml = '<b class="state02">余' + (maxNum-minNum) + '</b>'
		} else if(proportion >= 0.6 && proportion<1){
			stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>余' + (maxNum-minNum) + '</b>'
		}else{
			stateHtml = '<b class="state04">已满</b>'
		}
		lHtml += '<li>' +
			'<a href="course-detail.html?id=' + center_course[i][0] + '">' +
			'<img src="' + center_course[i][2] + '" />' +
			stateHtml +
			'<h3>' + center_course[i][1] + '</h3>' +
			'<p>开课时间：<span class="teacher-name">' + startTime + '</span></p>' +
			'<div><i class="iconfont icon-tianjiaren"></i>' +
			'<span class="people-number">' + maxNum + '人</span></div>' +
			'<em>￥<font>' + price + '</font></em>' +
			'</a>' +
			'</li>'
		//		lHtml+='<li><a href="course-detail.html?courseid='+center_course[i][0]+'">'
		//			+'<div class="courseImg">'
		//			+'<img src="'+center_course[i][9]+'"/>'
		//			+'</div>'
		//			+stateHtml
		//			+'<h5>'+center_course[i][1]+'<h5>'
		//			+'<p>讲师： <span>'+center_course[i][19]+'</span></p>'
		//			+'<div>'
		//			+'<i class="iconfont icon-tianjiaren"></i>'
		//			+'<span class="people-number">'+ center_course[i][18]+'人</span>'
		//			+'</div>'
		//			+'</a>'
		//			+'</li>'
	}
	$('.course>ul').html(lHtml);
});
//从URL中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}