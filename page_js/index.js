var navArr = ''; //用来保存轮播图左侧导航栏的数据 
$(function() { 
	if(GetQueryString('memberId')&&GetQueryString('memberId')!=''){
		autoLogin(); //自动登录
	};
	$('.header_box').load('header.html', function() {
		main();
		navText('首页');
	});
	navBar(); //轮播图左侧导航栏
	banner(); //轮播图加载
	courseRec(); //课程推荐
	carousel(); //图片轮播
	scroll();
	starTeacherNav(1);
	starTeacher(2); //添加明星教师列表
	teacherScroll();
	$('.banner_nav').on('click','.nav_detail ul li a',function(){
		var courseid = $(this).attr('data-id');
		$.ajax({
			type:"post",
			url:url+"/class/getSchoolClassListByCourseId.action",
			async:false,
			data:{courseid:courseid},
			success:function(data){
				if(data=='' || data==null || data=='[]'){
					SimplePop.alert('该课程暂未开课，如有疑问请电话联系。');
				}else{
					location.href='course_detail.html?id='+courseid;
				}
			}
		});
		return false;
	})
	//	轮播图左侧导航栏
	$('.banner_nav>li').hover(function() {
		var thisId = $(this).children('a').attr('data-id');
		var cHtml = ''; //二级
		var sHtml = ''; //三级
		$.each(navArr, function(i, item) {
			var banHtml = '';
			if(item.parentid == thisId) {
				//				if($('.nav_detail>h3').attr('data-id')==item.specialtyid){
				//					return false;
				//				}else{
				//					cHtml+='<h3 data-id="'+item.specialtyid+'">'+item.specialtyname+'</h3>'
				//					+'<ul class="'+item.specialtyid+'"></ul>'
				//				}
				//				三级导航的班级数据
				var banData = item.courselist;
				for(var i = 0; i < item.courselist.length; i++) {
					banHtml += '<li><a href="course_detail.html?id=' + banData[i].courseid + '" data-id="' + banData[i].courseid + '" target="_blank">' + banData[i].coursename + '</a></li>'
//					banHtml += '<li data-id="'+banData[i].courseid+'">'+banData[i].coursename+'</li>'
				}
				cHtml += '<h3 data-id="' + item.specialtyid + '">' +
					'<a href="featuresCourse.html?id=' + item.specialtyid + '" target="_blank">' + item.specialtyname + '</a>' +
					'</h3>' +
					'<ul class="' + item.specialtyid + '">' + banHtml + '</ul>'
				var pid = item.specialtyid;
			}
		});
		$(this).children('.nav_detail').html(cHtml);
		//		var num = $(this).children('.nav_detail').children('h3').length;
		//		for(var i = 0; i < num; i++) {
		//			var secid = $(this).children('.nav_detail').find('h3').eq(i).attr('data-id');
		//			sHtml = '';
		//			$.each(navArr, function(i, item) {
		//				if(item.parentid == secid) {
		//					sHtml += '<li><a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '">' + item.specialtyname + '</a></li>'
		//					$('.nav_detail>h3[data-id="' + secid + '"]').next('ul').html(sHtml);
		//				}
		//			});
		//		}
		$(this).css('background', "#f8f8f8");
		$(this).find('a').css('color', "#666");
		if(thisId != 25) {
			//alert($(this).index());.css('top',(Number($(this).index())*49)+'px')
			$(this).children('.nav_detail').show();
		}

	}, function() {
		$(this).css('background', "#666");
		$(this).find('a').css('color', "#fff");
		$('.nav_detail').hide();
	})
	news(); //新闻资讯列表
	//	新闻资讯无缝滚动
	if($('.myscroll>.u1 li').length > 7) {
		var time = 100;
		var myScroll = setInterval(scrollUp, time);
		$('.myscroll').mouseover(function() {
			clearInterval(myScroll);
		})
		$('.myscroll').mouseout(function() {
			myScroll = setInterval(scrollUp, time)
		})
	}
	//  明星教师显示
	$('.star_teacher .nav span').hover(function() {
		$(this).addClass('cur').siblings().removeClass('cur');
		var i = $(this).attr('data-id');
		starTeacher(i);
		//$('.teacher_list .coat>ul').eq(i).show().siblings().hide();
	});
//	关闭侧边栏二维码
	$('.fixedCode .close').click(function(){
		$('.fixedCode').hide();
	});
	courseCountDown();//初始化课程倒计时
//	报名倒计时中心的点击事件
	$('.center-tab .centerName').on('click','span',function(){
		$(this).addClass('cur').siblings('span').removeClass('cur');
		courseCountDown();
	});
});
//轮播图左侧的导航栏
function navBar() {
	var nHtml = '';
	$.ajax({
		type: "get",
		url: url + "/specialty/getPageSpecialtyList.action",
		async: false,
		success: function(data) {
			if(data != '' && data != 'null' && data != 'undefined') {
				data = JSON.parse(data);
				//console.log(data);
				navArr = data;
				$.each(navArr, function(i, item) {
					if(item.curdegree == 2 && navArr != '' && navArr != undefined) {
						if(item.specialtyid == 2) {
							nHtml += '<li>' +
								'<a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '" target="_blank"><em class="icon iconfont icon-xiganqiaochenfufc9702"></em>' + item.specialtyname + '</a>' +
								'<div class="nav_detail none">' +
								'</div>' +
								'</li>'
						} else if(item.specialtyid == 3) {
							nHtml += '<li>' +
								'<a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '" target="_blank"><em class="icon iconfont icon-yinlebiaoyan-"></em>' + item.specialtyname + '</a>' +
								'<div class="nav_detail none">' +
								'</div>' +
								'</li>'
						} else if(item.specialtyid == 4) {
							nHtml += '<li>' +
								'<a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '" target="_blank"><em class="icon iconfont icon-xiqu"></em>' + item.specialtyname + '</a>' +
								'<div class="nav_detail none">' +
								'</div>' +
								'</li>'
						} else if(item.specialtyid == 5) {
							nHtml += '<li>' +
								'<a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '" target="_blank"><em class="icon iconfont icon-quyizatan"></em>' + item.specialtyname + '</a>' +
								'<div class="nav_detail none">' +
								'</div>' +
								'</li>'
						} else if(item.specialtyid == 6) {
							nHtml += '<li>' +
								'<a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '" target="_blank"><em class="icon iconfont icon-wudao"></em>' + item.specialtyname + '</a>' +
								'<div class="nav_detail none">' +
								'</div>' +
								'</li>'
						} else if(item.specialtyid == 7) {
							nHtml += '<li>' +
								'<a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '" target="_blank"><em class="icon iconfont icon-portal"></em>' + item.specialtyname + '</a>' +
								'<div class="nav_detail none">' +
								'</div>' +
								'</li>'
						} else if(item.specialtyid == 25) {
							nHtml += '<li>' +
								'<a href="featuresCourse.html?id=' + item.specialtyid + '" data-id="' + item.specialtyid + '" target="_blank"><em class="icon iconfont icon-tesekecheng"></em>' + item.specialtyname + '</a>' +
								'<div class="nav_detail none">' +
								'</div>' +
								'</li>'
						}
						/*else{
												return false;
											}*/
					}
				});
				$('.banner_group>.banner_nav').html(nHtml);
			}
		}
	});
}
//轮播图列表
function banner() {
	var lHtml = '';
	$.ajax({
		type: "get",
		//url:'./data/banner.json',
		url: url + "/pictureshow/getPictureShow.action",
		async: false,
		success: function(data) {
			if(data != '' && data != 'null' && data != 'undefined') {
				data = JSON.parse(data);
				//console.log(data);
				$.each(data, function(i, item) {
					if(i == 0) {
						if(item.typenum == 1) {
							lHtml += '<a href="picture.html?id=' + item.id + '" class="link">' +
								'<li data-id="' + item.id + '" style="background:url(' + item.url + ') center 0 no-repeat; display:block;z-index:20;background-size:100% 100%;">' +
								'</li>' +
								'</a>'
						} else {
							lHtml += '<a href="' + item.weburl + '" class="link">' +
								'<li data-id="' + item.id + '" style="background:url(' + item.url + ') center 0 no-repeat; display:block;z-index:20;background-size:100% 100%;">' +
								'</li>' +
								'</a>'
						}
					} else if(i < 4) {
						if(item.typenum == 1) {
							lHtml += '<a href="picture.html?id=' + item.id + '" class="link">' +
								'<li data-id="' + item.id + '" style="background:url(' + item.url + ') center 0 no-repeat; display:block;background-size:100% 100%;">' +
								'</li>' +
								'</a>'
						} else {
							lHtml += '<a href="' + item.weburl + '" class="link">' +
								'<li data-id="' + item.id + '" style="background:url(' + item.url + ') center 0 no-repeat; display:block;background-size:100% 100%;">' +
								'</li>' +
								'</a>'
						}
					} else {
						return false;
					}
				});
				$('.banner>ul').html(lHtml);
			}
		}
	});
}
//课程推荐
function courseRec() {
	var cHtml = '';
	var minNum;
	var maxNum;
	var stateHtml;
	var random = ''; //随机数
	$.ajax({
		type: "get",
		url: url + "/course/getIndexCourseList.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			if(data != '' && data != undefined) {
				$.each(data, function(i, item) {
					//console.log(data)
					var price = parseFloat(item[11] / 100);
					var startTime = item[3];//开课时间
					if(startTime==''||startTime==null){
						startTime = '待教务老师通知';
					}
					minNum = Number(item[8]);
					maxNum = Number(item[9]);
					var proportion = minNum/maxNum;
					if(proportion <= 0.3&&proportion>=0) {
						stateHtml = '<b class="state01">余' + (maxNum - minNum) + '</b>'
					} else if(proportion < 0.6 && proportion > 0.3) {
						stateHtml = '<b class="state02">余' + (maxNum - minNum) + '</b>'
					} else if(proportion >= 0.6 && proportion<1){
						stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>余' + (maxNum - minNum) + '</b>'
					}else{
						stateHtml = '<b class="state04">已满</b>'
					}
					if(i < data.length) {
						cHtml += '<li>' +
							'<a href="course_detail.html?id=' + item[0] + '">' +
							'<img src="' + item[2] + '">' +
							'<div class="course_info">' +
							'<div class="title">' + item[1] + '</div>' +
							'<div class="info">' +
							'<span title="' + startTime + '">开课时间:' + startTime + '</span><b><em>￥</em>' + price + '</b>' +
							'</div>' +
							'</div>' +
							stateHtml +
							'</a>' +
							'</li>'
					} else {
						return false;
					}
				});
				$('.course_rec .coat>ul').html(cHtml);
			}
		}
	});
}
//课程报名倒计时
function courseCountDown(){
	var centerid = $('.center-tab .centerName .cur').attr('data-id');
	var cHtml = '';
	$.ajax({
		type:"post",
		url:url+"/course/getCountDownCourseListIndexPage.action",
		async:false,
		data:{specialtyid:centerid},
		success:function(data){
//			console.log(data);
			if(data!='' && data!='[]'){
				data = JSON.parse(data);
				for(var i=0;i<data.length;i++){
					var price = parseFloat(data[i][11]/100);
//					年龄要求
					var minage = data[i][4];
					var maxage = data[i][5];
					if(minage!=maxage&&maxage!=0){
						var ageClaim = minage+'-'+maxage+'岁';
					}else{
						var ageClaim = minage+'岁以上';
					}
					var timestamp = Date.parse(new Date());//当前时间的时间戳
					var startTimeTamp = data[i][3];//开课时间的时间戳
					var week = getDayOfWeek(fmtDate(data[i][3]));//周几
					var startClasstime = formatDateTimeSecond(data[i][3]);//每节课开始时间
					var endClasstime = formatDateTimeSecond(data[i][16]);//每节课结束时间
					var countDay =parseInt((startTimeTamp-timestamp)/(60*60*24*1000));
					if(countDay>0&&countDay<=1){
						countDay=1;
					}
					var startTime = fmtDate(data[i][3]);//开课日期
					var endTime = fmtDate(data[i][13]);//节课日期
//					课程日期
					cHtml+='<li>'
						+'<a href="course_detail.html?id='+data[i][0]+'">'
						+'<div class="course-info">'
						+'<h2>'+data[i][1]+'</h2>'
						+'<p>学员年龄：'+ageClaim+'</p>'
						if(startTimeTamp!=null){
							cHtml+='<p>'+startTime+'-'+endTime+'</p>'
								+'<p>'+week+startClasstime+'-'+endClasstime+'</p>'
						}
						cHtml+='<p>'+data[i][15]+'</p>'
						+'</div>'
						+'<div>'
						+'<span class="price">￥'+price+'</span>'
						if(startTimeTamp!=null&&countDay>0){
							cHtml+='<span class="count-day">报名截止<em>'+countDay+'</em>天</span>'
						}
						cHtml+='</div>'
						+'</a>'
						+'</li>'
				}
			}
			$('.center-course .course-list').html(cHtml);
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
	return h + ':' + minute;
};
//将日期'2018-01-01'转换成星期几
function getDayOfWeek(dayValue){
    var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
    var today = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
    return today[day.getDay()];
}
//明星教师
function starTeacherNav(id) {
	var nHtml = '';
	$.ajax({
		type: "post",
		url: url + "/specialty/getPageSonSpecialty.action",
		async: false,
		data: {
			parentid: id
		},
		success: function(data) {
			if(data != '' && data != 'null' && data != 'undefind') {
				data = JSON.parse(data);
				$.each(data, function(i, item) {
					if(i < 6 && i == 0) {
						nHtml += '<span class="cur" data-id="' + item.specialtyid + '">' + item.specialtyname + '</span>'
					} else if(i < 6) {
						nHtml += '<span data-id="' + item.specialtyid + '">' + item.specialtyname + '</span>'
					} else {
						return false;
					}
				});
				$('.star_teacher>h1').html(nHtml);
//				课程倒计时的中心
				$('.center-tab .centerName').html(nHtml);
			}
		}
	});
}

function starTeacher(index) {
	var tHtml = '';
	$.ajax({
		type: "post",
		url: url + "/teacher/getTeacher.action",
		async: false,
		data: {
			parentid: index
		},
		success: function(data) {
			data = JSON.parse(data);
			var width = data.length * 226;
			$('.teacher_list>.coat>ul').css('width', width + 'px');
			$.each(data, function(i, item) {
				tHtml += '<li>' +
					'<a href="teacher_detail.html?id=' + item.teacherid + '">' +
					'<img src="' + item.topimageurl + '">' +
					'<h2>' + item.teachername + '</h2>' +
					'</a>' +
					'</li>'
			});
			$('.teacher_list .coat>ul').html(tHtml);
		}
	});
}
//新闻资讯列表
function news() {
	var nHtml = '';
	$.ajax({
		type: "get",
		url: url + "/news/getNews.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			$.each(data, function(i, item) {
				nHtml += '<li>' +
					'<a href="news.html?nid=' + item.newsid + '" title="' + item.newsname + '"> ' + item.newsname + '</a>' +
					'</li>'
			});
			$('.myscroll .u1').html(nHtml);
			if($('.myscroll .u1 li').length>7){
				$('.myscroll .u2').html(nHtml);
			}
		}
	});
}
//新闻资讯滚动函数
function scrollUp() {
	if(-(parseInt($('.myscroll>.u1').css("marginTop"))) >= $('.u1')[0].offsetHeight) {
		$('.myscroll>.u1').css("marginTop", 0);
	} else {
		$('.myscroll>.u1').css("marginTop", parseInt($('.myscroll>.u1').css("marginTop")) - 1);
	}
}
//banner图片轮播
function carousel() {
	var number = $(".banner ul li").size() - 1; //图片的数量
	var cur = 0; //当前显示的图片
	var timer = 0; //定时器
	//下一个
	function slideNext() {
		if(cur < number) {
			$(".banner ul li").eq(cur).css({
				'z-index': 10
			}).stop().fadeOut();
			$(".banner ul li").eq(cur + 1).css({
				'z-index': 20
			}).stop().fadeIn();
			$(".indicator a").removeClass().eq(cur + 1).addClass("cur");
			cur += 1;
		} else {
			$(".banner ul li").eq(cur).css({
				'z-index': 10
			}).stop().fadeOut();
			$(".banner ul li").eq(0).css({
				'z-index': 20
			}).stop().fadeIn();
			$(".indicator a").removeClass().eq(0).addClass("cur");
			cur = 0;
		}
	}
	//上一个
	function slidePrev() {
		if(cur > 0) {
			$(".banner ul li").eq(cur).css({
				'z-index': 10
			}).stop().fadeOut();
			$(".banner ul li").eq(cur - 1).css({
				'z-index': 20
			}).stop().fadeIn();
			$(".indicator a").removeClass().eq(cur - 1).addClass("cur");
			cur -= 1;
		} else {
			$(".banner ul li").eq(cur).css({
				'z-index': 10
			}).stop().fadeOut();
			$(".banner ul li").eq(number).css({
				'z-index': 20
			}).stop().fadeIn();
			$(".indicator a").removeClass().eq(number).addClass("cur");
			cur = number;
		}
	}
	timer = setInterval(slideNext, 3000);
	//当鼠标移入banner时，清除定时器
	$(".banner").mouseover(function() {
		clearInterval(timer);
	});
	$(".banner").mouseout(function() {
		timer = setInterval(slideNext, 3000)
	});
	//上一个、下一个
	$(".banner .prev").click(function() {
		slidePrev();
	});
	$(".banner .next").click(function() {
		slideNext();
	});
	//小圆点指示器
	$(".indicator>a").mouseover(function() {
		var now = $(this).index(); //获取鼠标移入的是第几个a标记
		$(".indicator>a").removeClass(); //删除a标记中的class=cur
		$(this).addClass("cur"); //为此a标记添加cur样式
		$(".banner ul li").eq(cur).css({
			'z-index': 10
		}).stop().fadeOut(); //隐藏当前的图片
		$(".banner ul li").eq(now).css({
			'z-index': 20
		}).stop().fadeIn(); //显示和a序列号一样的图片
		cur = now; //为变量cur重新赋值，以便于再次启用定时器的时候，从当前显示的图片开始播放
	});
}
//课程推荐和优秀学员的轮播
function scroll() {
	$('.pre').click(function() {
		var u = $(this).siblings().find('ul');
		var w = $(this).siblings().find('li').css('width');
		u.stop().animate({
			marginLeft: '-210px'
		}, 500, function() {
			u.css({
				marginLeft: 0
			}).find('li:first').appendTo(u);
		})
	})
	$('.next').click(function() {
		var u = $(this).siblings().find('ul');
		var w = $(this).siblings().find('li').css('width');
		u.stop().animate({
			marginLeft: '210px'
		}, 500, function() {
			u.css({
				marginLeft: 0
			}).find('li:last').prependTo(u);
		})
	})
}
//明星教师的左右滚动
function teacherScroll() {
	$('.t_pre').click(function() {
		//		var index=$('.star_teacher .nav span.cur').index();
		var u = $('.teacher_list .coat ul');
		var w = $(this).siblings().find('li').css('width');
		u.stop().animate({
			marginLeft: '-210px'
		}, 500, function() {
			u.css({
				marginLeft: 0
			}).find('li:first').appendTo(u);
		})
	})
	$('.t_next').click(function() {
		//		var index=$('.star_teacher .nav span.cur').index();
		var u = $('.teacher_list .coat ul');
		var w = $(this).siblings().find('li').css('width');
		u.stop().animate({
			marginLeft: '210px'
		}, 500, function() {
			u.css({
				marginLeft: 0
			}).find('li:last').prependTo(u);
		})
	})
}
//从url中获取参数值
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}
//从url中获取传过来的用户信息,自动登录
function autoLogin() {
	var S = new Store();
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
			if(data.loginusername!='null' && data.loginusername!='' && data.loginusername!='undefined'){
				S.set('uname', data.loginusername);
			}else{
				S.set('uname', data.phonenumber);
			}
			S.set('userId', data.userid);
		}
	});
}