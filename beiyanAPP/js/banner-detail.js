$(function(){
	//展示轮播图详情信息
	var id='';
	id = GetQueryString('id');
	bannerInfo(id);
});
function bannerInfo(id){
	$.ajax({
		type:"post",
		url:url+"/pictureshow/getPictureShowPageByid.action",
		async:false,
		data:{'id':id},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			if(data.picturename!=''&&data.picturename!=undefined){
				$('.mui-title').html(data.picturename);
			}
			if(data.picturecontent!=''&&data.picturecontent!=undefined){
				$('.bannerMes').html(data.picturecontent);
			}
		}
	});
}
//获取URL中的参数值
function GetQueryString(name){
　　 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　 var r = window.location.search.substr(1).match(reg);
　　 if(r!=null)return  unescape(r[2]); return null;
}