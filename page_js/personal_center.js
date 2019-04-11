var schedule_arr; //保存课程表数组
var S = new Store();
var U = new Url();
var userid = S.get('userId'); //用户id
var avatarImg = ''; //用来存储自己头像的链接
var teacherImg = ''; //用来存储聊天教师的头像链接
var time = ''; //用来存储查询聊天记录的时间
$(function() {
	//	页头加载
	$('.header_box').load('header.html', function() {
		main();
	});
	//	左侧导航项对应显示内容
	$('.nav ul li').click(function() {
		if($(this).hasClass('current')) {
			return false;
		} else {
			$(this).addClass('current').siblings('li').removeClass('current');
			var i = $(this).index();
			$('.detail>div').eq(i).show().siblings().hide();
			$('.container input').attr('disabled', true);
			$('.changePwd input').attr('disabled', false);
			$('.save').addClass('none');
			$('.edit').removeClass('none');
		}
	});
	//	个人信息
	personalInfo();
	//	学员信息
	addStudentList();
	initStundentInfo(); //初始学员信息显示
	editEvent();
	//修改密码
	$('#oldPwd').blur(pwdCheck);
	$('#upwd').blur(pwdCheck1);
	$("#upwd2").blur(pwdCheck2);
	$('.changePwd button').click(function() {
		var oldPwd = $('#oldPwd').val();
		var newPwd = $('#upwd2').val();
		var userid = S.get('userId');
		if(pwdCheck() && pwdCheck1() && pwdCheck2()) {
			$.ajax({
				type: "post",
				url: url + "/registered/editUsersPasswords.action",
				async: false,
				data: {
					userid: userid,
					oldpasswords: oldPwd,
					newpasswords: newPwd
				},
				success: function(data) {
					data = JSON.parse(data);
					if(data.result == 1) {
						SimplePop.alert('保存成功');
					} else {
						SimplePop.alert('保存失败！！！');
					}
				}
			});
		}
	});
	//	保存和添加学员信息
	$('.student_info .save').click(function() {
		//		var userid = S.get('userId');
		var membername = $.trim($("#membername").val());
		var gender = $.trim($("#choice_sex").val());
		var birthday = $.trim($(".Wdate").val());
		var school = $.trim($("#school").val());
		var like = $.trim($("#like").val());
		if($('.students_list span.cur').length != 0) {
			var memberid = $('.students_list span.cur').attr('data-id');
			$.ajax({
				type: "post",
				url: url + "/registered/editRegisteredUsersMemberBody.action",
				async: false,
				data: {
					userid: userid,
					mbid: memberid,
					membername: membername,
					sex: gender,
					dateofbirth: birthday,
					grade: '',
					schoolname: school,
					interests: like,
					remarks: ''
				},
				success: function(data) {
					data = JSON.parse(data);
					if(data && data != '' && data.result == 1) {
						SimplePop.alert('保存成功');
					} else {
						SimplePop.alert('保存失败！');
					}
				}
			});
		} else {
			$.ajax({
				type: "post",
				url: url + "/registered/editRegisteredUsersMemberBody.action",
				async: false,
				data: {
					userid: userid,
					mbid: 0,
					membername: membername,
					sex: gender,
					dateofbirth: birthday,
					grade: '',
					schoolname: school,
					interests: like,
					remarks: ''
				},
				success: function(data) {
					data = JSON.parse(data);
					if(data && data.result == 1) {
						SimplePop.alert('添加成功');
						addStudentList();
						$('.students_list span:last-child').addClass('cur');
					} else {
						SimplePop.alert('添加失败！');
					}
				}
			});
		}
	})
	//	学员课程表
	initSchedule();
	$('.studentSel select').change(function() {
		$('.dialogBox ul').html('');
		var mbid = $(this).val();
		//alert(mbid);
		getStudentClass(mbid); //获取当前学员所报的课程
		$.ajax({
			type: "post",
			url: url + "/registered/getMemberBodyArranging.action",
			async: false,
			data: {
				mbid: mbid,
				courseid: 0,
				classid: 0
			},
			success: function(data) {
				data = U.tJson(data);
				schedule_arr = data;
				$('.HCalendar_info').remove();
				$('.HCalendar_week').remove();
				$('.HCalendar_day').remove();
				HCalendar.init({});
			}
		});
	});
	//	课程表日历
	//HCalendar.init({});
	/*新用户指南*/
	/*$(".guide_title").click(function() {
		$(this).toggleClass("guide_selected").siblings(".guide_title").removeClass("guide_selected");
		$(this).next(".guide_msg").slideToggle(300).siblings(".guide_msg").slideUp(500);

	});*/
	//	通知和消息部分的事件
	messages();
	queryCoupon();//优惠券
	queryHuiminCard();//惠民卡
});
//验证用户名函数
function isRegisterUserName(s){   
var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;   
	if (!patrn.exec(s)) return false 
	return true 
}
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
	$('.student_info .edit').click(function() {
		$('.student_info input').attr('disabled', false);
		$(this).addClass('none');
		$('.student_info .save').removeClass('none');
	});
	$('.student_info .save').click(function() {
		$('.student_info input').attr('disabled', true);
		$(this).addClass('none');
		$('.student_info .edit').removeClass('none');
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
	//	添加学员
	$('.add_student').click(function() {
		if($('.students_list span.cur').length != 0) {
			$('.students_list span').removeClass('cur');
		}
		$('.student_info input').attr('disabled', false);
		$('.student_info .save').removeClass('disabled').attr('disabled', false);
		$('.students_list span b').hide();
		$('.student_info input').val('');
		$('.student_info .edit').addClass('none');
		$('.student_info .save').removeClass('none');
	});
	//	删除学员
	$('.del_student').click(function() {
		$('.students_list span').removeClass('cur');
		$('.students_list span b').show();
	});
	$('.private_letter .text button').click(function() {
		sendMyMessage();
	});
	//	按回车发送消息
	$("#textMessage").bind('keyup', function(event) {
		if(event.keyCode == "13") {
			sendMyMessage();
		}
	});
}
//初始化学员课程表
function initSchedule() {
	var mbid = $('.studentSel select').val();
	if(mbid != '' && mbid != null) {
		getStudentClass(mbid); //初始化学员所报的课程
		$.ajax({
			type: "post",
			url: url + "/registered/getMemberBodyArranging.action",
			async: false,
			data: {
				mbid: mbid,
				courseid: 0,
				classid: 0
			},
			success: function(data) {
				data = U.tJson(data);
				schedule_arr = data;
				$('.HCalendar_info').remove();
				$('.HCalendar_week').remove();
				$('.HCalendar_day').remove();
				HCalendar.init({});
			}
		});
	} else {
		HCalendar.init({});
	}
}
//个人信息
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
			data = U.tJson(data);
			if(data != '' && data != null) {
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
//密码验证
function pwdCheck() {
	var pwdSize = $.trim($("#oldPwd").val()).length;
	if(!pwdSize) { //密码为空时
		$("#oldPwd").siblings("i").show().text("请输入您的密码");
		return false;
	} else if(pwdSize < 6 || pwdSize > 12) {
		$("#oldPwd").siblings("i").show().text("6~12个字符之间");
		return false;
	} else {
		$("#oldPwd").siblings("i").hide();
		return true;
	}
}

function pwdCheck1() {
	var pwdSize = $.trim($("#upwd").val()).length;
	if(!pwdSize) { //密码为空时
		$("#upwd").siblings("i").show().text("请输入您的密码");
		return false;
	} else if(pwdSize < 6 || pwdSize > 12) {
		$("#upwd").siblings("i").show().text("6~12个字符之间");
		return false;
	} else {
		$("#upwd").siblings("i").hide();
		return true;
	}
}
//验证重复密码
function pwdCheck2() {
	var pwd = $.trim($("#upwd").val());
	var pwd2 = $.trim($("#upwd2").val());
	if(pwdCheck()) {
		if(pwd != pwd2) {
			$("#upwd2").siblings("i").show().text("两次输入的密码不一致");
			return false;
		} else {
			$("#upwd2").siblings("i").hide();
			$('.changePwd .save').removeClass('disabled').attr('disabled', false);
			return true;
		}
	}
}
//学员信息
function addStudentList() {
	var S = new Store();
	var U = new Url();
	var userid = S.get('userId');
	var sHtml = ''; //学员信息的学员列表
	var cHtml = ''; //课程表的学员列表
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBodyByUserId.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
			sList = U.tJson(data);
			if(sList != '' && sList != null) {
				for(var i = 0; i < sList.length; i++) {
					if(i == 0) {
						sHtml += "<span data-id=" + sList[i].mbid + " class='studentInfo'>" + sList[i].membername + "<b class='icon iconfont icon-chahao'></b></span>"
						cHtml += "<option value=" + sList[i].mbid + ">" + sList[i].membername + "</option>"
					} else {
						sHtml += "<span data-id=" + sList[i].mbid + " class='studentInfo'>" + sList[i].membername + "<b class='icon iconfont icon-chahao'></b></span>"
						cHtml += "<option value=" + sList[i].mbid + ">" + sList[i].membername + "</option>"
					}
				}
				$('.students_list').html(sHtml);
				$('.studentSel select').html(cHtml);
			} else {
				return false;
			}
		}
	});
	//	点击学员显示对应的详细信息
	$('.students_list span.studentInfo').click(function() {
		$('.student_info .edit').removeClass('none');
		$('.student_info .save').addClass('none');
		$('.student_info input').attr('disabled', true);
		if($(this).children('b').is(':hidden')) {
			$(this).addClass('cur').siblings().removeClass('cur');
			var memberid = $(this).attr('data-id');
			$.ajax({
				type: "post",
				url: url + "/registered/getMemberBody.action",
				async: false,
				data: {
					mbodyid: memberid
				},
				success: function(data) {
					data = U.tJson(data);
					var dateofbirth = fmtDate(data.dateofbirth);
					$('#membername').val(data.membername);
					$('#choice_sex').val(data.sex);
					$('.Wdate').val(dateofbirth);
					$('#school').val(data.schoolname);
					$('#like').val(data.interests);
				}
			});
		} else {
			var mbid = $(this).attr('data-id');
			$(this).find('b').hide();
			$(this).siblings().find('b').hide();
			$('.mask').fadeIn(500);
			$('.dialog').fadeIn(700);
			$('.dialog .sure').click(function() {
				$('.mask').hide();
				$('.dialog').hide();
				$.ajax({
					type: "post",
					url: url + "/registered/editStartEndRegisteredUsersMemberBody.action",
					async: false,
					data: {
						mbid: mbid,
						state: 0
					},
					success: function(data) {
						data = JSON.parse(data);
						if(data && data != '' && data != undefined) {
							if(data.result == 1) {
								SimplePop.alert('删除成功！')
								$('.student_info input').val('');
								addStudentList();
								initStundentInfo();
							} else {
								SimplePop.alert('删除失败！');
							}
						}
					}
				});
			});
			$('.dialog .cancel').click(function() {
				$('.mask').hide();
				$('.dialog').hide();
			});
		}
	})
}
//初始化显示学员信息
function initStundentInfo() {
	$('.students_list span:first-child').addClass('cur');
	var memberid = $('.students_list span:first-child').attr('data-id');
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBody.action",
		async: false,
		data: {
			mbodyid: memberid
		},
		success: function(data) {
//			data = U.tJson(data);
			if(data!=''&&data!='null'){
				data = JSON.parse(data);
				var dateofbirth = fmtDate(data.dateofbirth);
				$('#membername').val(data.membername);
				$('#choice_sex').val(data.sex);
				$('.Wdate').val(dateofbirth);
				$('#school').val(data.schoolname);
				$('#like').val(data.interests);
			}
		}
	});
}
//时间戳转换成日期格式函数
function fmtDate(obj) {
	var date = new Date(obj);
	var y = 1900 + date.getYear();
	var m = "0" + (date.getMonth() + 1);
	var d = "0" + date.getDate();
	return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
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
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
//日历
function HCalendar(options) {
	var date = new Date();
	this.year = date.getFullYear();
	this.month = date.getMonth();
	this.date = date.getDate();
	this.curYear = date.getFullYear();
	this.curMonth = date.getMonth();
	this.curDay = date.getDate();
	this.history = true;
	this.selectedIndex = 0;
	this.create();
	this.createDate();
}
HCalendar.prototype.create = function() {
	var self = this,
		nowYear = this.year,
		nowMonth = this.month,
		nowDate = this.date;
	//框架
	var content = document.getElementById('content');
	//日期栏
	var info = document.createElement('div');
	info.setAttribute('class', 'HCalendar_info');
	var info_text = document.createElement('div');
	info_text.setAttribute('id', 'HCalendar_text');
	info.appendChild(info_text);
	info_text.innerHTML = nowYear + '年' + (++nowMonth) + '月' + nowDate + '日';
	self.text = info_text;
	//切换月份按钮
	var month_btl = document.createElement('button');
	month_btl.innerHTML = '<';
	var month_btr = document.createElement('button');
	month_btr.innerHTML = '>';
	month_btl.style.left = 0;
	month_btr.style.right = 0;
	info.appendChild(month_btl);
	info.appendChild(month_btr);
	//星期栏
	var week = document.createElement('ul');
	week.setAttribute('class', 'HCalendar_week');
	week.innerHTML = '<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>';
	//日历栏
	var day = document.createElement('ul');
	day.setAttribute('class', 'HCalendar_day');
	self.dayDom = day;
	//插入DOM
	content.appendChild(info);
	content.appendChild(week);
	content.appendChild(day);
	//切换月份
	month_btr.addEventListener('click', function() {
		self.changeMonth(1);
	});
	month_btl.addEventListener('click', function() {
		self.changeMonth(-1);
	});
}
HCalendar.prototype.changeMonth = function(dir) {
	var self = this;
	if(dir > 0) {
		self.month++;
		if(self.month > 11) {
			self.month = self.month - 12;
			self.year++;
		}
	} else {
		self.month--;
		if(self.month < 0) {
			self.month = self.month + 12;
			self.year--;
		}
	}
	self.createDate();
	$('.dialogBox ul').html('');
}
HCalendar.prototype.createDate = function() {
	var I = new Interfaces();
	var S = new Store();
	var U = new Url();
	var self = this,
		nullHtml = '',
		html = '',
		curYear = self.curYear,
		curMonth = self.curMonth,
		curDay = self.curDay,
		week = new Date(self.year, self.month, 1).getDay(),
		days = new Date(self.year, self.month + 1, 0).getDate();
	/*清空原日期*/
	self.dayDom.innerHTML = '';
	for(var i = 0; i < week; i++) {
		nullHtml += '<li></li>';
	}
	//	判断月份是否小于10,小于10补零
	if(self.month < 9) {
		month = "0" + (self.month + 1);
	} else {
		month = (self.month + 1);
	}
	if(curDay < 10) {
		curDay = '0' + curDay
	};
	/*加入日期列表*/
	for(var i = 1; i <= days; i++) {
		if(i < 10) {
			i = '0' + i
		};
		if(curYear == self.year && curMonth == self.month && i < curDay) {
			if(self.history) {
				html += '<li class="previously" data-value=' + self.year + month + i + '>' + i + '</li>';
			} else {
				html += '<li data-value=' + self.year + month + i + '>' + i + '</li>';
			}
			continue;
		} else if(self.year < curYear || (curYear == self.year && self.month < self.curMonth)) {
			if(self.history) {
				html += '<li class="previously" data-value=' + self.year + month + i + '>' + i + '</li>';
			} else {
				html += '<li data-value=' + self.year + month + i + '>' + i + '</li>';
			}
			continue;
		} else if(curYear == self.year && curMonth == self.month && i == curDay) {
			html += '<li class="highlight" data-value=' + self.year + month + i + '>' + i + '</li>';
			continue;
		} else {
			html += '<li data-value=' + self.year + month + i + '>' + i + '</li>';
		}
	}
	self.dayDom.innerHTML = nullHtml + html;
	self.text.innerHTML = self.year + '年' + month + '月';
	//寻找有课的那天特殊显示
	var data = schedule_arr;
	if(data != "" && data != null) {
		for(var i = 0; i < data.length; i++) {
			courseDate = Number(data[i][4].replace(/-/g, ""));
			$('.HCalendar_day li[data-value="' + courseDate + '"]').addClass('haveCourse');
		}
		event(); //点击有课当天显示详情
	}
}
HCalendar.init = function(options) {
	return new HCalendar(options)
}
//点击课程显示详情
function event() {
	$('.HCalendar_day li').click(function() {
		var riqi = $(this).attr('data-value');
		var I = new Interfaces();
		var S = new Store();
		var U = new Url();
		var arr = []; //存储课程信息
		var lhtml = "";
		var temp = {};
		var mbid = $('.studentSel select').val();
		$.ajax({
			type: "post",
			url: url + "/registered/getMemberBodyArranging.action",
			async: false,
			data: {
				mbid: mbid,
				courseid: 0,
				classid: 0
			},
			success: function(data) {
				var student_schedule = U.tJson(data);
				for(var i = 0; i < student_schedule.length; i++) {
					courseDate = Number(student_schedule[i][4].replace(/-/g, ""));
					if(courseDate == riqi) {
						temp = student_schedule[i];
						arr.push(temp);
					}
				}
				//console.log(arr);
				$('.dialogBox ul').html('');
				if(arr != '') {
					for(var j = 0; j < arr.length; j++) {
						var attend = arr[j][11];
						if(attend != '' && attend != null) {
							attend = attend;
						} else {
							attend = '无考勤记录';
						}
						lhtml += "<li>" +
							"<div>课&nbsp;&nbsp;程：" + arr[j][2] + "</div>" +
							"<div>班&nbsp;&nbsp;级：" + arr[j][3] + "</div>" +
							"<div>教&nbsp;&nbsp;室：" + arr[j][7] + "</div>" +
							"<div>地&nbsp;&nbsp;址：" + arr[j][8] + "</div>" +
							"<div>时&nbsp;&nbsp;间：" + formatDateTimeSecond(arr[j][5]) + "至" + formatDateTimeSecond(arr[j][6]) + "</div>" +
							"<div>考&nbsp;&nbsp;勤：" + attend + "</div>"
						"</li>"
					}
					$('.dialogBox ul').append(lhtml);
					if(arr.length == 1) {
						$('.dialogBox ul li').css({
							'float': 'none',
							'margin': '10px auto'
						});
					}
				}
			}
		});
	})
};
//通知和私信
function messages() {
	getClassList();
	$('.notice_list').on('click', 'li', function() {
		var classId = $(this).attr('data-id');
		var courseName = $(this).find('b').text();
		$('.notice_detail .chatName').html(courseName + '<span class="back" id="back1" title="返回"></span>');
		S.set('classid', classId);
		$(this).parents('.notice_list').addClass('none');
		$('.notice_detail').removeClass('none');
		getTeacherList();
	});
	$('.notice_detail').on('click', 'li', function() {
		var teacherId = $(this).attr('data-id');
		var teacherName = $(this).find('b').text();
		var chatInfo = $(this).find('img').attr('src');
		teacherImg = chatInfo; //保存点进来的教师头像
		S.set('teacherId', teacherId);
		$('.private_letter').removeClass('none');
		$('.private_letter').find('b').text(teacherName);
		$('.notice').addClass('none');
		//		查看当前是否有未读消息有则调取聊天记录
		if(parseInt($(this).find('.chatSign').text()) != 0) {
			time = getNowFormatDate();
			$('.private_letter>ul').html('');
			chatList();
		}
		reStartUnread();
	});
	$('#back2').click(function() {
		$('.private_letter').addClass('none');
		$('.notice').removeClass('none');
		$('.notice_detail').removeClass('none');
		reStartUnread();
		getTeacherList(); //重新获取教师列表
	});
	$('.notice_detail').on('click', '#back1', function() {
		$('.notice_list').removeClass('none');
		$('.notice_detail').addClass('none');
		getClassList(); //重新获取班级列表
	});
	//查询聊天记录，点击查看更多
	$('.private_letter .getMore').click(function() {
		chatList();
	})
}
var ws = new WebSocket("ws://39.106.112.14/ws/websocket");
ws.onopen = function() {
	login();
};
ws.onmessage = function(evt) {
	var ms = JSON.parse(evt.data);
	//console.log(ms);
	if($('.private_letter').is(':hidden')) {
		var teacherid = ms.userid.replace('t', '');
		var unreadNum = parseInt($('.notice_detail ul li[data-id="' + teacherid + '"]').find('.chatSign').text()); //未读消息数
		unreadNum += 1;
		$('.notice_detail ul li[data-id="' + teacherid + '"]').find('.chatSign').show().text(unreadNum);
		getClass(teacherid);
		for(var i = 0; i < classList.length; i++) {
			var num = Number($('.notice_list>li[data-id="' + classList[i] + '"]').children('.unread').text());
			//alert($('.notice_list>li[data-id="'+classList[i]+'"]').children('.unread').text());
			num += 1;
			$('.notice_list>li[data-id="' + classList[i] + '"]').find('.unread').show().text(num);
		}
	} else {
		var li = "<li><img src='" + teacherImg + "'><p>" + ms.msg + "</p></li>";
		$('.private_letter>ul').append(li);
	}
};
ws.onclose = function(evt) {
	//alert("WebSocketClosed!");
};
ws.onerror = function(evt) {
	//alert(evt);
};

function login() {
	if(ws != null && userid != '') {
		var login = {
			"userid": 'u' + userid,
			"type": "loginWS"
		};
		ws.send(JSON.stringify(login));
	}
}

function sendMyMessage() {
	var textMessage = $("#textMessage").val();
	//	var userid = S.get('userId');
	var senduserid = S.get('teacherId');
	if(ws != null && textMessage != '') {
		var text = [{
			userid: 'u' + userid,
			senduserid: 't' + senduserid,
			textMessage: textMessage,
			sendtype: 1
		}];
		ws.send(JSON.stringify(text));
		var li = "<li class='me'><img src='" + avatarImg + "'><p>" + textMessage + "</p></li>";
		$('.private_letter>ul').append(li);
		$("#textMessage").val('');
	}
}
//更变流水未读状态
function reStartUnread() {
	var teacherId = S.get('teacherId');
	$.ajax({
		type: "post",
		url: url + "/wsmessage/setMsgRead.action",
		async: false,
		data: {
			senduserid: userid,
			recuserid: teacherId,
			sendusertype: 1
		},
		success: function(data) {}
	});
}
//获取会员下对应的班级列表
function getClassList() {
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getClassByUser.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
			data = JSON.parse(data);
			$.each(data, function(i, item) {
				if(item.notReadCount == 0) {
					cHtml += '<li data-id="' + item.classid + '">' +
						'<img src="' + item.topimageurl + '" class="avatar" />' +
						'<b class="courseName">' + item.rname + '</b>' +
						'<span class="unread none">' + item.notReadCount + '</span>' +
						'</li>'
				} else {
					cHtml += '<li data-id="' + item.classid + '">' +
						'<img src="' + item.topimageurl + '" class="avatar" />' +
						'<b class="courseName">' + item.rname + '</b>' +
						'<span class="unread">' + item.notReadCount + '</span>' +
						'</li>'
				}
			});
			$('.message .notice_list').html(cHtml);
		}
	});
}
//根据班级id和用户id获取教师列表
function getTeacherList() {
	var tHtml = '';
	var classid = S.get('classid');
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getTeacherByClass.action",
		async: false,
		data: {
			userid: userid,
			classid: classid
		},
		success: function(data) {
			data = JSON.parse(data);
			$.each(data, function(i, item) {
				if(item.notReadCount == 0) {
					tHtml += '<li data-id="' + item.teacherid + '">' +
						'<div class="chatPhoto">' +
						'<img src="' + item.topimageurl + '">' +
						'<span class="chatSign none">' + item.notReadCount + '</span>' +
						'</div>' +
						'<div class="chatInfo">' +
						'<div class="chatNote"><b>' + item.rname + '</b><span>' + item.opertime + '</span></div>' +
						'<div class="chatMes">' + item.cont + '</div>' +
						'</div>' +
						'</li>'
				} else {
					tHtml += '<li data-id="' + item.teacherid + '">' +
						'<div class="chatPhoto">' +
						'<img src="' + item.topimageurl + '">' +
						'<span class="chatSign">' + item.notReadCount + '</span>' +
						'</div>' +
						'<div class="chatInfo">' +
						'<div class="chatNote"><b>' + item.rname + '</b><span>' + item.opertime + '</span></div>' +
						'<div class="chatMes">' + item.cont + '</div>' +
						'</div>' +
						'</li>'
				}
			});
			$('.notice_detail>ul').html(tHtml);
		}
	});
}
//根据会员id和教师id查询对应班级
var classList;

function getClass(teacherId) {
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getClassByTeacherUser.action",
		async: false,
		data: {
			teacherid: teacherId,
			userid: userid
		},
		success: function(data) {
			data = JSON.parse(data);
			classList = data;
		}
	});
}
//获取系统时间用来查询聊天记录
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
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}
//查询聊天记录
function chatList() {
	if(!time || time == undefined) {
		time = getNowFormatDate();
	}
	var html = '';
	var recuserid = S.get('teacherId');
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getMsgPage.action",
		async: false,
		data: {
			'page': 1,
			'limit': 5,
			'senduserid': userid,
			'recuserid': recuserid,
			'sendusertype': 1,
			'time': time
		},
		success: function(data) {
			data = JSON.parse(data);
			console.log(data);
			$.each(data, function(i, item) {
				if(item.sendusertype != 1) {
					html += "<li><img src='" + teacherImg + "'><p>" + item.cont + "</p></li>";
				} else {
					html += "<li class='me'><img src='" + teacherImg + "'><p>" + item.cont + "</p></li>";
				}
				if(i == 0) {
					time = formatDateTimeSecond(item.opertime);
				}
			});
			$(".private_letter>ul").prepend(html);
		}
	});
}
//订单
$(function() {
	var U = new Url();
	var S = new Store();
	var pageNumber = 3; //每页条数
	var totalPage; //总页数
	var totalRecords;
	var userid = S.get('userId');
	//	请求总记录条数
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderCount.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
			totalRecords = data;
			totalPage = parseInt(totalRecords / pageNumber);
		}
	});
	//	默认请求第一页显示
	query_orderlist(1);
	//生成分页
	kkpager.generPageHtml({
		//总页码
		total: totalPage,
		//总数据条数
		totalRecords: totalRecords,
		mode: 'click', //默认值是link，可选link或者click
		click: function(n) {
			query_orderlist(n);
			//手动选中按钮
			this.selectPage(n);
			return false;
		}
	});
});
//获取订单列表
function query_orderlist(n) {
	var S = new Store();
	var U = new Url();
	var orderHtml = '';
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderPage.action",
		async: false,
		data: {
			userid: userid,
			page: n,
			limit: 3
		},
		success: function(data) {
			if(data != 'null'&&data!='[]') {
				data = JSON.parse(data);
				//console.log(data);
				for(var i = 0; i < data.length; i++) {
					var orderid = data[i][0];
					order_detail(orderid);
					var data_detail = JSON.parse(S.get('order_detail_data'));
					var buyDate = formatDateTimeSecond(data[i][2]);
					var price = parseFloat(data[i][4] / 100);
					var state = '';
					if(data[i][6] == 1) {
						state = '已付费';
					} else {
						state = '未付费';
					};
					orderHtml += '<li>' +
						'<h1><b>订单编号：</b>' + orderid + '<b>购买时间：</b>' + buyDate + '<em><b>状态：</b>' + state + '</em></h1>' +
						'<div>' +
						'<img src="' + data_detail[17] + '" />' +
						'<div class="middle">' +
						'<h3>' + data_detail[13] + '</h3>' +
						'<ul>' +
						'<li><span>班级名称：</span>' + data_detail[8] + '</li>' +
						'<li><span>专业名称：</span>' + data_detail[13] + '</li>' +
						'<li><span>学员姓名：</span>' + data_detail[14] + '</li>' +
						'<li><span>开课时间：</span>' + data_detail[16] + '</li>' +
						'<li><span>上课教室：</span>' + data_detail[19] + '</li>' +
						'<li><span>上课校区：</span>' + data_detail[18] + '</li>' +
						'</ul></div>' +
						'<div class="right">' +
						'<p><span>购买数量：</span>x' + data[i][3] + '</p>' +
						'<p><span>订单金额：</span>￥' + price + '</p>' +
						'<a href="buy_course.html?classid=' + data_detail[7] + '">去支付</a>' +
						'</div>' +
						'</li>'
				}
				$('.order_list>ul').html(orderHtml);
			} else if(n==1){
				$('.my_order ul').html('<h3 style="text-align:center;color:#666;">当前无订单数据</h3>');
				$('.my_order #kkpager').hide();
				return false;
			}
		}
	})
}
//订单详情
function order_detail(orderid) {
	var S = new Store();
	var U = new Url();
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderDetailPageList.action",
		async: false,
		data: {
			orderid: orderid
		},
		success: function(data) {
			if(data && data != '[]' && data != null && data != undefined) {
				S.set('order_detail_data', data);
			} else {
				return false;
			}
		}
	});
}
//获取学员对应的课程
function getStudentClass(mbid) {
	var cHtml = '';
	var startdate = '';
	var enddate = '';
	$.ajax({
		type: "post",
		url: url + "/registered/getSchoolClassListByMbid.action",
		async: false,
		data: {
			mbid: mbid
		},
		success: function(data) {
			if(data != 'null' && data != '') {
				data = JSON.parse(data);
				for(var i = 0; i < data.length; i++) {
					startdate = fmtDate(data[i][7]);
					enddate = fmtDate(data[i][8]);
					cHtml += '<tr><td>' + data[i][0] + '</td><td>' + data[i][1] + '</td><td>' + data[i][2] + '</td><td>' + startdate + '</td><td>' + enddate + '</td></tr>'
				}
				$('.student_course tbody').html(cHtml);
			}
		}
	});
}
//优惠券
function queryCoupon(){
	var couponHtml ='';
	var rechargeMoney = '';//充值金额
	var toUseMoney = '';//抵用金额
	var validity = '';//有效期
	$.ajax({
		type:"post",
		url:url+"/coupons/getCouponsListByPage.action",
		async:false,
		data:{userid:userid},
		success:function(data){
			if(data!=null&&data!=''){
				data = JSON.parse(data);
				for(var i=0;i<data.length;i++){
					rechargeMoney = (data[i].amountofmoney/100).toFixed(2);
					toUseMoney = (data[i].couponsmoney/100).toFixed(2);
					validity = fmtDate(data[i].startusedate)+'-'+fmtDate(data[i].endusedate);
					couponHtml+='<tr><td>'+data[i].couponsnum+'</td><td>'+rechargeMoney+'</td><td>'+toUseMoney+'</td><td>'+validity+'</td></tr>'
				}
				$('.coupon table tbody').html(couponHtml);
			}
		}
	});
}
//惠民卡
function queryHuiminCard(){
	var huiminHtml ='';
	var rechargeMoney = '';//充值金额
	var toUseMoney = '';//抵用金额
	var validity = '';//有效期
	$.ajax({
		type:"post",
		url:url+"/huimincard/getHuiminCardListByUserId.action",
		async:false,
		data:{userid:userid,scid:0},
		success:function(data){
			if(data!=null&&data!=''){
				data = JSON.parse(data);
				for(var i=0;i<data.length;i++){
					rechargeMoney = (data[i].amountofmoney/100).toFixed(2);
					toUseMoney = (data[i].cardmoney/100).toFixed(2);
					validity = fmtDate(data[i].startusedate)+'-'+fmtDate(data[i].endusedate);
					huiminHtml+='<tr><td>'+data[i].cardnum+'</td><td>'+rechargeMoney+'</td><td>'+toUseMoney+'</td><td>'+validity+'</td></tr>'
				}
				$('.huiminCard table tbody').html(huiminHtml);
			}
		}
	});
}
