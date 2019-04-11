$(function(){
	var studentid=GetQueryString('studentid');
	$.ajax({
		type:"post",
		url:url+"/goodstudents/getGoodStudentsByidByFrontEnd.action",
		async:false,
		data:{id:studentid},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			$('.mui-title').text(data.goodstudentsname);
			$('.container').html(data.content);
		}
	});
});
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return unescape(r[2]);
	return null;
}
