function studentInit() {
	addStudentList();
	studentInfoEdit();
	studentInfoDelete();
	studentInfoEvent();
}
//学员信息
function addStudentList() {
	var S = new Store();
	var U = new Url();
	var userid = S.get('userId');
	var sHtml = ''; //学员信息的学员列表
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBodyByUserId.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
			if(data != '' && data != null) {
				sList = JSON.parse(data);
				for(var i = 0; i < sList.length; i++) {
					var sex = '';
					var birthday = fmtDate(sList[i].dateofbirth);
					if(sList[i].sex == 1) {
						sex = '男';
						sHtml += '<li class="boy" data-studentid="' + sList[i].mbid + '">' +
						'<h3>' + sList[i].membername + '</h3>' +
						'<p>性&nbsp;&nbsp;别:' + sex + '</p>' +
						'<p>生&nbsp;&nbsp;日:' + birthday + '</p>' +
						'<p>学&nbsp;&nbsp;校:' + sList[i].schoolname + '</p>' +
						'<p>兴趣爱好:' + sList[i].interests + '</p>' +
						'<span class="studentEdit">编辑</span><span class="studentDelete none">删除</span>'
					} else {
						sex = '女';
						sHtml += '<li class="girl" data-studentid="' + sList[i].mbid + '">' +
						'<h3>' + sList[i].membername + '</h3>' +
						'<p>性&nbsp;&nbsp;别:' + sex + '</p>' +
						'<p>生&nbsp;&nbsp;日:' + birthday + '</p>' +
						'<p>学&nbsp;&nbsp;校:' + sList[i].schoolname + '</p>' +
						'<p>兴趣爱好:' + sList[i].interests + '</p>' +
						'<span class="studentEdit">编辑</span><span class="studentDelete none">删除</span>'
					}
				}
				sHtml+='<li class="addStudent"><h3>添加新学员</h3><p>+</p></li>'
				$('.student_card ul').html(sHtml);
			} else {
//				$('.student_card ul').html("<h3 style='color:#666;'>暂无学员信息</h3>");
				$('.student_card ul').html('<li class="addStudent"><h3>添加新学员</h3><p>+</p></li>');
			}
		}
	});
}
//点击编辑显示学员信息
function studentInfoEdit() {
	var S = new Store();
	var userid = S.get('userId');
	var mbid = '';
	$('.student_card ul').on('click', '.studentEdit', function() {
		$('.student_mask').show();
		$('.student_form').show();
		$('.add').hide();
		$('.save').show();
		$('.student_form b').hide();//必填项*号隐藏
		mbid = $(this).parent('li').attr('data-studentid');
		$.ajax({
			type: "post",
			url: url + "/registered/getMemberBody.action",
			async: false,
			data: {
				mbodyid: mbid
			},
			success: function(data) {
				data = JSON.parse(data);
				var dateofbirth = fmtDate(data.dateofbirth);
				$('#membername').val(data.membername);
				$('#choice_sex').val(data.sex);
				$('.Wdate').val(dateofbirth);
				$('#school').val(data.schoolname);
				$('#like').val(data.interests);
			}
		});
	});
	//	保存学员信息
	$('.save').click(function() {
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
				mbid: mbid,
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
					SimplePop.alert('保存成功');
					addStudentList();
				} else {
					SimplePop.alert('保存失败！');
				}
			}
		});
		//		隐藏遮罩层和表单
		$('.student_mask').hide();
		$('.student_form').hide();
	});
//	添加学员
	$('.add').click(function() {
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
			success:function(data){
				data = JSON.parse(data);
				if(data.result ==1){
					SimplePop.alert('添加成功');
					addStudentList();
				}else{
					SimplePop.alert('添加失败');
				}
			}
		});
//		隐藏遮罩层和表单
		$('.student_mask').hide();
		$('.student_form').hide();
	})
}
//删除学员信息
function studentInfoDelete() {
	var mbid = '';
	$('.student_card ul').on('click', '.studentDelete', function() {
		mbid = $(this).parent('li').attr('data-studentid');
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
				if(data.result == 1) {
					SimplePop.alert('删除成功');
					$('.student_card ul li[data-studentid=' + mbid + ']').remove();
				} else {
					SimplePop.alert('删除失败！');
				}
			}
		});
	})
}

function studentInfoEvent() {
	//	点击删除学员
	$('.del_student').click(function() {
		$('.studentEdit').hide();
		$('.studentDelete').show();
		return false;
	});
	//	点击添加学员
	$('.student_card').on('click','.addStudent',function() {
		$('.student_mask').show();
		$('.student_form').show();
		$('.student_form input').val('');
		$('.student_form .add').show();
		$('.student_form .save').hide();
		$('.student_form b').show();//必填项*号显示
		return false;
	});
	//点击遮罩层的关闭按钮关闭遮罩层
	$('.close_mask').click(function(){
		$('.student_mask').hide();
		$('.student_form').hide();
	});
	//点击任意位置让名片处于编辑状态
	$('.center .student_info').click(function(){
		$('.studentEdit').show();
		$('.studentDelete').hide();
		return false;
	});
}
//初始化显示学员信息
function initStundentInfo() {
	$('.students_list span:first-child').addClass('cur');
	var memberid = $('.students_list span:first-child').attr('data-id');
	$.ajax({
		type: "post",
		url: url + "/registered/getMemberBody.action",
		async: false,
		data: {
			mbodyid: memberid
		},
		success: function(data) {
			//			data = U.tJson(data);
			if(data != '' && data != 'null') {
				data = JSON.parse(data);
				var dateofbirth = fmtDate(data.dateofbirth);
				$('#membername').val(data.membername);
				$('#choice_sex').val(data.sex);
				$('.Wdate').val(dateofbirth);
				$('#school').val(data.schoolname);
				$('#like').val(data.interests);
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