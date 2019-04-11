$(function(){
	//加载学员列表
	addStudentList();
	//点击某一学员跳转学员信息编辑页
	var mbid;
	$(".studentList li").on('click','font.edit',function(){
		mbid = $(this).parent().parent().attr('data-mbid');
		location.href='student-add.html?mbid='+mbid;
	});
	//点击删除学员
	$("#del").click(function(){
		$('.edit').hide();
		$('.del').show();
		$('#finish').show();
		$(this).hide();
	});
	$("#finish").click(function(){
		$('.edit').show();
		$('.del').hide();
		$('#del').show();
		$(this).hide();
	});
	$(".studentList li").on('click','font.del',function(){
		//event.stopPropagation();
		mbid = $(this).parent().parent().attr('data-mbid');
		$.ajax({
			type: "post",
			url: url + "/registered/editStartEndRegisteredUsersMemberBody.action",
			async: false,
			data: {
				mbid: mbid,
				state: 0
			},
			success: function(data) {
				data = JSON.parse(data);
				if(data && data != '' && data != undefined) {
					if(data.result == 1) {
						$.alertView('删除成功！');
						addStudentList();
						$('#finish').hide();
						$('#del').show();
					} else {
						$.alertView('删除失败！');
					}
				}
			}
		});
	});
})
//学员信息
function addStudentList(){
	var S = new Store();
	var U = new Url();
	var userid = S.get('userid');
	var sHtml = ''; //学员信息的学员列表
	var sex;
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBodyByUserId.action",
		async: false,
		data: {
			'userid': userid   
		},
		success: function(data) {
			sList = U.tJson(data);
			if(sList != '' && sList != null) {
				for(var i = 0; i < sList.length; i++) {
					if(sList[i].sex==1){
						sex="男";
					}else{
						sex="女";
					}
					sHtml += '<li data-mbid="'+sList[i].mbid+'">'
						  +'<div class="studentName">'+sList[i].membername+'<font class="iconfont icon-edit edit"></font><font class="iconfont icon-iconfonterror del none"></font></div>'
						  +'<div class="studentMes">'
						  +'<p>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:<font>'+sex+'</font></p>'
						  +'<p>生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日:<font>'+formatDateTime(sList[i].dateofbirth)+'</font></p>'
						  +'<p>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校:<font>'+sList[i].schoolname+'</font></p>'
						  +'<p>兴趣爱好:<font>'+sList[i].interests+'</font></p>'
						  +'</div>'
						  +'</li>'
				}
				$('.studentList').html(sHtml);
			} else {
				$('.studentList').html('<h3 style="text-align:center;color:#666;padding:.3rem 0;">暂无学员信息，请点击添加</h3>');
				return false;
			}
		}
	});
}

//时间戳转成日期
function formatDateTime(inputTime) {    
    var date = new Date(inputTime);  
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; 
    return y + '-' + m + '-' + d;
}; 
