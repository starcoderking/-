function huiminCardInit(){
	queryHuiminCard();
}
//获取惠民卡
function queryHuiminCard(){
	var S = new Store();
	var userid = S.get('userId');
	var huiminHtml ='';
	var toUseMoney = '';//抵用金额
	var validity = '';//有效期
	$.ajax({
		type:"post",
		url:url+"/huimincard/getHuiminCardListByUserId.action",
		async:false,
		data:{userid:userid,scid:0},
		success:function(data){
			if(data!=null&&data!=''&&data!='[]'){
				data = JSON.parse(data);
				for(var i=0;i<data.length;i++){
					toUseMoney = (data[i].cardmoney/100).toFixed(2);
					validity = fmtDate(data[i].startusedate)+'-'+fmtDate(data[i].endusedate);
					huiminHtml+='<tr><td>'+data[i].cardnum+'</td><td>'+toUseMoney+'</td><td>'+validity+'</td><td><a href="../featuresCourse.html">去使用</a></td></tr>'
				}
				$('.huiminCard table tbody').html(huiminHtml);
			}else{
				$('.huiminCard table').css('border','none');
				$('.huiminCard table').html('<h2 style="text-align:center;color:#666;">暂无惠民卡信息</h2>');
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
