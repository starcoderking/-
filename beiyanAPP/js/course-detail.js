$(function() {
	//获取用户ID
	var S = new Store();
	var userid = S.get('userid');
	$('.header_box').load('header.html', function() {
		main();
	});
	//获取课程courseid
	var courseid = GetQueryString('id');
	var currentdate = getNowFormatDate();
	var num = 0;
	$('#enroll').click(function() {
		if(userid == null || userid == '' || userid == 'undefined') {
			location.href = 'login.html';
		} else {
			location.href = "order-detail.html?courseid=" + courseid + "&classid=" + $(".gradeSelect").attr('data-id');
		}
	});
	//根据课程编号查询班级列表
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
			data = JSON.parse(data);
			$.each(data, function(i, item) {
				var description = item[12];
				if(description == null || description == '' || description == 'null') {
					description = '';
				} else {
					description = description;
				}
				if(i == 0) {
					if(item[15] == 4) {
						if(item[11] == 0) {
							gradeHtml += '<li class="gradeSelect full" data-id="' + item[0] + '" state="' + item[15] + '"><span>' + item[1] + '</span><span>' + description + '</span><em>已满</em></li>'
						} else {
							gradeHtml += '<li class="gradeSelect full" data-id="' + item[0] + '" state="' + item[15] + '"><span>' + item[1] + '</span><span>' + description + '</span></li>'
						}
					} else {
						gradeHtml += '<li class="gradeSelect" data-id="' + item[0] + '" state="' + item[15] + '"><span>' + item[1] + '</span><span>' + description + '</span></li>'
					}

				} else if(item[15] == 4) {
					if(item[11] == 0) {
						gradeHtml += '<li class="gradeSelect full" data-id="' + item[0] + '" state="' + item[15] + '"><span>' + item[1] + '</span><span>' + description + '</span><em>已满</em></li>'
					} else {
						gradeHtml += '<li class="gradeSelect full" data-id="' + item[0] + '" state="' + item[15] + '"><span>' + item[1] + '</span><span>' + description + '</span></li>'
					}
				} else {
					gradeHtml += '<li data-id="' + item[0] + '" state="' + item[15] + '"><span>' + item[1] + '</span><span>' + description + '</span></li>'
				}
			});
			$(".grade ul").html(gradeHtml);
		}
	});
	//初始化报名、预约按钮显示情况
	btnState();
	$('.grade li').click(function() {
		$(this).addClass('gradeSelect').siblings().removeClass('gradeSelect');
		coureseInfo($(this).attr('data-id'));
		courseSchedule($(this).attr('data-id'));
		//切换班级时，改变报名、预约按钮显示情况
		btnState();
	});

	coureseInfo($(".gradeSelect").attr('data-id'));
	courseSchedule($(".gradeSelect").attr('data-id'));

	//点击立即预约
	$("#order").click(function() {
		if(userid == '' || userid == undefined) {
			location.href = 'login.html?source=reservation';
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
					$.alertView('您预约成功！');
				} else if(data == 2) {
					$.alertView('您重复预约！');
				}
			},
			error: function(data) {
				$.alertView('您预约失败！');
			}
		});
	});
	//	课程表课程详情切换
	$('.course-detail>ul>li').click(function() {
		var i = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.schedule>ul').eq(i).removeClass('none').siblings().addClass('none');
	})
});
//根据班级状态控制报名、预约按钮显示情况
function btnState() {
	if($(".gradeSelect").attr('state') == 2) {
		$("#enroll").show();
		$("#order").show();
	} else if($(".gradeSelect").attr('state') == 4) {
		$("#enroll").hide();
		$("#order").show();
	}
}
//查询班级详细信息
function coureseInfo(id) {
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
			$("#coursename").text(data.courese.coursename);
			//			$('.introduce h3:first-child').text("课程名称："+data.courese.coursename);
			$("#coursetteacher").text(data.courese.parentspecialtyname);
			if(data.eachclasstime != '' && data.eachclasstime != null) {
				$("#authorized").text(data.eachclasstime);
			} else {
				$("#authorized").text('暂无');
			}
			if(data.totalhours != '' && data.totalhours != null) {
				$('#totalHours').text(data.totalhours);
			} else {
				$('#totalHours').text('暂无');
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
				$("#schoolarea").text(data.schoolarea.schooladdress);
			} else {
				$("#schoolarea").text(data.schoolarea.schoolareaname);
			}

			if(data.minagerange != 0 && data.maxagerange != 0) {
				$("#agerange").text(data.minagerange + "岁至" + data.maxagerange + "岁");
			} else if(data.maxagerange == 0) {
				$("#agerange").text('4岁以上');
			} else if(data.minagerange == 0 && data.maxagerange == 0) {
				$("#agerange").text('无限制');
			} else if(data.minagerange == 0 && data.maxagerange != 0) {
				$("#agerange").text(data.maxagerange + "岁以下");
			}
			$("#studentnum").text(data.studentnum + "人");
			$("#cost").text(data.cost / 100);
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
			$("#coursecount").html(data.courese.coursecount + '&nbsp;' + data.remarks);
		}
	});
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
					scheduleHtml += '<li><b>' + (i + 1) + '</b><span>' + item[5] + '</span></li>'
					$(".schedule ul#detail-one").html(scheduleHtml);
				});
			} else {
				//				$(".schedule ul").children().remove();
				$('.schedule ul#detail-one').html('<h4 style="font-size:.35rem;">具体上课安排由教务老师安排通知！</h4>');
			}
		}
	});
}
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

//获取课程的courseid 
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}