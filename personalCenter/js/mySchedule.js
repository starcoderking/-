function scheduleInit(){
	getStudentList();
	initSchedule();
	scheduleEvent();
	getStudentClass();
}
//获取学员列表
function getStudentList(){
	var S = new Store();
	var userid = S.get('userId');
	var sHtml = '';
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBodyByUserId.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
			if(data != '' && data != null) {
				sList = JSON.parse(data);
				for(var i=0;i<sList.length;i++){
					if(i==0){
						sHtml+='<span class="cur" data-id="'+sList[i].mbid+'">'+sList[i].membername+'</span>'
					}else{
						sHtml+='<span data-id="'+sList[i].mbid+'">'+sList[i].membername+'</span>'
					}
				}
				$('.studentSel .StudentList').html(sHtml);
			}
		}
	});
}
//初始化学员课程表日历
function initSchedule() {
	var S = new Store();
	var mbid = $('.studentSel .StudentList .cur').attr('data-id');
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
				S.set('schedule_arr',data);
				data = U.tJson(data);
//				schedule_arr = data;
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
function scheduleEvent() {
	//点击日历课程表显示详情
	$('.HCalendar_day li').click(function() {
		var riqi = $(this).attr('data-value');
		var I = new Interfaces();
		var S = new Store();
		var U = new Url();
		var arr = []; //存储课程信息
		var lhtml = "";
		var temp = {};
		var mbid = $('.studentSel .StudentList .cur').attr('data-id');
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
				var student_schedule = JSON.parse(data);
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
	});
	//点击学员切换
	$('.studentSel .StudentList span').click(function(){
		$(this).addClass('cur').siblings().removeClass('cur');
		initSchedule();
		getStudentClass();
		$('.dialogBox>ul').html('');
	});
}
//获取学员对应的课程
function getStudentClass() {
	var mbid = $('.studentSel .StudentList .cur').attr('data-id');
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
//			console.log(data);
			if(data != 'null' && data != '') {
				data = JSON.parse(data);
				for(var i = 0; i < data.length; i++) {
					if(data[i][7]==null || data[i][7]==''){
						startdate = '待通知';
					}else{
						startdate = fmtDate(data[i][7]);
					}
					if(data[i][8]==null || data[i][8]==''){
						enddate = '待通知';
					}else{
						enddate = fmtDate(data[i][8]);
					}
					cHtml += '<tr><td>' + data[i][2] + '</td><td>' + data[i][10] + '</td><td>' + startdate + '</td><td>' + enddate + '</td></tr>'
				}
				$('.student_course tbody').html(cHtml);
			}
		}
	});
}
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
//	var data = schedule_arr;
	var data = S.get('schedule_arr');
		data = JSON.parse(data);
	if(data != "" && data != null &&data!='[]') {
		for(var i = 0; i < data.length; i++) {
			courseDate = Number(data[i][4].replace(/-/g, ""));
			$('.HCalendar_day li[data-value="' + courseDate + '"]').addClass('haveCourse');
		}
		scheduleEvent(); //点击有课当天显示详情
	}
}
HCalendar.init = function(options) {
	return new HCalendar(options)
}
//时间戳转换成日期格式函数
function fmtDate(obj) {
	var date = new Date(obj);
	var y = 1900 + date.getYear();
	var m = "0" + (date.getMonth() + 1);
	var d = "0" + date.getDate();
	return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}