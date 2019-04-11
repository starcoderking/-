$(function(){
	$('.header_box').load('header.html', function() {
		main();
		//navText('展示专区');
	});
	var id=GetQueryString('id');
	detailContent(id);
})
//获取页面内容
function detailContent(id){
	$.ajax({
		type:"post",
		url:url+"/grades/getGradesByidByFrontEnd.action",
		async:false,
		data:{'id':id},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			if(data.gradescontent!=''&&data.gradescontent!=undefined){
				$('.honorTitle').html(data.gradesname);
				$('.honorMes').html(data.gradescontent);
			}
		}
	});
}
//从url中获取参数值
 function GetQueryString(name){
　　 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　 var r = window.location.search.substr(1).match(reg);
　　 if(r!=null)return  unescape(r[2]); return null;
}
