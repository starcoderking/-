$(function(){
	queryCoupon();
})
//获取优惠券
function queryCoupon(){
	var S = new Store();
	var userid = S.get('userid');
	var couponHtml ='';
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
					couponHtml+='<li><div>'
						+'<div class="sum">'
						+'<h3><b>￥</b>'+toUseMoney+'</h3>'
						+'<span>立&nbsp;&nbsp;减</span>'
						+'</div>'
						+'<div class="coupon-info">'
						+'<p class="scope">试听课可用</p>'
						+'<p>'+validity+'</p>'
						+'<p>优惠券编号:'+data[i].couponsnum+'</p>'
						+'</div>'
						+'</div>'
						+'<a href="trial_lesson.html">立即使用</a>'
						+'</li>'
				}
				$('.container ul').html(couponHtml);
			}else{
				$('.container ul').html('<h3 style="text-align:center;color:#666;">暂无优惠券信息</h3>');
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
	return y + "." + m.substring(m.length - 2, m.length) + "." + d.substring(d.length - 2, d.length);
}