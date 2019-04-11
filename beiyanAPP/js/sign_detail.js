var classid = GetQueryString('classid');
var arrangingid = GetQueryString('arrangingid');
$(function() {
	var state = GetQueryString('state');
	querySignRecode(classid, arrangingid);
	event();
	if(state == 0) {
		$('input').attr('disabled', true);
		$('.save').hide();
	}
	$('input').click(function() {
		$(this).parents('i').addClass('radio_bg_check');
		$(this).parents('i').parents('lable').siblings().find('i').removeClass('radio_bg_check');
	})
});

function event() {
	var S = new Store();
	$('.add_remark').click(function() {
		$(this).next('.remark').toggle('none');
		$(this).parent().siblings().find('.remark').hide();
	});
	$('.save').click(function() {
		var signData = []; //用来保存签到数据
		var teacherid = 2; //S.get('userid');
		var num = $('.mui-content>ul>li').length; //学员总记录数
		var teacherDate = {
			'teacherid': teacherid,
			'schoolclassid': classid,
			'arrangingid': arrangingid,
			'agent': 0
		};
		for(var i = 0; i < num; i++) {
			if($('.mui-content>ul>li').eq(i).find('input:checked').length != 0) {
				var mbidParent = $('.mui-content>ul>li').eq(i).attr('data-userid');
				var mbid = $('.mui-content>ul>li').eq(i).attr('data-mbid');
				var attendancestate = $('.mui-content>ul>li').eq(i).find('input:checked').val();
				var attendancecontent = $('.mui-content>ul>li').eq(i).find('textarea').val();
				var data = {
					'userid': mbidParent,
					'mbid': mbid,
					'attendancestate': attendancestate,
					'schoolclassid': classid,
					'arrangingid': arrangingid,
					'teacherid': teacherid,
					'attendancecontent': attendancecontent
				};
				signData.push(data);
			}
		}
		$.ajax({
			type: "post",
			url: url + "/ruattendance/setAttendance.action",
			async: false,
			data: {
				'tattendance': JSON.stringify(teacherDate),
				'mbattendance': JSON.stringify(signData)
			},
			success: function(data) {
//				console.log(data);
				data = JSON.parse(data);
				if(data==1){
					$.alertView('签到成功！');
				}else{
					$.alertView('签到失败！');
				}
			}
		});
	});
}
//获取签到记录
function querySignRecode(classid, arrangingid) {
	var lHtml = '';
	$.ajax({
		type: "post",
		url: url + "/class/getMemberBodyListByCid.action",
		async: false,
		data: {
			classid: classid,
			arrangingid: arrangingid
		},
		success: function(data) {
			data = JSON.parse(data);
			for(var i = 0; i < data.length; i++) {
				if(data[i].attendancestate == 1) {
					lHtml += '<li data-userid="' + data[i].userid + '" data-mbid="' + data[i].mbid + '">' +
						'<span class="name">' + data[i].membername + '</span>' +
						'<lable>' +
						'<i class="input_style radio_bg radio_bg_check">' +
						'<input type="radio" name="hot' + [i] + '" value="1" checked>' +
						'</i>准时' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="2">' +
						'</i>迟到' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="3">' +
						'</i>旷课' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="4">' +
						'</i>其他' +
						'</lable>' +
						'<button class="add_remark">备注</button>' +
						'<div class="remark none"><h3>备注</h3><textarea name="">'+data[i].attendancecontent+'</textarea></div>' +
						'</li>'
				} else if(data[i].attendancestate == 2) {
					lHtml += '<li data-userid="' + data[i].userid + '" data-mbid="' + data[i].mbid + '">' +
						'<span class="name">' + data[i].membername + '</span>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="1">' +
						'</i>准时' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg radio_bg_check">' +
						'<input type="radio" name="hot' + [i] + '" value="2" checked>' +
						'</i>迟到' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="3">' +
						'</i>旷课' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="4">' +
						'</i>其他' +
						'</lable>' +
						'<button class="add_remark">备注</button>' +
						'<div class="remark none"><h3>备注</h3><textarea name="">'+data[i].attendancecontent+'</textarea></div>' +
						'</li>'
				} else if(data[i].attendancestate == 3) {
					lHtml += '<li data-userid="' + data[i].userid + '" data-mbid="' + data[i].mbid + '">' +
						'<span class="name">' + data[i].membername + '</span>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="1">' +
						'</i>准时' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="2">' +
						'</i>迟到' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg radio_bg_check">' +
						'<input type="radio" name="hot' + [i] + '" value="3" checked>' +
						'</i>旷课' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="4">' +
						'</i>其他' +
						'</lable>' +
						'<button class="add_remark">备注</button>' +
						'<div class="remark none"><h3>备注</h3><textarea name="">'+data[i].attendancecontent+'</textarea></div>' +
						'</li>'
				} else if(data[i].attendancestate == 4) {
					lHtml += '<li data-userid="' + data[i].userid + '" data-mbid="' + data[i].mbid + '">' +
						'<span class="name">' + data[i].membername + '</span>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="1">' +
						'</i>准时' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="2">' +
						'</i>迟到' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="3">' +
						'</i>旷课' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg radio_bg_check">' +
						'<input type="radio" name="hot' + [i] + '" value="4" checked>' +
						'</i>其他' +
						'</lable>' +
						'<button class="add_remark">备注</button>' +
						'<div class="remark none"><h3>备注</h3><textarea name="">'+data[i].attendancecontent+'</textarea></div>' +
						'</li>'
				} else {
					lHtml += '<li data-userid="' + data[i].userid + '" data-mbid="' + data[i].mbid + '">' +
						'<span class="name">' + data[i].membername + '</span>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="1">' +
						'</i>准时' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="2">' +
						'</i>迟到' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="3">' +
						'</i>旷课' +
						'</lable>' +
						'<lable>' +
						'<i class="input_style radio_bg">' +
						'<input type="radio" name="hot' + [i] + '" value="4">' +
						'</i>其他' +
						'</lable>' +
						'<button class="add_remark">备注</button>' +
						'<div class="remark none"><h3>备注</h3><textarea name=""></textarea></div>' +
						'</li>'
				}
			}
			$('.mui-content>ul').html(lHtml);
		}
	});
}
//从url中获取参数
function GetQueryString(name) {　　
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");　　
	var r = window.location.search.substr(1).match(reg);　　
	if(r != null) return decodeURI(r[2]);
	return null;　　
}