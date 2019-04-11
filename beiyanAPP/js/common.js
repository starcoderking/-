var url='http://39.106.112.14';
$(function(){
	//记录地址
	var U = new Url();
	var S = new Store();
//	点击返回按钮返回到前一个页面
	$('.mui-action-back').click(function(){
		U.back(-1);
	})
});
//点击底部导航的链接
function main(){
	var S = new Store();
	var Type = S.get('userType');
	var userid = S.get('userid');
	$('.one').click(function(){
		if($(this).hasClass('mui-active')){
			return false;
		}
		location.href='./index.html';
		return false;
	});
	$('.two').click(function(){
		if($(this).hasClass('mui-active')){
			return false;
		}
		location.href='./business_hall.html';
		return false;
	});
	$('.three').click(function(){
		if($(this).hasClass('mui-active')){
			return false;
		}
		if(Type == 2){
			location.href='./member_message.html';
		}else if(Type==1){
			location.href='./message.html';
		}else{
			location.href='./login.html';
		}
		return false;
	});
	$('.four').click(function(){
		if($(this).hasClass('mui-active')){
			return false;
		}
		location.href = './show-index.html';
		return false;
	});
	$('.five').click(function(){
		if($(this).hasClass('mui-active')){
			return false;
		}
		if(Type == 1){
			location.href='./teacher_personal_center.html';
		}else if(Type == 2){
			location.href='./my.html';
		}else{
			location.href='./login.html';
		}
		return false;
	});
}
//导航项高亮显示
function navText(text){
    $('nav>a').each(function(){
        var thisText=$(this).children(".mui-tab-label").text()
        if(thisText==text){
            $(this).addClass('mui-active');
        }
    });
}
/*存储类构造函数*/
var Store = function(){
	this.data = '';
	//存储数据长度
	this.len = this.getLen();
};

/*存储类方法*/
Store.prototype = {
	//设置本地存储
	set : function(key,val){
		localStorage.setItem(key,val);
	},
	//获取本地存储
	get : function(key){
		return localStorage.getItem(key);
	},
	//删除本地存储
	del : function(key){
		localStorage.removeItem(key);
	},
	//删除所有存储
	delAll : function(){
		var k = '';
		for(var i=localStorage.length; i>=0; i--){
			k = localStorage.key(i);
			this.del(k);
		}
	},
	//控制台输出所有数据
	display : function(){
		var k = '';
		var v = '';
		for(var i=localStorage.length; i>=0; i--){
			k = localStorage.key(i);
			v = this.get(k);
			if(k===null){
				this.del(k);
			}else{
				console.log(k+'（'+v+'）');
			}
		}
	},
	//获取存取数据长度
	getLen : function(){
		return localStorage.length;
	}
};
/*URL管理类*/
var Url = function(){
	this.data = '';
};

/*URL方法*/
Url.prototype = {
	get : function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]); return null;
	},
	href : function (url,params){
		location.href = url;
	},
	back : function (to){
		history.back(to);
	},
	file : function(){
		var file = document.referrer;
		var start = file.lastIndexOf('/')+1;
		file = file.substr(start);
		end = file.indexOf('.');
		return file.substr(0,end);
	},
	tJson :function(oJson){
		var oj = oJson;
		var p1 = /\\\"+/g;
		var p2 = /\"\{+/g;
		var p3 = /\}\"+/g;

		oj = oj.replace(/\s+/g,"");
		oj = oj.replace(p1,"\"");
		oj = oj.replace(p2,"\{");
		oj = oj.replace(p3,"\}");
		return $.parseJSON(oj);	
	},
	ajax :function(url,params){
		$.ajax({
			url:url,
			async:false,
			type:'GET',
			dataType:'json',
			success: function(data){
				return data;
			},
			error:function(e){
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
  	//	获取个人信息
	query_personal_info: function() {
		var S = new Store();
		var U = new Url();
		var data_json = '';
		var userid = S.get('userid');
		$.ajax({
			type: "post",
			url: url + "/registered/getRegisteredUserByUserId.action",
			async: false,
			data: {
				userid: userid
			},
			success: function(data) {
				data_json = data;
			}
		});
		S.set('personal_info', JSON.stringify(data_json));
	},
	//	保存和修改个人信息
	save_personal_info: function(data) {
		$.ajax({
			type: "post",
			url: url + "/registered/editRegisteredusers.action",
			async: false,
			data: data,
			success: function(data_info) {
				data_info = JSON.parse(data_info);
				if(data_info.result == 1){
					$.alertView('保存成功');
				}else{
					$.alertView('保存失败');
				}
				return data_info;
//				return JSON.stringify(data_info);
			}
		});
	},
	//	修改密码
	change_pwd: function(data) {
		$.ajax({
			type: "post",
			url: url + "/registered/editUsersPasswords.action",
			async: false,
			data:data,
			success: function(data) {
				return data;
			}
		});
	},
  
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
	},
	//获取中心简介
	query_center_intro:function(centerid){
		var S = new Store();
		var U = new Url();
		var data_json = '';
		$.ajax({
			type: "post",
			url: url + "/sysinformation/getContByidShowByFrontEnd.action",
			async: false,
			data: {
				id:centerid
			},
			success: function(data) {
				data_json = data;
			}
		});
		S.set('center_intro', data_json);
	},
	//获取中心课程
	query_center_course:function(centerid,page){
		var S = new Store();
		var U = new Url();
		var data_json = '';
		$.ajax({
			type: "post",
			url: url + "/course/getCourseListIndexPage.action",
			async: false,
			data: {
				specialtyid:centerid,
				coursename:'',
				maxage:'',
				minage:'',
				schoolareaid:'',
				page:page,
				limit:6
			},
			success: function(data) {
				data_json = data;
			}
		});
		S.set('center_course', data_json);
	},
//	获取课程筛选的菜单
	query_filter:function(parentid,showstate){
		var S = new Store();
		var U = new Url();
		var data_json = '';
		$.ajax({
			type:"post",
			url:url + "/specialty/getPageSonSpecialty.action",
			async:false,
			data:{parentid:parentid,showstate:showstate},
			success:function(data){
				data_json = data;
			}
		});
		return data_json;
	},
//	获取校区菜单列表
	query_campus:function(){
		var S = new Store();
		var U = new Url();
		var data_json = '';
		$.ajax({
			type:"get",
			url:url + "/schoolarea/getSchoolAreaList.action",
			async:false,
			success:function(data){
				data_json = data;
			}
		});
		return data_json;
	},
//	获取新闻列表
	query_news:function(page,limit){
		var S = new Store();
		var data_json = '';
		$.ajax({
			crossOrigin: true,
			type:"get",
			url:url+"/news/getNews.action",
			async:false,
			success:function(data){
				data_json = data;
			}
		});
		return data_json;
	},
//	获取教师列表
	query_teacher_list:function(page){
		var data_json = '';
		$.ajax({
			crossOrigin: true,
			type:"post",
			url:url+"/teacher/getTeacherPageByFrontEnd.action",
			async:false,
			data:{page:page,limit:5},
			success:function(data){
				data_json = data;
			}
		});
		return data_json;
	},
//	获取优秀学员
	query_excellent_student:function(){
		var data_json = '';
		$.ajax({
			crossOrigin: true,
			type:"get",
			url:url + "/goodstudents/getGoodStudentsByistop.action",
			async:false,
			success:function(data){
				data_json = data;
			}
		});
		return data_json;
	}
};