$(function(){
	var userid = '当前用户id';
	$.ajax({
		type:"get",
		url:"queryStudent.json",
		data:{
			"userid":userid
		},
		async: false,
		success:function(data){
			var html1,html2;
			$.each(data,function(i,item){
				//学员信息
				html1 = '<span>' + item.membername + '</span>';
				$(".students_list").append(html1);
				$(".students_list span:first").addClass('cur');
				$("#membername").val($(".students_list span:first").text());
				$(".students_list span").eq(i).data('datas',item);
				//我的课程表
				html2 = '<option id="'+ item.mbid +'">' + item.membername + '</option>';
				$("#student").append(html2);
			});
		}
	});
	$(".students_list span").click(function(){
		$(this).addClass('cur');
		$(this).siblings().removeClass('cur');
		$("#membername").val($(this).data('datas').membername);
	});
});

function studentSel(){
	mbid = $("#student option:selected").attr('id');
	$.ajax({
		url:"studentData.json",
		data:{
			"mbid":mbid
		},
		async: false,
		success:function(data){
			$.each(data,function(i,item){
				dayList.splice(0,dayList.length);//清除原来的数组
				dayList.push(item);
			});	
		}
	});
}
function dayMouseenter(i){
	var dates,dates2,html;
	if(i<10){
		dates = $("#yearsMonth").val()+"0" + i;
	}else{
		dates = $("#yearsMonth").val() + i;
	}
	
	for(var j=0;j<dayList.length;j++){
		dates2 = Number(dayList[j][4].replace(/-/g,""));
		if(dates == dates2){
			$("#dialog").show();
			html = '<ul><li>'+ dayList[j][2] +'</li><li>'+ dayList[j][3] +'</li></ul>';
			//console.log(html);
			$("#dialog").append(html);
		}
	}
}
function dayMouseleave(){
	$("#dialog").hide();
	$("#dialog ul").remove();
}
