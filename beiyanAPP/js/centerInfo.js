$(function(){
	centerIntro();
});
//中心简介
function centerIntro(){
	$.ajax({
		type:"post",
		url:url+"/sysinformation/getContByidShowByFrontEnd.action",
		async:false,
		data:{id:1},
		success:function(data){
			data = JSON.parse(data);
			if(data.infocontent!=''&&data.infocontent!=undefined){
				$('.mesBg').html(data.infocontent);
			}
		}
	});
}