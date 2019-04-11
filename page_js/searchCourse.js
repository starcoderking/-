var courseName; //用来存储从url中获取的课程名字
$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	courseName = GetQueryString('courseName');
	var totalNum = total(courseName);
	page(totalNum);
	courseList(1, courseName);
});
//生成分页的页签
function page(total) {
	var limit = 10; //每页显示数据条数
	var totalRecords = total;
	//alert('aa:'+total);
	var totalPage = parseFloat(totalRecords / limit);
	//alert("bb:"+totalPage);
	if(parseInt(totalPage) - parseFloat(totalPage) == 0) {
		totalPage = totalPage;
	} else {
		totalPage = parseInt(totalPage + 1);
	}
	kkpager.generPageHtml({
		//总页码
		total: totalPage,
		//总数据条数
		totalRecords: totalRecords,
		mode: 'click', //默认值是link，可选link或者click
	}, true);
	kkpager.click = function(n) {
		courseList(n, courseName);
		this.selectPage(n);
		return false;
	};
}
//获取课程总数
function total(coursename) {
	var totalNum;
	$.ajax({
		type: "post",
		url: url + "/course/getCourseListCountPage.action",
		async: false,
		data: {
			specialtyid: '',
			coursename: coursename,
			maxage: '',
			minage: '',
			schoolareaid: ''
		},
		success: function(data) {
			totalNum = data
		}
	});
	return totalNum;
}
//获取课程数据信息
function courseList(page, coursename) {
	var S = new Store();
	var cHtml = '';
	var minNum;
	var maxNum;
	var stateHtml;
	$.ajax({
		type: "post",
		url: url + "/course/getCourseListIndexPage.action",
		async: false,
		data: {
			specialtyid: '',
			coursename: coursename,
			maxage: '',
			minage: '',
			schoolareaid: '',
			page: page,
			limit: 10
		},
		success: function(data) {
			if(data && data != '' && data != undefined && data != '[]') {
				data = JSON.parse(data);
				$.each(data, function(i, item) {
					var price = parseFloat(item[11] / 100);
					var startTime = item[3];
					if(startTime=='' || startTime==null){
						startTime = '待教务老师通知';
					}
					minNum = Number(item[8]);
					maxNum = Number(item[9]);
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
						'<a href="course_detail.html?id=' + item[0] + '" target="_blank">' +
						'<img src="' + item[2] + '">' +
						'<h2>' + item[1] + '</h2>' +
						'<p><span><b>开课时间:</b>' + startTime + '</span></p>' +
						'<div><b class="icon iconfont icon-wode2"></b><span>' + maxNum + '人</span>' +
						'<em>￥<span>' + price + '</span></em></div>' +
						stateHtml +
						'</a></li>'
				});
				$('.course_list>ul').html(cHtml);
			}else{
				$('.course_list>ul').html('<h2 style="text-align:center;">没找到您想要的数据</h2>');
			}

		}
	});
}
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return decodeURI(r[2]);
	return null;　　
}