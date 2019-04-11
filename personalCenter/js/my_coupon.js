function couponInit(){
	queryCoupon();
}
//获取优惠券
function queryCoupon(){
	var S = new Store();
	var userid = S.get('userId');
	var couponHtml ='';
//	var rechargeMoney = '';//充值金额
	var toUseMoney = '';//抵用金额
	var validity = '';//有效期
	$.ajax({
		type:"post",
		url:url+"/coupons/getCouponsListByPage.action",
		async:false,
		data:{userid:userid},
		success:function(data){
//			console.log(data);
			if(data!=null&&data!=''&&data!='[]'){
				data = JSON.parse(data);
				for(var i=0;i<data.length;i++){
//					rechargeMoney = (data[i].amountofmoney/100).toFixed(2);
					toUseMoney = (data[i].couponsmoney/100).toFixed(2);
					validity = fmtDate(data[i].startusedate)+'-'+fmtDate(data[i].endusedate);
					couponHtml+='<li>'
							+'<div class="c-type">'
							+'<h2><em>￥</em><strong>'+toUseMoney+'</strong><span>立减</span></h2>'
							+'<p>试听课可用</p>'
							+'<div class="c-time">'+validity+'</div>'
							+'</div>'
							+'<div class="c-use">'
							+'<p>优惠券编号：<span>'+data[i].couponsnum+'</span></p>'
							+'<a href="trial_lesson.html">立即使用</a>'
							+'</div>'
							+'</li>'
				}
				$('.coupon ul').html(couponHtml);
			}else{
				$('.coupon ul').html('<h2 style="text-align:center;color:#666;">暂无优惠券信息</h2>');
			}
		}
	});
}
//时间戳转换成日期格式函数
function fmtDate(obj) {
	var date = new Date(obj);
	var y = 1900 + date.getYear();
	var m = "0" + (date.getMonth() + 1);
	var d = "0" + date.getDate();
	return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}