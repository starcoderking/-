//mui.init({
//	swipeBack: true //启用右滑关闭功能
//});
var n = 1;
var hasNext = true; //是否含有下一页，默认true
$(function() {
	$('.footer').load('footer.html', function() {
		main();
		navText('报课');
	});
	var S = new Store();
	var U = new Url();
	var I = new Interfaces();
	//	清理本地存储筛选条件
	S.del('specialtyid');
	S.del('coursename');
	S.del('maxage');
	S.del('minage');
	S.del('schoolareaid');
	//	显示一级菜单
	var center_data = JSON.parse(I.query_filter(1, 0));
	var oneHtml = '';
	oneHtml += '<dt><span class="icon iconfont icon-chanpin"></span>科目：</dt>' +
		'<dd class="select-all selected" data-id="">全部</dd>';
	$.each(center_data, function(i, item) {
		oneHtml += '<dd data-id="' + item.specialtyid + '">' + item.specialtyname + '</dd>'
	});
	$('#select1').html(oneHtml);
	//	校区显示
	var campus = JSON.parse(I.query_campus());
	var campusHtml = '';
	campusHtml += '<dt><span class="icon iconfont icon-didian"></span>校区：</dt>' +
		'<dd class="select-all selected" data-id="">全部</dd>'
	$.each(campus, function(i, item) {
		campusHtml += '<dd data-id="' + item.schoolareaid + '">' + item.schoolareaname + '</dd>'
	});
	$('#select3').html(campusHtml);
	//侧边栏滚动
//	$('.sidebar').simpleSidebar({
//		settings: {
//			opener: '#open-sb',
//			wrapper: '.wrapper',
//			animation: {
//				duration: 500,
//				easing: 'easeOutQuint'
//			}
//		},
//		sidebar: {
//			align: 'right',
//			width: 320,
//			closingLinks: 'a',
//		}
//	});
	event();
});
//创建MeScroll对象
var mescroll = new MeScroll("mescroll", {
	//			down: {
	//				auto: true, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
	//				callback: downCallback //下拉刷新的回调
	//			},
	up: {
		auto: false, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
		isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
		callback: upCallback, //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
	}
});
//	下拉刷新的回调
function downCallback() {
	n = 1;
	$('#courseList').html('');
	hasNext = true;
	getListDataFromNet(n, function(data) {
		mescroll.endSuccess(6, hasNext);
		setListData(data);
	}, function() {
		mescroll.endErr();
	})
}
//	上拉加载的回调
function upCallback() {
	getListDataFromNet(n, function(data) {
		mescroll.endSuccess(data.length, hasNext);
		//设置列表数据
		setListData(data);
	}, function() {
		mescroll.endErr();
	});
	n = n + 1;
}
//筛选器的点击事件
function event() {
	var I = new Interfaces();
	var S = new Store();
	//	筛选条件显示隐藏函数
	$('.selecteMenu').click(function() {
		if($('.selecteBg').css('display') == 'none') {
			$('.selecteBg').show();
		} else {
			$('.selecteBg').hide();
		}
	});
	$('.selectBtn').click(function() {
		$(this).parents('.selecteBg').hide();
		$('#courseList').html('');
		n=1;
		getListDataFromNet(1, function(data) {
			hasNext = true;
			mescroll.endSuccess(10, true);
			//设置列表数据
			setListData(data);
		}, function() {
			mescroll.endErr();
		});
		n=n+1;
	});
	$("#select1 dd").click(function() {
		var oneId = $(this).attr('data-id');
		$(this).addClass("selected").siblings().removeClass("selected");
		S.set('specialtyid', $(this).attr('data-id')); //本地存储选中项的id
		if($(this).hasClass("select-all")) {
			//如果科目点击的是全部让他的子集隐藏否则显示
			$('#select1-1').parent('li').hide();
			$('#select1-1-1').parent('li').hide();
			$("#selectA").remove();
		} else {
			var profession_data = JSON.parse(I.query_filter(oneId)); //点击显示子集
			if(profession_data != '[]' && profession_data != '') {
				var twoHtml = '';
				twoHtml += '<dt><span class="">二级:</span></dt>' +
					'<dd class="select-all selected" data-id="' + oneId + '">全部</dd>'
				$.each(profession_data, function(i, item) {
					twoHtml += '<dd data-id="' + item.specialtyid + '">' + item.specialtyname + '</dd>'
				});
				$('#select1-1').html(twoHtml);
				$('#select1-1').parent('li').show();
				$('#select1-1-1').parent('li').hide();
			} else {
				$('#select1-1').parent('li').hide();
				$('#select1-1-1').parent('li').hide();
			}
			copyThisA = $(this).clone();
			if($("#selectA").length > 0) {
				$('#selectA').remove();
				$(".select-result dl").append(copyThisA.attr("id", "selectA"));
			} else {
				$(".select-result dl").append(copyThisA.attr("id", "selectA"));
			}
		}
	});
	//点击二级显示三级
	$('#select1-1').on('click', 'dd', function() {
		var twoId = $(this).attr('data-id');
		$(this).addClass('selected').siblings().removeClass('selected');
		S.set('specialtyid', $(this).attr('data-id'));
		if($(this).hasClass('select-all')) {
			$('#select1-1-1').parent('li').hide();
			$("#selectA").remove();
			$(".select-result dl").append(copyThisA.attr("id", "selectA"));
			return false;
		} else {
			//点击显示子集
			var course_data = JSON.parse(I.query_filter(twoId));
			if(course_data != '[]' && course_data != '') {
				var threeHtml = '';
				threeHtml += '<dt><span class="">三级:</span></dt>' +
					'<dd class="select-all selected" data-id="' + twoId + '">全部</dd>'
				$.each(course_data, function(i, item) {
					threeHtml += '<dd data-id="' + item.specialtyid + '">' + item.specialtyname + '</dd>'
				});
				$('#select1-1-1').html(threeHtml);
				$('#select1-1-1').parent('li').show();
			} else {
				$('#select1-1-1').parent('li').hide();
			}
			copyThisAa = $(this).clone();
			$('#selectA').remove();
			$(".select-result dl").append(copyThisAa.attr("id", "selectA"));
		}
	});
	//三级的点击事件
	$('#select1-1-1').on('click', 'dd', function() {
		$(this).addClass('selected').siblings().removeClass('selected');
		S.set('specialtyid', $(this).attr('data-id'));
		if($(this).hasClass('select-all')) {
			$("#selectA").remove();
			$(".select-result dl").append(copyThisAa.attr("id", "selectA"));
			return false;
		} else {
			var copyThisAb = $(this).clone();
			$('#selectA').remove();
			$(".select-result dl").append(copyThisAb.attr("id", "selectA"));
		}
	});
	//	年龄的点击事件
	$("#select2").on('click', 'dd', function() {
		$(this).addClass("selected").siblings().removeClass("selected");
		$(this).siblings('.num').val('');
		var id = $(this).attr('data-id');
		if(id == 0) {
			S.set('maxage', '');
			S.set('minage', '');
		} else if(id == 1) {
			S.set('maxage', 5);
			S.set('minage', 3);
		} else if(id == 2) {
			S.set('maxage', 8);
			S.set('minage', 6);
		} else if(id == 3) {
			S.set('maxage', 10);
			S.set('minage', 8);
		} else {
			S.set('maxage', 100);
			S.set('minage', 0);
		}
		if($(this).hasClass("select-all")) {
			$("#selectB").remove();
		} else {
			var copyThisB = $(this).clone();
			if($("#selectB").length > 0) {
				$("#selectB").html($(this).text());
				$("#selectB").attr('data-id', $(this).attr('data-id'));
			} else {
				$(".select-result dl").append(copyThisB.attr("id", "selectB"));
			}
		}
	});
	//	手动输入年龄事件
	$('#select2 .num').focus(function() {
		$(this).siblings('dd').removeClass('selected');
	});
	$('#select2 .num').blur(function() {
		var num = $(this).val();
		if(num != '') {
			S.set('maxage', num);
			S.set('minage', num);
			if($('#selectB').length > 0) {
				$('#selectB').html($(this).val() + '岁');
			} else {
				$('.select-result dl .select-no').remove();
				$('.select-result dl').append('<dd class="  selected" id="selectB">' + $(this).val() + '岁</dd>')
			}
		}
	});
	//	校区选择
	$("#select3 dd").click(function() {
		$(this).addClass("selected").siblings().removeClass("selected");
		S.set('schoolareaid', $(this).attr('data-id'));
		if($(this).hasClass("select-all")) {
			$("#selectC").remove();
		} else {
			var copyThisB = $(this).clone();
			if($("#selectC").length > 0) {
				$("#selectC").html($(this).text());
				$("#selectC").attr('data-id', $(this).attr('data-id'));
			} else {
				$(".select-result dl").append(copyThisB.attr("id", "selectC"));
			}
		}
	});
	//	已选条件点击取消
	$(".select-result").on('click', '#selectA', function() {
		$(this).remove();
		S.set('specialtyid', '');
		$('#select1-1').parent('li').hide();
		$('#select1-1-1').parent('li').hide();
		$("#select1 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$(".select-result").on('click', '#selectB', function() {
		$(this).remove();
		S.set('maxage', '');
		S.set('minage', '');
		$("#select2 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$(".select-result").on('click', '#selectC', function() {
		$(this).remove();
		S.set('schoolareaid', '');
		$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$(".select").on("click", 'dd', function() {
		if($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});
	$('.select-result').on('click', 'dd', function() {
		if($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});
}
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
function getListDataFromNet(n, successCallback, errorCallback) {
	setTimeout(function() {
		var S = new Store();
		var cHtml = '';
		var minNum;
		var maxNum;
		var stateHtml;
		var specialtyid = S.get('specialtyid');
		var coursename = S.get('coursename');
		var maxage = S.get('maxage');
		var minage = S.get('minage');
		var schoolareaid = S.get('schoolareaid');
		if(specialtyid == null) {
			specialtyid = '';
		}
		if(coursename == null) {
			coursename = '';
		}
		if(maxage == null) {
			maxage = '';
		}
		if(minage == null) {
			minage = '';
		}
		if(schoolareaid == null) {
			schoolareaid = '';
		}
		$.ajax({
			type: "post",
			url: url + "/course/getCourseListIndexPage.action",
			async: false,
			data: {
				specialtyid: specialtyid,
				coursename: coursename,
				maxage: maxage,
				minage: minage,
				schoolareaid: schoolareaid,
				page: n,
				limit: 6
			},
			success: function(data) {
				successCallback(data);
			},
			error: errorCallback
		});
	}, 500);
}