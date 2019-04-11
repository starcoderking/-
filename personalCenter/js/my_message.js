function messageInit() {
	messages();
}
//通知和私信
function messages() {
	getClassList();
	$('.notice_list').on('click', 'li', function() {
		var classId = $(this).attr('data-id');
		var courseName = $(this).find('b').text();
		$('.notice_detail .chatName').html(courseName + '<span class="back" id="back1" title="返回"></span>');
		S.set('classid', classId);
		$(this).parents('.notice_list').addClass('none');
		$('.notice_detail').removeClass('none');
		getTeacherList();
	});
	$('.notice_detail').on('click', 'li', function() {
		var teacherId = $(this).attr('data-id');
		var teacherName = $(this).find('b').text();
		var chatInfo = $(this).find('img').attr('src');
		teacherImg = chatInfo; //保存点进来的教师头像
		S.set('teacherId', teacherId);
		$('.private_letter').removeClass('none');
		$('.private_letter').find('b').text(teacherName);
		$('.notice').addClass('none');
		//		查看当前是否有未读消息有则调取聊天记录
		if(parseInt($(this).find('.chatSign').text()) != 0) {
			time = getNowFormatDate();
			$('.private_letter>ul').html('');
			chatList();
		}
		reStartUnread();
	});
	$('#back2').click(function() {
		$('.private_letter').addClass('none');
		$('.notice').removeClass('none');
		$('.notice_detail').removeClass('none');
		reStartUnread();
		getTeacherList(); //重新获取教师列表
	});
	$('.notice_detail').on('click', '#back1', function() {
		$('.notice_list').removeClass('none');
		$('.notice_detail').addClass('none');
		getClassList(); //重新获取班级列表
	});
	//查询聊天记录，点击查看更多
	$('.private_letter .getMore').click(function() {
		chatList();
	});
	//发送消息
	$('.private_letter .text button').click(function() {
		sendMyMessage();
	});
	//	按回车发送消息
	$("#textMessage").bind('keyup', function(event) {
		if(event.keyCode == "13") {
			sendMyMessage();
		}
	});
}
var ws = new WebSocket("ws://39.106.112.14/ws/websocket");
//var ws = new WebSocket("ws://10.1.70.11:8080/ws/websocket");
ws.onopen = function() {
	login();
};
ws.onmessage = function(evt) {
	var ms = JSON.parse(evt.data);
	//console.log(ms);
	if($('.private_letter').is(':hidden')) {
		var teacherid = ms.userid.replace('t', '');
		var unreadNum = parseInt($('.notice_detail ul li[data-id="' + teacherid + '"]').find('.chatSign').text()); //未读消息数
		unreadNum += 1;
		$('.notice_detail ul li[data-id="' + teacherid + '"]').find('.chatSign').show().text(unreadNum);
		getClass(teacherid);
		for(var i = 0; i < classList.length; i++) {
			var num = Number($('.notice_list>li[data-id="' + classList[i] + '"]').children('.unread').text());
			//alert($('.notice_list>li[data-id="'+classList[i]+'"]').children('.unread').text());
			num += 1;
			$('.notice_list>li[data-id="' + classList[i] + '"]').find('.unread').show().text(num);
		}
	} else {
		var li = "<li><img src='" + teacherImg + "'><p>" + ms.msg + "</p></li>";
		$('.private_letter>ul').append(li);
	}
};
ws.onclose = function(evt) {
	//alert("WebSocketClosed!");
};
ws.onerror = function(evt) {
	//alert(evt);
};

function login() {
	var S = new Store();
	var userid = S.get('userId');
	if(ws != null && userid != '') {
		var login = {
			"userid": 'u' + userid,
			"type": "loginWS"
		};
		ws.send(JSON.stringify(login));
	}
}

function sendMyMessage() {
	var S = new Store();
	var textMessage = $("#textMessage").val();
	var userid = S.get('userId');
	var senduserid = S.get('teacherId');
	if(ws != null && textMessage != '') {
		var text = [{
			userid: 'u' + userid,
			senduserid: 't' + senduserid,
			textMessage: textMessage,
			sendtype: 1
		}];
		ws.send(JSON.stringify(text));
		var li = "<li class='me'><img src='" + $('.user_info>img').attr('src') + "'><p>" + textMessage + "</p></li>";
		$('.private_letter>ul').append(li);
		$("#textMessage").val('');
	}
}
//更变流水未读状态
function reStartUnread() {
	var teacherId = S.get('teacherId');
	$.ajax({
		type: "post",
		url: url + "/wsmessage/setMsgRead.action",
		async: false,
		data: {
			senduserid: userid,
			recuserid: teacherId,
			sendusertype: 1
		},
		success: function(data) {}
	});
}
//获取会员下对应的班级列表
function getClassList() {
	var S = new Store();
	var userid = S.get('userId');
	var cHtml = '';
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getClassByUser.action",
		async: false,
		data: {
			userid: userid
		},
		success: function(data) {
			if(data != null && data != '[]') {
				data = JSON.parse(data);
				$.each(data, function(i, item) {
					if(item.notReadCount == 0) {
						cHtml += '<li data-id="' + item.classid + '">' +
							'<img src="' + item.topimageurl + '" class="avatar" />' +
							'<b class="courseName">' + item.rname + '</b>' +
							'<span class="unread none">' + item.notReadCount + '</span>' +
							'</li>'
					} else {
						cHtml += '<li data-id="' + item.classid + '">' +
							'<img src="' + item.topimageurl + '" class="avatar" />' +
							'<b class="courseName">' + item.rname + '</b>' +
							'<span class="unread">' + item.notReadCount + '</span>' +
							'</li>'
					}
				});
				$('.message .notice_list').html(cHtml);
			}else{
				$('.message .notice_list').html('<h2 style="text-align:center;color:#666;">当前无报班信息，无法显示消息列表</h2>');
			}
		}
	});
}
//根据班级id和用户id获取教师列表
function getTeacherList() {
	var S = new Store();
	var userid = S.get('userId');
	var classid = S.get('classid');
	var tHtml = '';
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getTeacherByClass.action",
		async: false,
		data: {
			userid: userid,
			classid: classid
		},
		success: function(data) {
			data = JSON.parse(data);
			$.each(data, function(i, item) {
				if(item.notReadCount == 0) {
					tHtml += '<li data-id="' + item.teacherid + '">' +
						'<div class="chatPhoto">' +
						'<img src="' + item.topimageurl + '">' +
						'<span class="chatSign none">' + item.notReadCount + '</span>' +
						'</div>' +
						'<div class="chatInfo">' +
						'<div class="chatNote"><b>' + item.rname + '</b><span>' + item.opertime + '</span></div>' +
						'<div class="chatMes">' + item.cont + '</div>' +
						'</div>' +
						'</li>'
				} else {
					tHtml += '<li data-id="' + item.teacherid + '">' +
						'<div class="chatPhoto">' +
						'<img src="' + item.topimageurl + '">' +
						'<span class="chatSign">' + item.notReadCount + '</span>' +
						'</div>' +
						'<div class="chatInfo">' +
						'<div class="chatNote"><b>' + item.rname + '</b><span>' + item.opertime + '</span></div>' +
						'<div class="chatMes">' + item.cont + '</div>' +
						'</div>' +
						'</li>'
				}
			});
			$('.notice_detail>ul').html(tHtml);
		}
	});
}
//根据会员id和教师id查询对应的班级
function getClass(teacherId) {
	var S = new Store();
	var userid = S.get('userId');
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getClassByTeacherUser.action",
		async: false,
		data: {
			teacherid: teacherId,
			userid: userid
		},
		success: function(data) {
			data = JSON.parse(data);
			classList = data;
		}
	});
}
//获取系统时间用来查询聊天记录
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}
//查询聊天记录
function chatList() {
	var S = new Store();
	var userid = S.get('userId'); //我的id
	var recuserid = S.get('teacherId'); //接收信息教师id
	if(!time || time == undefined) {
		time = getNowFormatDate();
	}
	var html = '';
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getMsgPage.action",
		async: false,
		data: {
			'page': 1,
			'limit': 5,
			'senduserid': userid,
			'recuserid': recuserid,
			'sendusertype': 1,
			'time': time
		},
		success: function(data) {
			data = JSON.parse(data);
//			console.log(data);
			$.each(data, function(i, item) {
				if(item.sendusertype != 1) {
					html += "<li><img src='" + teacherImg + "'><p>" + item.cont + "</p></li>";
				} else {
					html += "<li class='me'><img src='" + $('.user_info>img').attr('src') + "'><p>" + item.cont + "</p></li>";
				}
				if(i == 0) {
					time = formatDateTimeSecond(item.opertime);
				}
			});
			$(".private_letter>ul").prepend(html);
		}
	});
}