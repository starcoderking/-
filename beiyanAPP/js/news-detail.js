$(function() {
	var nid=GetQueryString('newsid');
	getNews(nid);
});
//获取轮播图详情内容
function getNews(nid){
	var createtime = '';
	var newsname = '';
	$.ajax({
		type:"post",
		url:url+"/news/getPageNewsByid.action",
		async:false,
		data:{'nid':nid},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			if(data.createtime!=''&&data.createtime!=undefined){
				$('.mui-content>h3').text(data.createtime);
			}
			if(data.newsname!=''&&data.newsname!=undefined){
				$('.mui-content>h2').text(data.newsname);
			}
			if(data.newscontent!=''&&data.newscontent!=undefined){
				$('.detail_mes').html(data.newscontent);
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