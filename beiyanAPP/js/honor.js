$(function(){
	honorShow();
})
//荣誉展示
function honorShow(){
	var hHtml='';
	$.ajax({
		type:"get",
		url:url+"/grades/getGradesTopFive.action",
		async:false,
		success:function(data){
			data = JSON.parse(data);
			if(data.length>=5){
				$('.honor_list>a').show();
			}else{
				$('.honor_list>a').hide();
			}
			$.each(data, function(i,item) {
				hHtml+='<a href="honor-details.html?id='+item[0]+'">'
					+'<li>'
					+'<img src="'+item[2]+'" />'
					+'<p>'+item[1]+'</p>'
					+'</li>'
					+'</a>'
			});
			$('.content ul').html(hHtml);
		}
	});
}
