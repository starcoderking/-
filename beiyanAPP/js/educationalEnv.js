$(function(){
	education();
});
//教育环境展示
function education(){
	$.ajax({
		type:"post",
		url:url+"/sysinformation/getContByidShowByFrontEnd.action",
		async:false,
		data:{id:3},
		success:function(data){
			data = JSON.parse(data);
			if(data.infocontent!=''&&data.infocontent!=undefined){
				console.log(data.infocontent);
				$('.educationMes').html(data.infocontent);
			}
		}
	});
}