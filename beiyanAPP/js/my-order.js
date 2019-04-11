$(function(){
	query_orderlist(1);
	event();
});
//获取订单列表
function query_orderlist(n) {
	var S = new Store();
	var userid = S.get('userid');
	var orderHtml = '';
	$.ajax({
		type: "post",
		url: url + "/sysorder/getSysOrderPage.action",
		async: false,
		data: {
			userid: userid,
			page: n,
			limit: 100
		},
		success: function(data) {
//			console.log(data);
			if(data != 'null'&&data!='[]'&&data!='') {
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
					orderHtml+='<li data-id="'+orderid+'">'
						+'<div class="orderNum">订单号: <span>'+orderid+'</span>&nbsp;&nbsp;购买时间: <span>'+buyDate+'</span></div>'
						+'<div class="state-total">'
						+'<div class="left">'
						+'<p class="state">状&nbsp;&nbsp;&nbsp;&nbsp;态:<span data-id="'+data[i][6]+'">'+state+'</span></p>'
						+'<p class="total-price">总&nbsp;&nbsp;&nbsp;&nbsp;价:<span>￥'+price+'</span></p>'
						+'</div>'
						if(data[i][6] == 1 || data[i][6] == 2 || data[i][6] == 6 || data[i][6] == 9){
							orderHtml+='<a href="" class="rePay">去支付</a>'
						}
						if(data[i][6] != 3&&data[i][6] != 4 && data[i][6] != 5 && data[i][6] != 8) {
							orderHtml+='<button class="delete-order">取消订单</button>'
						}
						orderHtml+='</div>'
						for(var j=0;j<data_detail.length;j++){
							var startTime = '';//开课时间
							var studentName = data_detail[j][14];//学员姓名
							if(data_detail[j][21]==null || data_detail[j][21]==''){
								startTime = '由教务老师通知'
							}else{
								startTime = data_detail[j][21];
							}
							if(studentName==''||studentName==null){
								studentName = '未绑定学员';
							}
							orderHtml+='<div class="order-detail">'
								+'<img src="' + data_detail[j][20] + '" />'
								+'<div class="course-info">'
								+'<ul>'
								+'<li>课程名称:<span>'+data_detail[j][11]+'</span></li>'
								+'<li>开课时间:<span>'+startTime+'</span></li>'
								+'<li>学员姓名:<span>'+studentName+'</span></li>'
								+'<li>校区地址:<span>'+data_detail[j][18]+'</span></li>'
								+'</ul>'
								+'</div>'
								+'</div>'
						}
						orderHtml+='</li>'
							+'</ul>'
				}
				$('#thelist').html(orderHtml);
			}else{
				$('#thelist').html('<h3 style="text-align:center;color:#666;padding:.3rem 0;">暂无订单信息！</h3>');
			}
		}
	})
}
//获取订单详情
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
function event(){
//	取消订单
	$('#thelist li').on('click','.delete-order',function(){
		var orderNum = $(this).parent('div').parent('li').attr('data-id');
		$.ajax({
			type:"post",
			url:url+"/sysorder/cancelPageOrder.action",
			async:false,
			data:{orderid:orderNum},
			success:function(data){
				if(data==1){
					$.alertView("取消成功！");
				}else{
					$.alertView('取消失败！');
				}
				query_orderlist(1);
			},
			error:function(){
				alert('请求失败，请联系客服');
			}
		});
	});
//	去支付
	$('#thelist li').on('click','.rePay',function(){
		var orderNum = $(this).parent('div').parent('li').attr('data-id');
		location.href='transaction-detail.html?orderid='+orderNum;
		return false;
	});
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
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
