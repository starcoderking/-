var url='http://39.106.112.14';
$(function() {
	$('.footer').load('footer.html',function(){
		$('.attention li').hover(function(){
			$(this).children('div').toggle();
		});
	});	
});
//判断用户是否登录
function main(){
	var S = new Store();
	var uid = S.get('userId');
	var uname = S.get('uname');
	if(uid!=''&&uid!=null){
		var text = '<li class="top_user"><a href="">'+uname+'</a></li>'+'<li class="top_quit"><a href="">退出</a></li>';
		$('.top-info .top-right').append(text);
		$('.top_quit').click(function(){
	        S.delAll();
	        location.href='index.html';
	        return false;
	    });
	}else{
		var text='<li><a href="login.html" class="h_login">登录</a></li>'
                +'<li><span>|</span></li>'
                +'<li><a href="register.html" class="h_register">注册</a></li>';
        $('.top-info .top-right').append(text);
	}
	$('.top-right .personal_center').click(function(){
		var uid = S.get('userId');
		if(uid!=''&&uid!=null){
			location.href='personal_center.html';
		}else{
			location.href='login.html';
		}
		return false;
	})
	$('.top-main .search button').click(function() {
		search();
	});
	var bodyHeight= Number(window.innerHeight)-410;
	//alert(window.innerHeight+"===="+bodyHeight);
	$('.container').css('min-height',bodyHeight+'px');
	var screenWidth = document.body.clientWidth;//设备屏幕的宽度
	$(".header").css('width',screenWidth+'px');
	$(".footer").css('width',screenWidth+'px');
}
//按下回车键进行搜索
function entersearch() {
	//alert(dd);
	var event = window.event || arguments.callee.caller.arguments[0];
	if(event.keyCode == 13) {
		search();
	}
}
//搜索函数
function search() {
	var text = $('.top-main .search input').val();
	if(text != '' && text != undefined) {
		window.location.href = 'searchCourse.html?courseName=' + text;
	}
}
//导航项高亮显示
function navText(text) {
	$('.navbar>ul>li').each(function() {
		var thisText = $(this).children("a").text()
		if(thisText == text) {
			$(this).addClass('cur');
		}
	});
}
//存储类构造函数
var Store = function() {
	this.data = '';
	//存储数据长度
	this.len = this.getLen();
}
//存储类方法
Store.prototype = {
	//设置本地存储
	set: function(key, val) {
		sessionStorage.setItem(key, val);
//		localStorage.setItem(key, val);
	},
	//获取本地存储
	get: function(key) {
		return sessionStorage.getItem(key);
//		return localStorage.getItem(key);
	},
	//删除本地存储
	del: function(key) {
		sessionStorage.removeItem(key);
//		localStorage.removeItem(key);
	},
	//删除所有存储
	delAll: function() {
		var k = '';
		for(var i = sessionStorage.length; i >= 0; i--) {
			k = sessionStorage.key(i);
			this.del(k);
		}
	},
	//控制台输出所有数据
	display: function() {
		var k = '';
		var v = '';
		for(var i = sessionStorage.length; i >= 0; i--) {
			k = sessionStorage.key(i);
			v = this.get(k);
			if(k === null) {
				this.del(k);
			} else {
				console.log(k + '(' + v + ')');
			}
		}
	},
	//获取数据存储长度
	getLen: function() {
		return sessionStorage.length;
	}
};
//URL管理类
var Url = function() {
	this.data = '';
};
/*URL方法*/
Url.prototype = {
	get: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r !== null) return unescape(r[2]);
		return null;
	},
	href: function(url, params) {
		location.href = url;
	},
	back: function(to) {
		history.back(to);
	},
	file: function() {
		var file = document.referrer;
		var start = file.lastIndexOf('/') + 1;
		file = file.substr(start);
		end = file.indexOf('.');
		return file.substr(0, end);
	},
	tJson: function(oJson) {
		var oj = oJson;
		var p1 = /\\\"+/g;
		var p2 = /\"\{+/g;
		var p3 = /\}\"+/g;
		oj = oj.replace(/\s+/g, "");
		oj = oj.replace(p1, "\"");
		oj = oj.replace(p2, "\{");
		oj = oj.replace(p3, "\}");
		return $.parseJSON(oj);
	},
	ajax: function(url, params) {
		$.ajax({
			url: url,
			async: false,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				return data;
			},
			error: function(e) {
				console.log(e);
				return false;
			}

		});
	}
};
//接口类处理
var Interfaces = function() {
	this.data = '';
};
Interfaces.prototype = {
	//	获取学员列表
	query_student: function() {
		var U = new Url();
		var S = new Store();
		var url = 'queryStudent.json';
		var data_json = '';
		$.ajax({
			//contentType: "application/json; charset=utf-8",
			crossOrigin: true,
			//crossDomain: true,
			url: url,
			async: false,
			type: 'get',
			dataType: 'json',
			data: {
				'userid': 16
			},
			success: function(data) {
				data_json = data;
			}
		});
		S.set('student_list', JSON.stringify(data_json));
	},
	//	获取学员对应的课程数据
	queryStudent_schedule: function() {
		var U = new Url();
		var S = new Store();
		var url = 'studentData.json';
		var data_json = '';
		$.ajax({
			//contentType: "application/json; charset=utf-8",
			crossOrigin: true,
			//crossDomain: true,
			url: url,
			async: false,
			type: 'get',
			dataType: 'json',
			data: {
				'mbid': 16
			},
			success: function(data) {
				
				data_json = data;
			}
		});
		S.set('student_schedule', JSON.stringify(data_json));
	}
}
