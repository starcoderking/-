$(function() {
	var S = new Store();
	$('.header_box').load('header.html', function() {
		main();
	});
	var orderInfoData = S.get('orderInfoData');
	orderInfoData = JSON.parse(orderInfoData);
	if(orderInfoData!='' && orderInfoData!=undefined){
		var cOrderHtml='<li><em>购买账户：</em><span>'+orderInfoData.phonenumber+'</span></li>'
					+'<li><em>应付金额：</em><span>'+(orderInfoData.ordermoney/100).toFixed(2)+'元</span></li>'
					+'<li><em>实付金额：</em><span>'+(orderInfoData.orderpaidmoney/100).toFixed(2)+'元</span></li>'
					+'<li><em>购买时间：</em><span>'+orderInfoData.buytime+'</span></li>'
					+'<li><em>购买数量：</em><span>'+orderInfoData.ordernumber+'</span></li>'
					+'<li><em>订单编号：</em><span>'+orderInfoData.orderid+'</span></li>'
					$('.orderInfo ul').html(cOrderHtml);
	}
	$("#backIndex").click(function(){
		location.href="index.html";
	});
	$("#backCourse").click(function(){
		history.go(-2);
	});
});
//从url中获取参数值
 function GetQueryString(name){
　　 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　 var r = window.location.search.substr(1).match(reg);
　　 if(r!=null)return  unescape(r[2]); return null;
}