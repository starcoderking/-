$(function() {
	$('.header_box').load('header.html', function() {
		main();
		navText('师资介绍');
	});
	teacherList(1,12);//默认第一页显示
//	获取教师列表的总条数
	var limit = 12;
	var totalRecords;
	var totalPage;
	$.ajax({
		type:"get",
		url:url+"/teacher/getTeacherCountByFrontEnd.action",
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
			teacherList(n,12);
			// do something
			//手动选中按钮
			$(document.body).limit();
			this.selectPage(n);
			return false;
		}
	});
	//限制文本字数
	$(document.body).limit();
});

jQuery.fn.limit=function(){
    //这里的div去掉的话，就可以运用li和其他元素上了，否则就只能div使用。
    var self = $("p[limit]");
      self.each(function(){
           var objString = $(this).text();
           var objLength = $(this).text().length;
           var num = $(this).attr("limit");
           if(objLength > num){
            //这里可以设置鼠标移动上去后显示标题全文的title属性，可去掉。
            $(this).attr("title",objString);
            objString = $(this).text(objString.substring(0,num) + "...");
           }
      })
}
function teacherList(page,limit){
	var tHtml='';
	$.ajax({
		type:"post",
		url:url+"/teacher/getTeacherPageByFrontEnd.action",
		async:false,
		data:{page:page,limit:limit},
		success:function(data){
			//console.log(data);
			data= JSON.parse(data);
			$.each(data,function(i,item){
				var personal_info=item.teacherremark;
				var intro=item.cont;
				if(intro=='null'){
					intro='';
				}
				//console.log(personal_info);
				//personal_info=personal_info.substring(personal_info.indexOf('个人简介：')+5,personal_info.lastIndexOf('<br />'))
				tHtml+='<li>'
					+'<a href="teacher_detail.html?id='+item.teacherid+'">'
					+'<img src="'+item.topimageurl+'">'
					+'<div>'
					+'<h2><span>'+item.teachername+'</span>/'+item.teachertype+'</h2>'
					+'<p limit="30" title="'+item.cont+'" limit="60">'+intro+'</p>'
					+'</div>'
					+'</a>'
					+'</li>'
			})
			$('.teacher_list>ul').html(tHtml);
		}
	});
}
//限制文本字数
jQuery.fn.limit=function(){
//这里的div去掉的话，就可以运用li和其他元素上了，否则就只能div使用。
var self = $("p[limit]");
  self.each(function(){
       var objString = $(this).text();
       var objLength = $(this).text().length;
       var num = $(this).attr("limit");
       if(objLength > num){
        //这里可以设置鼠标移动上去后显示标题全文的title属性，可去掉。
        $(this).attr("title",objString);
        objString = $(this).text(objString.substring(0,num) + "...");
           }
      })
}