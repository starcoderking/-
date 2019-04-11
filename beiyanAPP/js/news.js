var n = 1;
$(function() {
	//创建MeScroll对象
	var mescroll = new MeScroll("mescroll", {
		//		down: {
		//			auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
		//			callback: downCallback //下拉刷新的回调
		//		},
		up: {
			auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
			isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
			callback: upCallback, //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
		}
	});
	//	下拉刷新的回调
	function downCallback() {
		n = 1;
		$('#newsList').html('');
		getListDataFromNet(n, function(data) {
			mescroll.endSuccess();
			setListData(data);
		}, function() {
			mescroll.endErr();
		})
	}
	//	上拉加载的回调
	function upCallback() {
		getListDataFromNet(n, function(data) {
			mescroll.endSuccess(data.length);
			//设置列表数据
			setListData(data);
		}, function() {
			mescroll.endErr();
		});
		n = n + 1;
	}
});
//设置数据列表
function setListData(data) {
	var nHtml = '';
	if(data != '' && data != undefined && data != '[]') {
		data = JSON.parse(data);
		for(var i = 0; i < data.length; i++) {
			nHtml += '<li>' +
				'<a href="news-detail.html?newsid=' + data[i][0] + '">' + data[i][1] + '<span>' + data[i][2].substr(0, 10) + '</span></a>'
				+'</li>'
		}
		$('#newsList').append(nHtml);
	} else {
		hasNext = false;
	};
}
//联网加载列表数据
function getListDataFromNet(n, successCallback, errorCallback) {
	setTimeout(function() {
		$.ajax({
			type: "post",
			url: url + "/news/getPageNewsPage.action",
			async: false,
			data: {
				page: n,
				limit: 12
			},
			success: function(data) {
				successCallback(data);
			},
			error: errorCallback
		});
	}, 500);
}