var n = 1;
var centerid = '';
var hasNext=true;
$(function() {
	centerid = GetQueryString('centerid');
	var centername = GetQueryString('centername');
	$('.mui-title').text(centername + '课程');
	//创建MeScroll对象
	var mescroll = new MeScroll("mescroll", {
		down: {
			auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
			callback: downCallback //下拉刷新的回调
		},
		up: {
//			auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
			isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
			callback: upCallback, //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
		}
	});
	//	下拉刷新的回调
	function downCallback() {
		n = 1;	
		$('#courseList').html('');
		hasNext = true;
		getListDataFromNet(n,centerid,function(data){
			mescroll.endSuccess(10,hasNext);
			setListData(data);
		},function(){
			mescroll.endErr();
		})
	}
	//	上拉加载的回调
	function upCallback() {
		getListDataFromNet(n,centerid,function(data){
			mescroll.endSuccess(data.length,hasNext);
			//设置列表数据
			setListData(data);
		},function(){
			mescroll.endErr();
		});
		n = n + 1;
	}	
});
//设置数据列表
function setListData(data) {
	var cHtml = '';
	if(data != '' && data != undefined && data != '[]') {
		data = JSON.parse(data);
		$.each(data, function(i, item) {
			var price = parseFloat(item[11] / 100);
			var startTime = item[3];
			if(startTime == '' || startTime == null) {
				startTime = '待教务老师通知';
			}
			minNum = Number(item[8]);
			maxNum = Number(item[9]);
			var proportion = minNum / maxNum;
			if(proportion <= 0.3 && proportion >= 0) {
				stateHtml = '<b class="state01">余' + (maxNum - minNum) + '</b>'
			} else if(proportion < 0.6 && proportion > 0.3) {
				stateHtml = '<b class="state02">余' + (maxNum - minNum) + '</b>'
			} else if(proportion >= 0.6 && proportion < 1) {
				stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>余' + (maxNum - minNum) + '</b>'
			} else {
				stateHtml = '<b class="state04">已满</b>'
			}
			cHtml += '<li>' +
				'<a href="course-detail.html?id=' + item[0] + '">' +
				'<img src="' + item[2] + '" />' +
				stateHtml +
				'<h4>' + item[1] + '</h4>' +
				'<p>开课时间:<span class="teacher-name">' + startTime + '</span></p>' +
				'<div><i class="iconfont icon-tianjiaren"></i>' +
				'<span class="people-number">' + maxNum + '人</span></div>' +
				'<em>￥<font>' + price + '</font></em>' +
				'</a>' +
				'</li>'
		});
		$('#courseList').append(cHtml);
	} else {
		hasNext = false;
	};
}
//联网加载列表数据
function getListDataFromNet(n, centerid,successCallback, errorCallback) {
	setTimeout(function() {
		$.ajax({
			type: "post",
			url: url + "/course/getCourseListIndexPage.action",
			async: false,
			data: {
				specialtyid: centerid,
				coursename: '',
				maxage: '',
				minage: '',
				schoolareaid: '',
				page: n,
				limit: 8
			},
			success: function(data) {
				successCallback(data);
			},
			error: errorCallback
		});
	}, 500);
}
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return decodeURI(r[2]);
	return null;
}