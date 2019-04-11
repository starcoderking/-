var grandgrandfatherId; //用来存储第一级点击时的id
var fatherId; //用来存储第二级点击时的id
var copyThisA; //用来存储第一级的克隆
var copyThisAa; //用来存储第二级的克隆
$(function() {
	var S = new Store();
	S.del('specialtyid');
	S.del('maxage');
	S.del('minage');
	S.del('schoolareaid'); //删除关于课程筛选的本地存储
	$('.header_box').load('header.html', function() {
		main();
		navText('选课报课');
	});
	subject(1); //获取科目列表
	getCampus(); //获取校区
	var totalrec = total(); //获取总记录数
	page(totalrec); //生成页码编号
	courseList(1); //初始化课程列表
	//科目的点击事件
	$("#select1 dd").click(function() {
		grandfatherId = $(this).children('a').attr('data-id');
		$(this).addClass("selected").siblings().removeClass("selected");
		S.set('specialtyid', $(this).children('a').attr('data-id')); //本地存储选中项的id
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
		if($(this).hasClass("select-all")) {
			//如果科目点击的是全部让他的子集隐藏否则显示
			$('#select1-1').parent('li').hide();
			$('#select1-1-1').parent('li').hide();
			$("#selectA").remove();
		} else {
			var pid = $(this).children('a').attr('data-id');
			getSecond(pid); //点击显示子集
			//点击一级二级显示三级隐藏
			$('#select1-1').parent('li').show();
			$('#select1-1-1').parent('li').hide();
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
	$('#select1-1 dd').live('click', function() {
		fatherId = $(this).children('a').attr('data-id');
		$(this).addClass('selected').siblings().removeClass('selected');
		S.set('specialtyid', $(this).children('a').attr('data-id'));
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
//		if($(this).hasClass('select-all')) {
//			$('#select1-1-1').parent('li').hide();
//			$("#selectA").remove();
//			$(".select-result dl").append(copyThisA.attr("id", "selectA"));
//			return false;
//		} else {
//			var cId = $(this).children('a').attr('data-id');
//			getThird(cId); //点击显示子集
//			$('#select1-1-1').parent('li').show();
//			copyThisAa = $(this).clone();
//			$('#selectA').remove();
//			$(".select-result dl").append(copyThisAa.attr("id", "selectA"));
//		}
	});
	//三级的点击事件
	$('#select1-1-1 dd').live('click', function() {
		$(this).addClass('selected').siblings().removeClass('selected');
		S.set('specialtyid', $(this).children('a').attr('data-id'));
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
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
	$("#select2 dd").click(function() {
		$(this).addClass("selected").siblings().removeClass("selected");
		$(this).siblings('.num').val('');
		var id = $(this).children('a').attr('data-id');
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
			S.set('minage', 10);
		}
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
		if($(this).hasClass("select-all")) {
			$("#selectB").remove();
		} else {
			var copyThisB = $(this).clone();
			if($("#selectB").length > 0) {
				$("#selectB a").html($(this).text());
			} else {
				$(".select-result dl").append(copyThisB.attr("id", "selectB"));
			}
		}
	});
	$('#select2 .num').change(function(event) {
		event.target.value = event.target.value.replace(/\-/g, "");
	});
	$('#select2 .num').focus(function() {
		$(this).siblings('dd').removeClass('selected');
		S.del('maxage');
		S.del('minage');
	});
	$('#select2 .num').blur(function() {
		var num = $(this).val();
		if(num != '') {
			S.set('maxage', num);
			S.set('minage', num);
			var totalrec = total(); //获取总记录数
			page(totalrec); //生成页码编号
			courseList(1); //初始化课程列表
			if($('#selectB').length>0){
				$('#selectB a').html($(this).val()+'岁');
			}else{
				$('.select-result dl .select-no').remove();
				$('.select-result dl').append('<dd class="  selected" id="selectB"><a href="#" data-id="2">'+$(this).val()+'岁</a></dd>')
			}
		}
	});
	//	区域选择
	$("#select3 dd").click(function() {
		$(this).addClass("selected").siblings().removeClass("selected");
		S.set('schoolareaid', $(this).children('a').attr('data-id'));
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
		if($(this).hasClass("select-all")) {
			$("#selectC").remove();
		} else {
			var copyThisB = $(this).clone();
			if($("#selectC").length > 0) {
				$("#selectC a").html($(this).text());
			} else {
				$(".select-result dl").append(copyThisB.attr("id", "selectC"));
			}
		}
	});
	//	已选条件点击取消
	$("#selectA").live("click", function() {
		$(this).remove();
		S.set('specialtyid', '');
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
		$('#select1-1').parent('li').hide();
		$('#select1-1-1').parent('li').hide();
		$("#select1 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$("#selectB").live("click", function() {
		$(this).remove();
		S.set('maxage', '');
		S.set('minage', '');
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
		$("#select2 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$("#selectC").live("click", function() {
		$(this).remove();
		S.set('schoolareaid', '');
		var totalrec = total(); //获取总记录数
		page(totalrec); //生成页码编号
		courseList(1); //初始化课程列表
		$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$("#selectD").live("click", function() {
		$(this).remove();
		$("#select4 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$(".select dd").live("click", function() {
		if($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});
	var courseId = GetQueryString('id') //从url中获取课程id
	var oneId; //一级菜单的id
	var twoId; //二级菜单的id
	var threeId; //三级菜单的id
	if(courseId && courseId != null && courseId != undefined) {
		var y = $('.trigger_click dd>a[data-id="' + courseId + '"]').length;
		if(y == 0) {
			$.ajax({
				type: "post",
				url: url + "/specialty/getPageSpecialtyList.action",
				async: false,
				success: function(data) {
					data = JSON.parse(data);
					arr = data;
					$.each(data, function(i, item) {
						if(item.specialtyid == courseId) {
							twoId = item.parentid;
							threeid = item.specialtyid;
						}
					});
					var t = $('.trigger_click dd>a[data-id="' + twoId + '"]').length;
					if(t != 0) {
						$('.trigger_click dd>a[data-id="' + twoId + '"]').parents('dd').trigger('click');
						$('.trigger_click dd>a[data-id="' + threeId + '"]').parents('dd').trigger('click');
					} else {
						$.each(data, function(i, item) {
							if(item.specialtyid == twoId) {
								oneId = item.parentid;
								$('.trigger_click dd>a[data-id="' + oneId + '"]').parents('dd').trigger('click');
								$('.trigger_click dd>a[data-id="' + twoId + '"]').parents('dd').trigger('click');
							}
						});
					}
				}
			});
		}
		$('.trigger_click dd>a[data-id="' + courseId + '"]').parents('dd').trigger('click');
	}
});
//获取科目列表
function subject(parentid) {
	var pHtml = ''; //父类的代码
	$.ajax({
		type: "post",
		url: url + "/specialty/getPageSonSpecialty.action",
		async: false,
		data: {
			parentid: parentid,
			showstate: 0
		},
		success: function(data) {
			if(data != '' && data != 'null' && data != 'undefined') {
				data = JSON.parse(data);
				if(parentid == 1) {
					pHtml += '<dt><span class="icon iconfont icon-changyongkemu"></span>科目</dt>' +
						'<dd class="select-all selected"><a href="javascript:;" data-id="">全部</a></dd>'
					$.each(data, function(i, item) {
						pHtml += '<dd><a href="javascript:;" data-id="' + item.specialtyid + '">' + item.specialtyname + '</a></dd>'
					});
					$('#select1').html(pHtml);
				} else {
					//				$.each(data, function(i, item) {
					//					var pid = item.specialtyid;
					//					getThird(pid);
					//				});
					return false;
				}
			}
		}
	});
}
//通过一级直接获取二级
function getSecond(pid) {
	$('#select1-1').html('');
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/specialty/getPageSonSpecialty.action",
		async: false,
		data: {
			parentid: pid
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data.length != 0) {
//				cHtml += '<dt><span class=""></span></dt>' +
				cHtml+='<dd class="select-all selected"><a href="javascript:;" data-id="' + grandfatherId + '">全部</a></dd>'
				$.each(data, function(i, item) {
					cHtml += '<dd><a href="javascript:;"data-id="' + item.specialtyid + '">' + item.specialtyname + '</a></dd>'
					$('#select1-1').html(cHtml);
				});
			} else {
				//$('#select1-1').html('');
				return false;
			}
		}
	});
}
//通过二级获取三级
function getThird(pid) {
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/specialty/getPageSonSpecialty.action",
		async: false,
		data: {
			parentid: pid
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data != 0) {
//				cHtml += '<dt><span class=""></span></dt>' +
				cHtml+=	'<dd class="select-all selected"><a href="javascript:;" data-id="' + fatherId + '">全部</a></dd>'
				$.each(data, function(i, item) {
					cHtml += '<dd><a href="javascript:;"data-id="' + item.specialtyid + '">' + item.specialtyname + '</a></dd>'
					$('#select1-1-1').html(cHtml);
				});
			} else {
				cHtml += '<dt><span class=""></span></dt>' +
					'<dd class="select-all selected"><a href="javascript:;" data-id="' + fatherId + '">全部</a></dd>'
				$('#select1-1-1').html('');
			}
		}
	});
}
//获取校区
function getCampus() {
	var sHtml = '';
	$.ajax({
		type: "get",
		url: url + "/schoolarea/getSchoolAreaList.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			sHtml += '<dt><span class="icon iconfont icon-diliweizhi"></span>校区</dt>' +
				'<dd class="select-all selected"><a href="javascript:;" data-id="">全部</a></dd>'
			$.each(data, function(i, item) {
				sHtml += '<dd><a href="javascript:;" data-id="' + item.schoolareaid + '">' + item.schoolareaname + '</a></dd>'
			});
			$('#select3').html(sHtml);
		}
	});
}
//生成分页的页签
function page(total) {
	var limit = 15; //每页显示数据条数
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
		courseList(n);
		this.selectPage(n);
		return false;
	};
}
//获取课程总数
function total() {
	var S = new Store();
	var specialtyid, coursename, maxage, minage, schoolareaid;
	if(S.get('specialtyid') != undefined) {
		specialtyid = S.get('specialtyid');
	} else {
		specialtyid = '';
	}
	coursename = '';
	if(S.get('maxage') != undefined) {
		maxage = S.get('maxage');
	} else {
		maxage = '';
	}
	if(S.get('minage') != undefined) {
		minage = S.get('minage');
	} else {
		minage = '';
	}
	if(S.get('schoolareaid') != undefined) {
		schoolareaid = S.get('schoolareaid');
	} else {
		schoolareaid = '';
	}
	//	alert(specialtyid,coursename,maxage,minage,schoolareaid);
	var totalNum;
	$.ajax({
		type: "post",
		url: url + "/course/getCourseListCountPage.action",
		async: false,
		data: {
			specialtyid: specialtyid,
			coursename: coursename,
			maxage: maxage,
			minage: minage,
			schoolareaid: schoolareaid
		},
		success: function(data) {
			totalNum = data
		}
	});
	return totalNum;
}
//获取课程数据信息
function courseList(page) {
	var S = new Store();
	var cHtml = '';
	var minNum;
	var maxNum;
	var stateHtml;
	var specialtyid, coursename, maxage, minage, schoolareaid;
	if(S.get('specialtyid') != undefined) {
		specialtyid = S.get('specialtyid');
	} else {
		specialtyid = '';
	}
	coursename = '';
	if(S.get('maxage') != undefined) {
		maxage = S.get('maxage');
	} else {
		maxage = '';
	}
	if(S.get('minage') != undefined) {
		minage = S.get('minage');
	} else {
		minage = '';
	}
	if(S.get('schoolareaid') != undefined) {
		schoolareaid = S.get('schoolareaid');
	} else {
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
			page: page,
			limit: 15
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
			} else {
				$('.course_list>ul').html('<h2 style="text-align:center;">没有您要筛选的数据！<h2>');
			}

		}
	});
}
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}