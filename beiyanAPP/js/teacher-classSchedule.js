var schedule_arr; //保存课程表数组
$(function() {
	//	教师课程表
	initSchedule();
});
//初始化学员课程表
function initSchedule() {
	var S = new Store();
	var teacherid =S.get('userid');
	$.ajax({
		type: "post",
		url: url + "/teacher/getClassTableByTeacherId.action",
		async: false,
		data: {
			teacherid:teacherid
		},
		success: function(data) {
			if(data && data!=''){
				data = JSON.parse(data);
				schedule_arr = data;
				$('.HCalendar_info').remove();
				$('.HCalendar_week').remove();
				$('.HCalendar_day').remove();
				HCalendar.init({});
			}else{
				HCalendar.init({});
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
				html += '<li class="previously" data-value=' + self.year + month + i + '><span>' + i + '</span></li>';
			} else {
				html += '<li data-value=' + self.year + month + i + '><span>' + i + '</span></li>';
			}
			continue;
		} else if(self.year < curYear || (curYear == self.year && self.month < self.curMonth)) {
			if(self.history) {
				html += '<li class="previously" data-value=' + self.year + month + i + '><span>' + i + '</span></li>';
			} else {
				html += '<li data-value=' + self.year + month + i + '><span>' + i + '</span></li>';
			}
			continue;
		} else if(curYear == self.year && curMonth == self.month && i == curDay) {
			html += '<li class="highlight" data-value=' + self.year + month + i + '><span>' + i + '</span></li>';
			continue;
		} else {
			html += '<li data-value=' + self.year + month + i + '><span>' + i + '</span></li>';
		}
	}
	self.dayDom.innerHTML = nullHtml + html;
	self.text.innerHTML = self.year + '年' + (self.month + 1) + '月';
	//寻找有课的那天特殊显示
	var data = schedule_arr;
	if(data != "" && data != null) {
		for(var i = 0; i < data.length; i++) {
			courseDate = Number(data[i][3].replace(/-/g, ""));
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
		var S = new Store();
		var riqi = $(this).attr('data-value');
		var arr = []; //存储课程信息
		var lhtml = "";
		var temp = {};
		var teacherid = S.get('userid');
		$.ajax({
			type: "post",
			url: url + "/teacher/getClassTableByTeacherId.action",
			async: false,
			data: {
				teacherid:teacherid
			},
			success: function(data) {
				var student_schedule = JSON.parse(data);
				for(var i = 0; i < student_schedule.length; i++) {
					courseDate = Number(student_schedule[i][3].replace(/-/g, ""));
					if(courseDate == riqi) {
						temp = student_schedule[i];
						arr.push(temp);
					}
				}
				$('.dialogBox ul').html('');
				if(arr != '') {
					for(var j = 0; j < arr.length; j++) {
						lhtml += "<li>" +
							"<div>课&nbsp;&nbsp;程：" + arr[j][1] + "</div>" +
							"<div>班&nbsp;&nbsp;级：" + arr[j][2] + "</div>" +
							"<div>教&nbsp;&nbsp;室：" + arr[j][5] + "</div>" +
							"<div>地&nbsp;&nbsp;址：" + arr[j][6] + "</div>" +
							"<div>时&nbsp;&nbsp;间：" + arr[j][4] + "</div>" +
							"</li>"
					}
					$('.dialogBox ul').append(lhtml);
				}
			}
		});
	})
};
//时间戳转换成日期格式函数
function fmtDate(obj) {
	var date = new Date(obj);
	var y = 1900 + date.getYear();
	var m = "0" + (date.getMonth() + 1);
	var d = "0" + date.getDate();
	return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}