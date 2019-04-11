$(function() {
	$('.header_box').load('header.html', function() {
		main();
		navText('师资介绍');
	});
	var teacherid = GetQueryString('id');
	teacherInfo(teacherid);
	teaCourse(1);
	courseRec(); //获取侧边栏课程推荐信息
});
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}
//获取教师信息
function teacherInfo(id) {
	var tHtml = "";
	$.ajax({
		type: "post",
		url: url + "/teacher/getTeacherInfo.action",
		async: false,
		data: {
			teacherid: id
		},
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			if(data.cont=='' || data.cont=='null' ||data.cont=='[]' ||data.cont==null){
				var cont = '暂无';
			}else{
				var cont = data.cont;
			}
			tHtml += '<div class="avatar">' +
				'<img src="' + data.topimageurl + '">' +
				'</div>' +
				'<div class="intro">' +
				'<h2>' + data.teachername + '</h2>' +
				'<div class="teacherremark"><p><span>教师职称：</span>' + data.teachertype + '</p>' +
				'<p><span>所属单位：</span>' + data.specialty + '</p>' +
				'<p><span>工作类型：</span>' + data.jobtype + '</p>' +
				'<p><span>性别：</span>' + data.sex + '</p>' +
				'<p><span>民族：</span>' + data.nation + '</p>' +
				'<p><span>个人简介：</span>' + cont + '</p></div>' +
				'</div>'
			$('.teacher_intro').html(tHtml);
			$("#teacherremark").html(data.teacherremark);
		}
	});
}
//获取教师所教的课程
function teaCourse(tid) {
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/course/getCourseListByTeacherId.action",
		async: false,
		data: {
			teacherid: tid
		},
		success: function(data) {
			console.log(data);
			data = JSON.parse(data);

			$.each(data, function(i, item) {
				var price = parseInt(item[17] / 100);
				cHtml += '<li>' +
					'<a href="course_detail.html?id=' + item[0] + '">' +
					'<img src="' + item[9] + '">' +
					'<div><h3>' + item[1] + '</h3><p class="price">￥<span>' + price + '</span>元起</p></div>' +
					'</a>' +
					'</li>'
			});
			$('.course>ul').html(cHtml);
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
	var arr = []; //随机数数组
	var courseNum='';
	$.ajax({
		type: "get",
		url: url + "/course/getIndexCourseList.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			if(data != '' && data != undefined) {
				var totalNum = data.length;
				if(totalNum>=3){
					courseNum=3;
				}else{
					courseNum = data.length;
				}
				for(var i = 0; i < courseNum; i++) {
					random = parseInt(totalNum * Math.random());
					var YN = isInArray(arr, random);
					if(YN) {
						courseNum+=1;
						cHtml+='';
					} else {
						arr.push(random);
						var price = parseFloat(data[random][11] / 100);
						var startTime = data[random][3];//开课时间
						if(startTime==''||startTime==null){
							startTime = '待教务老师通知';
						}
						minNum = Number(data[random][8]);
						maxNum = Number(data[random][9]);
						var proportion = minNum/maxNum;
						if(proportion <= 0.3&&proportion>=0) {
							stateHtml = '<b class="state01">余'+(maxNum-minNum)+'</b>'
						} else if(proportion < 0.6 && proportion > 0.3) {
							stateHtml = '<b class="state02">余'+(maxNum-minNum)+'</b>'
						} else if(proportion >= 0.6 && proportion<1){
							stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>余' + (maxNum-minNum) + '</b>'
						}else{
							stateHtml = '<b class="state04">已满</b>'
						}
						cHtml += '<li>' +
							'<a href="course_detail.html?id=' + data[random][0] + '">' +
							'<img src="' + data[random][2] + '">' +
							'<div class="course_info">' +
							'<div class="title">' + data[random][1] + '</div>' +
							'<div class="info">' +
							'<span title="' + startTime + '">开课时间:' + startTime + '</span><b><em>￥</em>' + price + '</b>' +
							'</div>' +
							'</div>' +
							stateHtml +
							'</a>' +
							'</li>'
					}

				}
				cHtml += '<li class="two_code">' +
					'<a>' +
					'<img src="./img/two_code1.jpg">' +
					'<div class="course_info">' +
					'<div class="title">关注我们获取更多</div>' +
					'</div>' +
					'</a>' +
					'</li>'
				$('.slidebar ul').html(cHtml);
			}
		}
	});
//	console.log(arr);
}
//数组验重函数
function isInArray(arr, value) {
	for(var i = 0; i < arr.length; i++) {
		if(value === arr[i]) {
			return true;
		}
	}
	return false;
}