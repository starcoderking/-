$(function(){
	var S = new Store();
	var userid = S.get('userid');
	//输入框重置
	$('.icon-iconfonterror').click(function(){
		$(this).parent('.textBg').find('input').val('').focus();
	});
	//设置学员信息
	var memberid='';
	memberid = GetQueryString('mbid');
	if(memberid != '' && memberid != undefined && memberid != null){
		studentInfo(memberid);
	}
	//设置学员信息，进行提交
	$("#submit").click(function(){
		var membername = $.trim($("#membername").val());
		var gender = $.trim($("#choice_sex").val());
		var birthday = $.trim($("#date").val());
		var school = $.trim($("#school").val());
		var like = $.trim($("#like").val());
		if(memberid != '' && memberid != undefined && memberid != null){
			$.ajax({
				type: "post",
				url: url + "/registered/editRegisteredUsersMemberBody.action",
				async: false,
				data: {
					userid: userid,
					mbid: memberid,
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
					if(data && data != '' && data.result == 1) {
						$.alertView('保存成功');
					} else {
						$.alertView('保存失败！');
					}
				}
			});
		}else{
			var sourse = GetQueryString('source');//查看来源，如来自购课添加成功后跳回去
			$.ajax({
				type: "post",
				url: url + "/registered/editRegisteredUsersMemberBody.action",
				async: false,
				data: {
					userid: userid,   //正式改回userid
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
						if(sourse=='order_detail'){
							history.go(-1);
						}
					} else {
						$.alertView('添加失败！');
					}
				}
			});
		}
		location.href='student-information.html';
	});
});
function studentInfo(memberid){
	var U = new Url();
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBody.action",
		async: false,
		data: {
			mbodyid: memberid
		},
		success: function(data) {
			data = U.tJson(data);
			//console.log(data);
			var dateofbirth = formatDateTime(data.dateofbirth);
			$('#membername').val(data.membername);
			$('#choice_sex').val(data.sex);
			$('#date').val(dateofbirth);
			$('#school').val(data.schoolname);
			$('#like').val(data.interests);
		}
	});
}
//获取URL中的参数值
function GetQueryString(name){
　　 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　 var r = window.location.search.substr(1).match(reg);
　　 if(r!=null)return  unescape(r[2]); return null;
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
    return y + '-' + m + '-' + d
}; 