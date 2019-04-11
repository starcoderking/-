function orderInit() {
	generatePage();
	checkOrderStudent();
	studentList(); //学员列表
	orderEvent();
}
//订单事件
function orderEvent() {
	$('.bindStudent .close_mask').click(function() {
		$('.ordermask').hide();
		$('.bindStudent').hide();
	});
	//	点击新增学员
	$('#addStudent').click(function() {
		$('.student-list').hide();
		$('.fill-in-info').show();
	});
	$('.save-student').click(function() {
		addstudentInfo();
		$('.student-list').show();
		$('.fill-in-info').hide();
	});
	$('.choice-student>ul').on('click', 'li', function() {
		$(this).addClass('cur').siblings().removeClass('cur');
	});
//	订单有未绑定学员的进行学员绑定，由于业务的修改暂不需要此需求
	$('#sure').click(function() {
		var S = new Store();
		var userid = S.get('userId');
		var orderNum = S.get('orderNum');
		var mbid = $('.choice-student .cur').attr('data-id');
		$.ajax({
			type: "post",
			url: url + "/sysorder/editSysOrderMemberBody.action",
			async: false,
			data: {
				orderid: orderNum,
				userid: userid,
				membername: '',
				sex: '',
				dateofbirth: '',
				grade: '',
				schoolname: '',
				interests: '',
				remarks: '',
				mbid: mbid
			},
			success: function(data) {
				data = JSON.parse(data);
				if(data.result == 5) {
					$('.ordermask').hide();
					$('.bindStudent').hide();
					generatePage();
					SimplePop.alert('绑定成功');
				} else {
					$('.ordermask').hide();
					$('.bindStudent').hide();
					SimplePop.alert('绑定失败');
				}
			}
		});
	});
	//	订单重新支付
	$('.order_list').on('click', '.re-pay', function() {
		var orderid = $(this).attr('data-orderid');
		var realPrice = $(this).attr('data-realPrice');
		$('.choice-pay').removeClass('none');
		$('.choice-pay .sure-pay').click(function() {
			var payMethod = $('.choice-pay input:checked').attr('data-pay');
			if(payMethod == 2) {
				location.href = 'trial_lesson_wechatPay.html?orderid=' + orderid + '&realPrice=' + realPrice + '&payMethod=' + payMethod;
			} else if(payMethod == 1) {
				location.href = 'trial_lesson_aliPay.html?orderid=' + orderid + '&realPrice=' + realPrice + '&payMethod=' + payMethod;
			}
		});
	});
	//取消订单
	$('.order_list>ul').on('click','.cancel-order',function(){
		var orderNum = $(this).parent('h1').parent('li').attr('data-id');
		var n = S.get('orderPage');
		$.ajax({
			type:"post",
			url:url+"/sysorder/cancelPageOrder.action",
			async:false,
			data:{orderid:orderNum},
			success:function(data){
				if(data==1){
					SimplePop.alert('取消成功');
				}else{
					SimplePop.alert('取消失败！');
				}
				query_orderlist(n);
			},
			error:function(){
				alert('请求失败，请联系客服');
			}
		});
	});
}
//获取订单总记录数生成分页
function generatePage() {
	var S = new Store();
	var userid = S.get('userId');
	var pageNumber = 3; //每页显示条数
	var totalPage; //总页数
	var totalRecords; //订单总记录数
	//	请求总记录条数
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderCount.action",
		async: false,
		data: {
			userid: userid,
			orderstate: 0
		},
		success: function(data) {
			if(data != 0) {
				totalRecords = data;
				totalPage = parseInt(totalRecords / pageNumber);
				query_orderlist(1);
			} else {
				$('.my_order ul').html('<h2 style="text-align:center;color:#666;">当前无订单数据</h2>');
				$('.my_order #kkpager').hide();
			}
		}
	});
	//生成分页
	kkpager.generPageHtml({
		//总页码
		total: totalPage,
		//总数据条数
		totalRecords: totalRecords,
		mode: 'click', //默认值是link，可选link或者click
		click: function(n) {
			query_orderlist(n);
			//手动选中按钮
			this.selectPage(n);
			checkOrderStudent();
			return false;
		}
	});
}
//获取订单列表
function query_orderlist(n) {
	var S = new Store();
	S.set('orderPage',n);//存储订单当前的页码，以便取消订单调函数用
	var userid = S.get('userId');
	var orderHtml = '';
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderPage.action",
		async: false,
		data: {
			userid: userid,
			page: n,
			limit: 3,
			orderstate: 0
		},
		success: function(data) {
			//			console.log(data);
			if(data != 'null' && data != '[]') {
				data = JSON.parse(data);
				//console.log(data);
				for(var i = 0; i < data.length; i++) {
					var orderid = data[i][0];
					order_detail(orderid);
					var data_detail = JSON.parse(S.get('order_detail_data'));
					var buyDate = formatDateTimeSecond(data[i][2]);
					var price = parseFloat(data[i][4] / 100);
					var realPrice = parseFloat(data[i][10] / 100)
					var state = '';
					if(data[i][6] == 3) {
						state = '已付费';
					} else if(data[i][6] == 1) {
						state = '未付费';
					} else if(data[i][6] == 8) {
						state = '已关闭';
					} else if(data[i][6] == 4) {
						state = '退款中...';
					} else if(data[i][6] == 5) {
						state = '退款完成';
					} else if(data[i][6] == 6) {
						state = '支付中';
					} else if(data[i][6] == 2 || data[i][6] == 9) {
						state = '支付失败';
					};
					orderHtml += '<li data-id="' + orderid + '">'
					if(data[i][6] != 3&&data[i][6] != 4 && data[i][6] != 5 && data[i][6] != 8) {
						orderHtml += '<h1><b>订单编号：</b>' + orderid + '<b>购买时间：</b>' + buyDate + '<button class="cancel-order">取消订单</button><em data-id="' + data[i][6] + '"><b>状态：</b>' + state + '</em></h1>'
					} else {
						orderHtml += '<h1><b>订单编号：</b>' + orderid + '<b>购买时间：</b>' + buyDate + '<em data-id="' + data[i][6] + '"><b>状态：</b>' + state + '</em></h1>'
					}
					orderHtml += '<div class="left">'
					for(var j = 0; j < data_detail.length; j++) {
						var startTime = ''; //开课时间
						var studentName = data_detail[j][14]; //学员姓名
						if(data_detail[j][21] == null || data_detail[j][21] == '') {
							startTime = '由教务老师通知'
						} else {
							startTime = data_detail[j][21];
						}
						if(studentName == '' || studentName == null) {
							studentName = '未绑定学员';
						}
						orderHtml += '<div>' +
							'<img src="' + data_detail[j][20] + '" />' +
							'<div class="middle">' +
							'<ul>' +
							'<li><span>课程名称：</span>' + data_detail[j][11] + '</li>' +
							'<li><span>开课时间：</span>' + startTime + '</li>' +
							'<li class="studentName"><span>学员姓名：</span>' + studentName + '</li>' +
							'<li><span>校区地址：</span>' + data_detail[j][18] + '</li>' +
							'</ul>' +
							'</div>' +
							'</div>'
					}
					orderHtml += '</div>' +
						'<div class="right">' +
						'<p><span>购买数量：</span>x' + data[i][3] + '</p>' +
						'<p><span>订单金额：</span>￥' + price + '</p>' +
						'<p><span>支付金额：</span>￥' + realPrice + '</p>'
					if(data[i][6] == 1 || data[i][6] == 2 || data[i][6] == 6 || data[i][6] == 9) {
						orderHtml += '<button class="re-pay" data-orderid="' + orderid + '"data-realPrice="' + realPrice + '">去支付</button>'
					}
					orderHtml += '</div>' +
						'</li>'
				}
				$('.order_list>ul').html(orderHtml);
			} else {
				return false;
			}
		}
	})
}
//订单详情
function order_detail(orderid) {
	var S = new Store();
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderDetailPageList.action",
		async: false,
		data: {
			orderid: orderid
		},
		success: function(data) {
//			console.log(data);
			if(data && data != '[]' && data != null && data != undefined) {
				S.set('order_detail_data', data);
			} else {
				return false;
			}
		}
	});
}
//查取未绑定学员的订单
function checkOrderStudent() {
	var length = $('.order_list>ul>li').length;
	for(var i = 0; i < length; i++) {
		if($('.order_list>ul>li').eq(i).find('.studentName').text().indexOf('未绑定学员') > -1 && $('.order_list>ul>li').eq(i).find('em').attr('data-id') == 3) {
			var orderNum = $('.order_list>ul>li').eq(i).attr('data-id');
			S.set('orderNum', orderNum);
			$('.ordermask').show();
			$('.bindStudent').show();
		}
	}
}
//查询学员列表
function studentList() {
	var S = new Store();
	var userid = S.get('userId');
	var sHtml = '';
	var sex = '';
	var birthday = '';
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBodyByUserId.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
			if(data != 'null' && data != '' && data != '[]') {
				data = JSON.parse(data);
				for(var i = 0; i < data.length; i++) {
					if(data[i].sex == 1) {
						sex = '男';
					} else {
						sex = '女';
					}
					birthday = fmtDate(data[i].dateofbirth);
					if(i == 0) {
						sHtml += '<li data-id="' + data[i].mbid + '" class="cur"><span>' + data[i].membername + '</span><span>' + sex + '</span><span>' + birthday + '</span></li>'
					} else {
						sHtml += '<li data-id="' + data[i].mbid + '"><span>' + data[i].membername + '</span><span>' + sex + '</span><span>' + birthday + '</span></li>'
					}
				}
				$('.choice-student>ul').html(sHtml);
				$('#sure').show();
			} else {
				$('.choice-student>ul').html('<h3 style="text-align:center;color:#666;">当前没有学员，点击新增学员进行添加。</h3>');
				$('#sure').hide();
			}
		}
	});
}
//添加学员
function addstudentInfo() {
	var S = new Store();
	var userid = S.get('userId');
	var membername = $.trim($("#orderStudentName").val());
	var gender = $.trim($("#choiceSex").val());
	var birthday = $.trim($(".Wdate").val());
	var school = $.trim($("#school").val());
	var like = $.trim($("#like").val());
	$.ajax({
		type: "post",
		url: url + "/registered/editRegisteredUsersMemberBody.action",
		async: false,
		data: {
			userid: userid,
			mbid: 0,
			membername: membername,
			sex: gender,
			dateofbirth: birthday,
			grade: '',
			schoolname: school,
			interests: like,
			remarks: ''
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data && data.result == 1) {
				//				SimplePop.alert('添加成功');
				studentList();
				//				$('.choice-student>ul li:last-child').addClass('cur');
			} else {
				SimplePop.alert('添加失败！');
			}
		}
	});
}