var S = new Store();
var userid = S.get('userid');
var curTime ='';
var n=1;
$(function() {
	var today = getSystemTime();
	$('#date').val(today);
	curTime = $('#date').val();
	queryClassList(curTime,n);
	$('#date').change(function(){
		curTime = $(this).val();
		$('#thelist').html('');
		queryClassList(curTime,1);
	});
});
//获取班级列表
function queryClassList(curTime,page) {
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/teacher/getPageSchoolClassListByTidPage.action",
		async: false,
		data: {
			teacherid:userid,
			attendancedate:curTime,
			page: page,
			limit: 100
		},
		success: function(data) {
			if(data != '[]') {
				data = JSON.parse(data);
				for(var i=0; i<data.length; i++){
					cHtml+='<li>'
						+'<img src="'+data[i][10]+'" />'
						+'<div class="class-info">'
						+'<h3>'+data[i][2]+'</h3>'
						+'<p><span>上课时间：</span>'+data[i][8]+'</p>'
						+'<p><span>校区名称：</span>'+data[i][3]+'</p>'
						+'</div>'
						+'<a href="teacher_sign_choiceTime.html?classid='+data[i][0]+'">签到</a>'
						+'</li>'
				}
				$('#thelist').append(cHtml);
			}else{
				$('#thelist').html("<h3 style='text-align:center;color:#666;font-size:.45rem;padding-top:.5rem;'>暂无排班信息</h3>");
			}
		}
	})
}
//时间戳转换成日期格式函数
function getSystemTime(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	if(month<10){
		month = '0'+month;
	}
	var day = date.getDate();
	if(day<10){
		day = '0'+day;
	}
	return year+'-'+month+'-'+day;
}
