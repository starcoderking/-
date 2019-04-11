$(function() {
	$('.header_box').load('header.html', function() {
		main();
		//navText('展示专区');
	});
	honorList(1,8);//默认显示第一页
	//获取荣誉列表的总条数
	var limit = 8;
	var totalRecords;
	var totalPage;
	$.ajax({
		type:"post",
		url:url+"/grades/getGradesCountByFrontEnd.action",
		async:false,
		success:function(data){
			totalRecords=data;
			totalPage=parseFloat(totalRecords/limit);
			if(parseInt(totalPage)-parseFloat(totalPage)==0){
				totalPage=totalPage;
			}else{
				totalPage=parseInt(totalPage+1);
			}
		}
	});
	kkpager.generPageHtml({
		//总页码
		total : totalPage,
		//总数据条数
		totalRecords : totalRecords,
		mode : 'click',//默认值是link，可选link或者click
		click : function(n){
			honorList(n,8);
			// do something
			//手动选中按钮
			this.selectPage(n);
			return false;
		}
	});
});
function honorList(page,limit){
	var lHtml='';
	$.ajax({
		type:"post",
		url:url+"/grades/getGradesPageByFrontEnd.action",
		async:false,
		data:{page:page,limit:limit},
		success:function(data){
			data = JSON.parse(data);
			$.each(data, function(i,item) {
				lHtml+='<a href="honor_detail.html?id='+item[0]+'">'
					+'<li>'
					+'<div class="honor_img"><img src="'+item[2]+'"></div>'
					+'<div class="honor_name">'+item[1]+'</div>'
					+'<div class="honor_more">了解详情>></div>'
					+'</li>'
					+'</a>'
			});
			$('.honor_list>ul').html(lHtml);
		}
	});
}
