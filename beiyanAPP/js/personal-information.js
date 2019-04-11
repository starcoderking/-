var S = new Store();
var U = new Url();
var I = new Interfaces();
var userid = S.get('userid');
function init(){
	I.query_personal_info();
	var personal_data = U.tJson(S.get('personal_info'));
	if(personal_data.topimageurl!=''){
		$('.img span img').attr('src',personal_data.topimageurl);
	}
	$('#nickname').val(personal_data.nickname);
	$('#uname').val(personal_data.fullname);
	$('#phone').val(personal_data.phonenumber);
	if(personal_data.address!='null'){
		$('#address').val(personal_data.address);
	}	
}
function submit(){
	$('.submit').click(function(){
		var nickname = $.trim($("#nickname").val());
		var name = $.trim($("#uname").val());
		var phone = $.trim($("#phone").val());
		var address = $.trim($("#address").val());
		var json_obj = {'userid':userid,'contactway':'','residentarea':'','address':address,'fullname':name,'nickname':nickname,'phonenumber':phone};
		I.save_personal_info(json_obj);
	})
}
function event(){
//	将点击的li的信息通过url传送给下一个页面
	$(".mui-content ul li.img").click(function(){
		var i = $(this).index();
		var src = $(this).find('img').attr('src');
		location.href='personal-photo.html?src='+src+'&i='+i;
	});
//	$(".mui-content ul li.text").click(function(){
//		var i = $(this).index();
//		var key = $(this).children('span').text();
//		var value = $(this).children('em').text();
//		location.href='personal-modify.html?key='+key+'&value='+value+'&i='+i;
//	});
	$('input').attr('disabled',true);
//	点击编辑按钮事件
	$('.edit').click(function(){
		$('input').attr('disabled',false);
		$('#nickname').focus();
		var result=$("#nickname").val();//对input取值
        $("#nickname").val("")//使input的值为空
        $("#nickname").val(result);//重新负值
		$(this).hide();
		$(this).siblings('.submit').show();
	});
////	文本框获取焦点后编辑按钮隐藏提交按钮显示
//	$('input').focus(function(){
//		$('.edit').hide();
//		$('.submit').show();
//	})
}
$(function(){
	init();
	event();
	submit();
})