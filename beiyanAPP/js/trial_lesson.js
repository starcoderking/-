var S = new Store();
var userid = S.get('userid');
$(function() {
//	判断是否为微信浏览器打开
	if(isWeiXin()){
		$('.couponReceive').removeClass('none');
	}
//	判断是否从北演链接过来直接登录
	if(GetQueryString('memberId')&&GetQueryString('memberId')!=''){
		autoLogin(); //自动登录
	}
	queryCategory(); //获取类别
	courseList(); //调取课程列表函数显示课程
	getCourseidShowDetail(); //初始化显示详情
	event(); //页面事件
	//calculateWidth();//班级的宽度以最大宽度为准
	$('.buy').click(function() {
		if($('.selectedCourse ul li').length>4){
			$.alertView('请保留四节艺术课进行购买');
			return false;
		}else if($('.selectedCourse ul li').length<4){
			$.alertView('请选择四节艺术课进行购买');
			return false;
		}
//		已选班级id
		var checkedClassid='';
		for(var i=0;i<4;i++){
			if(i==0){
				checkedClassid+=$('.selectedCourse ul li').eq(i).attr('data-id');
			}else{
				checkedClassid+=','+$('.selectedCourse ul li').eq(i).attr('data-id');
			}	
		}
		if(judgment()&&userid!=null){
			location.href = "trial_lesson_buy.html?classid=" + checkedClassid;
		}else if(userid==null&&judgment()){
			location.href = "login.html?classid="+checkedClassid;
		}else{
			var json = {
				msg:"中华戏曲或中华曲艺下必选一个班！",
				showMask: false // 设置 showMask=false，禁用遮罩
			}
            $.alertView(json);
		}
	});
});
//判断是否为微信浏览器打开
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
function event() {
//	点击领取页面,如果是微信浏览器提示用其他浏览器打开
	$('.couponReceive').click(function(){
		$(this).hide();
		if(isWeiXin()){
			$('.prompt_browser').show();
		}
	});
	$('.choice_center ul').on('click', 'li', function() {
		$(this).addClass('gradeSelect').siblings().removeClass('gradeSelect');
		getCourseidShowDetail();
		//calculateWidth();
		
	});
	$('.choice_course ul').on('click', 'li', function() {
		$(this).addClass('checkedCourse').siblings('li').removeClass('checkedCourse');
		var courseid = $(this).attr('data-id');
		classList(courseid);
		var classid = $('.gradeSelect').attr('data-id');
//		coureseInfo(classid);
		//calculateWidth();
	});
	$('.grade ul').on('click', 'li', function() {
		if($(this).hasClass('full')){
			$.alertView('本班已满！');
			return false;
		}
		$(this).addClass('gradeSelect').siblings('li').removeClass('gradeSelect');
//		var classid = $(this).attr('data-id');
//		coureseInfo(classid);
		var selectedId = $('.checkedCourse').attr('data-id');
		var arr = [];//保存所选课程的id
		for(var i=0;i<$('.selectedCourse ul li').length;i++){
			arr.push($('.selectedCourse ul li').eq(i).attr('data-parentid'));
		}
		if(IsInArray(arr,selectedId)){
			$.alertView('同一节课只能选择一个班！');
			return false;	
		}
		if($('.selectedCourse ul li').length<10){
			var copyLi = $('.grade .gradeSelect').clone();
			$('.selectedCourse ul').append(copyLi);
		}else{
			$.alertView('选择课程已达上限');
		}
		for(var i=0;i<$('.selectedCourse ul li').length;i++){
			if($('.selectedCourse ul li').eq(i).children('b').length==0){
				$('.selectedCourse ul li').eq(i).append('<b>X</b>')
			}
		}
	});
	$('.selectedCourse ul').on('click','li',function(){
		$(this).remove();
//		$('button.buy').addClass('disabled').attr('disabled',true);
	})
}
function IsInArray(arr,val){
	var testStr=','+arr.join(",")+",";
	return testStr.indexOf(","+val+",")!=-1;
}
//从url中获取传过来的用户信息
function autoLogin() {
	var memberId = GetQueryString('memberId');
	var memberName = GetQueryString('name');
	var memberPhone = GetQueryString('phone');
	$.ajax({
		type: "post",
		url: url + "/registered/receiveCouponSync.action",
		async: false,
		data: {
			memberid: memberId,
			name: memberName,
			phone: memberPhone
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.loginusername=='null' || data.loginusername=='' || data.loginusername=='undefined'){
				S.set('uname', data.loginusername);
			}else{
				S.set('uname', memberPhone);
			}
			S.set('userid', data.userid);
		}
	});
}
//获取类别
function queryCategory() {
	var leiHtml = '';
	$.ajax({
		type: "post",
		url: url + "/specialty/getPageSonSpecialty.action",
		//		url:'http://www.chunyuyishu.com//specialty/getPageSonSpecialty.action',
		async: false,
		data: {
			parentid: 21
		},
		success: function(data) {
			if(data != 'null' && data != '') {
				data = JSON.parse(data);
				for(var i = 0; i < data.length; i++) {
					if(i == 0) {
						leiHtml += '<li class="gradeSelect" data-id="' + data[i].specialtyid + '">' + data[i].specialtyname + '</li>'
					} else {
						leiHtml += '<li data-id="' + data[i].specialtyid + '">' + data[i].specialtyname + '</li>'
					}
				}
				$('.choice_center ul').html(leiHtml);
			}
		}
	});
}
//获取选中的课程id显示排班列表和班级详情
function getCourseidShowDetail() {
	var centerid = $('.choice_center ul .gradeSelect').attr('data-id');
	if(centerid) {
		courseList(centerid);
	}
	var courseid = $('.choice_course ul .checkedCourse').attr('data-id');
	if(courseid) {
		classList(courseid);
	}
	var classid = $('.grade ul .gradeSelect').attr('data-id');
	if(classid) {
		coureseInfo(classid);
	}
}
//获取课程列表
function courseList(specialtyid) {
	var courseHtml = '';
	var minNum = ''; //已售出的课程数
	var maxNum = ''; //已售出课程数
	$.ajax({
		type: "post",
		url: url + "/course/getCourseListAuditions.action",
		async: false,
		data: {
			specialtyid: specialtyid
//			coursename: '',
//			maxage: '',
//			minage: '',
//			schoolareaid: '',
//			page: 1,
//			limit: 100
		},
		success: function(data) {
			if(data != '' && data != 'null' && data != '[]') {
				data = JSON.parse(data);
				$.each(data, function(i,item) {
					var stdnum = item[4];//剩余人数
					if( stdnum>4) {
						stateHtml = '<b class="state01">余'+stdnum+'</b>'
					} else if(stdnum >=3 && stdnum <=4) {
						stateHtml = '<b class="state02">余'+stdnum+'</b>'
					} else {
						stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>余'+stdnum+'</b>'
					}
					if(i == 0) {
						courseHtml += '<li class="checkedCourse" data-id="' + item[0] + '">' +
							'<img src="' + item[3] + '" />' +
							'<h2>' + item[2] + '</h2>' +
							stateHtml
					} else {
						courseHtml += '<li data-id="' + item[0] + '">' +
							'<img src="' + item[3] + '" />' +
							'<h2>' + item[2] + '</h2>' +
							stateHtml
					}
				});
				$('.choice_course ul').html(courseHtml);
			} else {
				$('.choice_course ul').html('<h3>暂时无课程安排</h3>');
				$('.grade ul').html('');
				//$('#coursecount').html('');
			}
		}
	});
}
//根据课程编号查询班级列表
function classList(courseid) {
	if(courseid) {
		var gradeHtml = '';
		$.ajax({
			type: "post",
			url: url + "/class/getSchoolClassListByCourseId.action",
			data: {
				courseid: courseid,
				coursetype:4
			},
			async: false,
			success: function(data) {
//				console.log(data);
				if(data != '' && data != null && data!='[]') {
					data = JSON.parse(data);
					$.each(data, function(i, item) {
						if(item[15]==4) {
							gradeHtml += '<li class="full" data-parentid="'+item[5]+'" data-id="' + item[0] + '" state="' + item[12] + '"><span>' + item[1] + '</span><span style="display:none;">' + item[13] + '</span><span>'+item[8]+'<span><em>已满</em></li>'
						} else {
							gradeHtml += '<li data-parentid="'+item[5]+'" data-id="' + item[0] + '" state="' + item[15] + '"><span>' + item[1] + '</span><span style="display:none;">' + item[13] + '</span><span>'+item[8]+'</span></li>'
						}
						$(".grade ul").html(gradeHtml);
					});
				} else {
					$(".grade ul").html('');
				}
			}
		});
	} else {
		$(".grade ul").html('');
	}
}
//查询班级详细信息
function coureseInfo(id) {
	if(id) {
		$.ajax({
			type: "post",
			url: url + "/class/getPageSchoolClassByid.action",
			data: {
				'scid': id
			},
			async: false,
			success: function(data) {
				data = JSON.parse(data);
				//console.log(data);
//				$('.course-img img').attr('src', data.courese.coursepicture);
				$('#coursename').text("10元秒杀3+1节艺术课");
				//			页面当前位置显示课程名称
				//$('.curCourseName').html(data.courese.coursename);
				$("#coursetteacher").text(data.courese.specialtyname+'中心老师');
				if(data.eachclasstime!= ''&&data.eachclasstime!=null) {
					$("#authorized").text(data.eachclasstime);
				} else {
					$("#authorized").text('暂无');
				}
				if(data.courese.specialtyname != null) {
					$("#specialtyname").text(data.courese.specialtyname);
				} else {
					$("#specialtyname").text('');
				}
				if(data.classdate != 'null' && data.classdate != '') {
					$("#courseopendata").text(data.classdate);
				} else {
					$("#courseopendata").text('暂无');
				}
				if(data.schoolarea.schooladdress != null) {
					$("#schoolarea").text(data.schoolarea.schoolareaname + ' ' + data.schoolarea.schooladdress);
				} else {
					$("#schoolarea").text(data.schoolarea.schoolareaname);
				}
				if(data.minagerange != 0 && data.maxagerange != 0) {
					$("#agerange").text(data.minagerange + "岁至" + data.maxagerange + "岁");
				} else if(data.minagerange != 0 && data.maxagerange == 0) {
					$("#agerange").text(data.minagerange + '岁以上');
				} else if(data.minagerange == 0 && data.maxagerange == 0) {
					$("#agerange").text('无限制');
				} else if(data.minagerange == 0 && data.maxagerange != 0) {
					$("#agerange").text(data.maxagerange + "岁以下");
				}
//				$("#studentnum").text("招生人数："+data.studentnum + "人");
				/*if(data.cost == 0) {
					$("#cost").parent('li').html('课程价格：<b>需咨询预约</b>')
				} else {
					$("#cost").text(data.cost / 100);
				}*/
				if(data.requirement != '') {
					$("#requirement").text(data.requirement);
				} else {
					$("#requirement").text('暂无');
				}
				if(data.endexplain != '') {
					$("#endexplain").text(data.endexplain);
				} else {
					$("#endexplain").text('暂无');
				}
				if(data.courese.coursecount != null || data.remarks != null) {
					$("#coursecount").html(data.courese.coursecount + '&nbsp;' + data.remarks);
				} else {
					$("#coursecount").html('');
				}
			}
		});
	}else{
		
	}
}
//查询课程排课信息
function courseSchedule(id) {
	var scheduleHtml = '';
	$.ajax({
		type: "post",
		url: url + "/class/getPageSchoolClassArrangingByid.action",
		data: {
			'scid': id
		},
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			if(data != '') {
				$.each(data, function(i, item) {
					var startTime = formatDateTimeSecond(item[7]);
					var endTime = formatDateTimeSecond(item[8]);
					scheduleHtml += '<li><b>' + (i + 1) + '</b><span>' + item[5] + '</span><span>' + item[1] + '</span><span>' + item[3] + '</span><span>' + startTime + '-' + endTime + '</span></li>'
					$(".schedule ul").html(scheduleHtml);
				});
			} else {
				$('.schedule ul').html('<h2>具体上课安排由教务老师安排通知！</h2>');
			}
		}
	});
}
//	设置班级选择的宽度为其中最大的那个
/*function calculateWidth(){
	var classWidth = [];
	for(var i = 0; i < $('.grade ul li').length; i++) {
		classWidth.push($('.grade ul li').eq(i).width());
	}
	function getMaximin(arr, maximin) {
		if(maximin == "max") {
			return Math.max.apply(Math, arr);
		} else if(maximin == "min") {
			return Math.min.apply(Math, arr);
		}
	}
	var maxwidth = getMaximin(classWidth, 'max');
	$('.grade ul li').css('width', maxwidth + 15 +'px');
}*/
//获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	/*var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	        + " " + date.getHours() + seperator2 + date.getMinutes()
	        + seperator2 + date.getSeconds();*/
	var currentdate = date.getFullYear() + '' + month + '' + strDate;
	return currentdate;
}
//判断所选课程是否含有中华戏曲和中华曲艺的课程
function judgment(){
	var dramaarts=false;
	for(var i=0;i<4;i++){
		var classid = $('.selectedCourse ul li').eq(i).attr('data-id');
		$.ajax({
			type:"post",
			url:url+"/class/getPageSchoolClassByid.action",
			async:false,
			data:{scid:classid},
			success:function(data){
				if(data!='null'&&data!='undefined'){
					data = JSON.parse(data);
					if(data.courese.specialtyid==105){
						dramaarts = true;
					}else if(data.courese.specialtyid==106){
						dramaarts = true;
					}
				}
			}
		});
	}
	return dramaarts;
}
//从url中获取参数值
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}
//时间戳转换成日期到秒
function formatDateTimeSecond(inputTime) {
	var date = new Date(inputTime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return h + ':' + minute;
};