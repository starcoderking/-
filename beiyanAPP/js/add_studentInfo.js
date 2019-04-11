var S = new Store();
userid = S.get('userId');
$(function() {
	var orderInfoData = S.get('orderInfoData');
	if(orderInfoData!=null&&orderInfoData!='undefined'){
		orderInfoData = JSON.parse(orderInfoData);
		var orderNum = orderInfoData.detail[0].usersorderid;//获取到订单号
	}
	$('.header_box').load('header.html', function() {
		main();
	});
	studentList();
	$('.choice_student').on('click','li',function(){
		$(this).addClass('cur').siblings().removeClass('cur');
	})
	$('#addStudent').click(function(){
		$('.mask').show();
	});
	$('.info>h3>span').click(function(){
		$('.mask').hide();
	});
	$('#sure').click(function(){
		var mbid = $('.choice_student .cur').attr('data-id');
		$.ajax({
			type:"post",
			url:url+"/sysorder/editSysOrderMemberBody.action",
			async:false,
			data:{orderid:orderNum,userid:userid,membername:'',sex:'',dateofbirth:'',grade:'',schoolname:'',interests:'',remarks:'',mbid:mbid},
			success:function(data){
				data = JSON.parse(data);
				if(data.result==1){
					$('.alert').removeClass('none');
					$('.alert_content').removeClass('none');
					var json = {
						msg:"恭喜您绑定成功！",
						showMask: false, // 设置 showMask=false，禁用遮罩
						buttons:[
							{ title:"确定",click:function(){location.href = 'index.html';} }
						]
					}
		            $.alertView(json);
				}else{
					$.alertView('绑定失败');
				}
			}
		});
	});
	/*$('.alert_content button').click(function(){
		$('.alert').addClass('none');
		$('.alert_content').addClass('none');
		location.href = 'index.html';
	})*/
	$('.saveStudentInfo').click(function(){
		if($('#membername').val()=='' || $('#Wdate').val()==''){
			$.alertView('学员姓名生日必填！');
		}else{
			$('.mask').hide();
			addstudentInfo();
		}
	});
	$(".exit").click(function(){
		$('.mask').hide();
	});
});
//查询学员列表
function studentList(){
	var sHtml='';
	var sex='';
	var birthday='';
	$.ajax({
		type:"post",
		url:url+"/registered/getMemberBodyByUserId.action",
		async:false,
		data:{userid:userid},
		success:function(data){
			if(data!='null'&&data!=''&&data!='[]'){
				data = JSON.parse(data);
				for(var i=0;i<data.length;i++){
					if(data[i].sex==1){
						sex = '男';
					}else{
						sex = '女';
					}
					birthday = fmtDate(data[i].dateofbirth);
					if(i==0){
						sHtml+='<li data-id="'+data[i].mbid+'" class="cur"><span>'+data[i].membername+'</span><span>'+sex+'</span><span>'+birthday+'</span></li>'
					}else{
						sHtml+='<li data-id="'+data[i].mbid+'"><span>'+data[i].membername+'</span><span>'+sex+'</span><span>'+birthday+'</span></li>'
					}
				}
				$('.choice_student').html(sHtml);
				$('#sure').show();
			}else{
				$('.choice_student').html('<h3>当前没有学员，点击新增学员进行添加。</h3>');
				$('#sure').hide();
			}
		}
	});
}
//添加学员
function addstudentInfo() {
	var membername = $.trim($("#membername").val());
	var gender = $.trim($("#choice_sex").val());
	var birthday = $.trim($(".Wdate").val());
	var school = $.trim($("#school").val());
	var like = $.trim($("#like").val());
	$.ajax({
		type: "post",
		url: url + "/registered/editRegisteredUsersMemberBody.action",
		async: false,		
		data: {
			userid: userid,
			mbid: 0,
			membername: membername,
			sex: gender,
			dateofbirth: birthday,
			grade: '',
			schoolname: school,
			interests: like,
			remarks: ''
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data && data.result == 1) {
				$.alertView('添加成功');
				studentList();
				$('.students_list span:last-child').addClass('cur');
			} else {
				$.alertView('添加失败！');
			}
		}
	});
}
//时间戳转换成日期格式函数
function fmtDate(obj) {
	var date = new Date(obj);
	var y = 1900 + date.getYear();
	var m = "0" + (date.getMonth() + 1);
	var d = "0" + date.getDate();
	return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}