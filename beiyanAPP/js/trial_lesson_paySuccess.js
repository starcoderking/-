$(function() {
//	禁止页面回退
	history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
//  禁止页面回退结束
	var S = new Store();
	var data = S.get('courseData');
	if(data!=null){
		data = JSON.parse(data);
		var classInfoHtml='';
		for(var i = 0; i < 4; i++) {
			classInfoHtml += '<tr>' +
				'<td>' + data.sclist[i].classname + '</td>' +
				'<td>' + data.sclist[i].explains + '</td>' +
				'<td>' + data.sclist[i].schoolarea.schooladdress + '</td>' +
				'</tr>'
		}
		$('.lesson-list tbody').html(classInfoHtml);
	}
	setInterval(function(){coursePayStatus()},3000);
	setTimeout("payurl()", 2000);
});
	function payurl(){
		var S = new Store();
		var orderid = GetQueryString('orderid');
		var orderNum = S.get('orderNum');
		if(orderid!=orderNum){
			var payurl = GetQueryString('payurl');
			if(payurl && payurl!=''){
				S.set('orderNum',orderid);
				location.href=payurl;
			}
		}
	}
//从url中获取参数
function GetQueryString(name){
　　 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　 var r = window.location.search.substr(1).match(reg);
　　 if(r!=null)return  unescape(r[2]); return null;
}
//监控课程购买支付状态
function coursePayStatus() {
	var S = new Store();
	var orderInfoData = JSON.parse(S.get('orderInfoData'));
	if(orderInfoData!=''&&orderInfoData!=null){
//		console.log(orderInfoData);
		var orderid = orderInfoData.sysorder.orderid;
		$.ajax({
			type: "post",
			url: url + "/sysorder/queryPayResult.action",
			async: false,
			data: {
				orderid: orderid
			},
			success: function(data) {
				data = JSON.parse(data);
				if(data.orderpaystate == 6) {
					$('.orderState').text('支付中!');
				}else if(data.orderpaystate == 3){
					$('.orderState').text('支付成功!');
				}
			}
		});
	}
}