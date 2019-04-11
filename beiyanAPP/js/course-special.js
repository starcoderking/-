var S = new Store();
$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	autoLogin(); //自动登录
	queryCategory(); //获取类别
	courseList(); //调取课程列表函数显示课程
	getCourseidShowDetail(); //初始化显示详情
	event(); //页面事件
	//calculateWidth();//班级的宽度以最大宽度为准
	
	
	$('.buy').click(function() {
//		已选班级id
		var checkedClassid='';
		for(var i=0;i<4;i++){
			if(i==0){
				checkedClassid+=$('.selectedCourse ul li').eq(i).attr('data-id');
			}else{
				checkedClassid+=','+$('.selectedCourse ul li').eq(i).attr('data-id');
			}	
		}
//		if(userid == 'null' || userid == '' || userid == undefined) {
////			location.href = 'login.html';
//		}else 
		if(judgment()){
			location.href = "trial_lesson_buy.html?classid=" + checkedClassid;
		}else {
			var json = {
				msg:"您选择的课程不符合规则！",
				showMask: false // 设置 showMask=false，禁用遮罩
			}
            $.alertView(json);
		}
	});
	
	
	//	coureseInfo($(".gradeSelect").attr('data-id'));
	//	courseSchedule($(".gradeSelect").attr('data-id'));
	//点击立即预约
	$("#order").click(function() {
		if(S.get('userId') == null || S.get('userId') == 'undefined') {
			location.href = 'login.html';
		}
		$("#dialog").show();
	});
	//点击关闭按钮
	$("#close").click(function() {
		$("#dialog").hide();
		$("#remark").val('');
	});
	//点击取消按钮
	$("#cancel").click(function() {
		$("#dialog").hide();
		$("#remark").val('');
	});
	//点击提交按钮
	$("#submit").click(function() {
		$.ajax({
			type: "post",
			url: url + "/makeanappointment/saveMakeAnAppointment.action",
			data: {
				'userid': userid,
				'courseid': courseid,
				'classid': $(".gradeSelect").attr('data-id'),
				'remark': $("#remark").val()
			},
			async: false,
			success: function(data) {
				if(data == 1) {
					$("#dialog").hide();
					$("#remark").val('');
					('您预约成功！');
				} else if(data == 2) {
					$.alertView('您重复预约！');
				}
			},
			error: function(data) {
				$.alertView('您预约失败！');
			}
		});
	});
});

function event() {
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
		coureseInfo(classid);
		//calculateWidth();
	});
	$('.grade ul').on('click', 'li', function() {
		$(this).addClass('gradeSelect').siblings('li').removeClass('gradeSelect');
		var classid = $(this).attr('data-id');
		coureseInfo(classid);
	});
	$('b.add').click(function(){
		//		同一个课程下只能选择一个班
		var selectedId = $('.checkedCourse').attr('data-id');
		var arr = [];
		for(var i=0;i<$('.selectedCourse ul li').length;i++){
			arr.push($('.selectedCourse ul li').eq(i).attr('data-parentid'));
		}
		if(IsInArray(arr,selectedId)){
			$.alertView('同一节课只能选择一个班进行报名！');
			return false;	
		}else if($('.selectedCourse ul li').length<4){
			var copyLi = $('.grade .gradeSelect').clone();
			$('.selectedCourse ul').append(copyLi);
		}else{
			return false;
		}
		if($('.selectedCourse ul li').length==4){
			$('button.buy').removeClass('disabled').attr('disabled',false);
		}
		for(var i=0;i<$('.selectedCourse ul li').length;i++){
			if($('.selectedCourse ul li').eq(i).children('b').length==0){
				$('.selectedCourse ul li').eq(i).append('<b>X</b>')
			}
		}
	});
	$('.selectedCourse ul').on('click','li',function(){
		$(this).remove();
		$('button.buy').addClass('disabled').attr('disabled',true);
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
		url: url + "/course/getCourseListIndexPage.action",
		async: false,
		data: {
			specialtyid: specialtyid,
			coursename: '',
			maxage: '',
			minage: '',
			schoolareaid: '',
			page: 1,
			limit: 100
		},
		success: function(data) {
			if(data != '' && data != 'null' && data != '[]') {
				data = JSON.parse(data);
				$.each(data, function(i, item) {
					minNum = Number(item[17]);
					maxNum = Number(item[18]);
					if((minNum / maxNum) <= 0.3) {
						stateHtml = '<b class="state01">在售</b>'
					} else if((minNum / maxNum) < 0.6 && (minNum / maxNum) > 0.3) {
						stateHtml = '<b class="state02">紧张</b>'
					} else {
						stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>火爆</b>'
					}
					if(i == 0) {
						courseHtml += '<li class="checkedCourse" data-id="' + item[0] + '">' +
							'<img src="' + item[9] + '" />' +
							'<h2>' + item[1] + '</h2>' +
							stateHtml
					} else {
						courseHtml += '<li data-id="' + item[0] + '">' +
							'<img src="' + item[9] + '" />' +
							'<h2>' + item[1] + '</h2>' +
							stateHtml
					}
				});
				$('.choice_course ul').html(courseHtml);
				$('.grade .add').show();
			} else {
				$('.choice_course ul').html('<h3>暂时无课程安排</h3>');
				$('.grade ul').html('');
				$('.grade .add').hide();
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
				'courseid': courseid
			},
			async: false,
			success: function(data) {
				//console.log(data);
				if(data != '' && data != null) {
					data = JSON.parse(data);
					$.each(data, function(i, item) {
						if(i == 0) {
							gradeHtml += '<li class="gradeSelect" data-parentid="'+item[5]+'" data-id="' + item[0] + '" state="' + item[12] + '">' + item[1] + '<span>' + item[13] + '</span></li>'
						} else {
							gradeHtml += '<li data-parentid="'+item[5]+'" data-id="' + item[0] + '" state="' + item[12] + '"><span>' + item[1] + '</span><span>' + item[13] + '</span></li>'
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
				$('.course-img img').attr('src', data.courese.coursepicture);
				$('#coursename').text("课程名称：" + data.courese.coursename);
				//			页面当前位置显示课程名称
				//$('.curCourseName').html(data.courese.coursename);
				$("#coursetteacher").text(data.courese.parentspecialtyname);
				if(data.courese.authorized != '') {
					$("#authorized").text(data.courese.authorized);
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
				$("#studentnum").text("招生人数："+data.studentnum + "人");
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