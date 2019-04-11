/*mui.init({
	swipeBack:true //启用右滑关闭功能
});
*/
var time=''; 
var flag=0;
var studentHtml='';
$(function(){
	var S= new Store();
	var userid = S.get('userid');
	//userid=1;
	//获取登录的账户ID,即教师id/发送者id
	getLoginID();
	//获取班级列表
	classList(userid);
	//获取教师信息
	getTeacherInfo(userid);
	//点击班级进入学员列表
	$("#chatClass").on('click','li',function(){
		$("#className b").text($(this).find('b').text());
		var classid = $(this).attr('data-classid');
		if($(this).find('.chatList').css('display') == 'none'){
			$(this).find('.chatList').show();
			//$(this).siblings().find('.chatList').hide();
		}else{
			$(this).find('.chatList').hide();
		}
	});
	//点击学员进入聊天界面
	$(".chatList").on('click','li',function(){
		event.stopPropagation();
		time=getNowFormatDate();
		//alert("初始时间:"+time);
		$("#studentName b").text('"'+$("#teacherName").val()+'"与"'+$(this).find('b').text()+'"对话中');
		$("#studentPhoto").val($(this).find('img').attr('src'));
		$(".chatTitle").hide();
		$("#chatClass").hide();
		$("#chatDetail").show();
		$("#studentId").val($(this).attr('id'));
		//当点击一个会员与其会话时，班级中的消息未读条数应该把该会员中的消息未读条数减去
		$(this).parent().parent().find('span.teacherSign').text((Number($(this).parent().parent().find('span.teacherSign').text())-Number($(this).find('span.studentSign').text())));
		if($(this).parent().parent().find('span.teacherSign').text()==0){
			$(this).parent().parent().find('span.teacherSign').hide();
		}
		//当点击一个会员与其会话时，该会员中的消息未读条数清除，置为0
		$(this).find('span.studentSign').text('0').hide();
		//1:senduserid发送者id(就是教师id)
		chatList(userid,$("#studentId").val());
		setMsgRead(userid,$("#studentId").val());
	});
	
	//点击发送按钮，进行发送消息
	$("#chatSubmit").click(function(){
		sendMyMessage();
	});
	//聊天时，在输入框中按回车键即可发送消息
	$("#chatTextarea").bind('keyup', function(event) {
        if (event.keyCode == "13") {
            sendMyMessage();
        }
    });
	//点击查看更多历史记录
	$(".chatMore").click(function(){
		flag=1;
		chatList(userid,$("#studentId").val());
	});
	
	//点击返回2，返回学员列表
	$("#back").click(function(){
		flag=0;
		$("#chatDetail").hide();
		$(".chatTitle").show();
		$("#chatClass").show();
		$("#chatDetail ul").children().remove();
		setMsgRead(userid,$("#studentId").val());
	});
	//点击关闭2，关闭弹出层
	$('#close2').click(function(){
		$("#mesTextarea").val('');
		$(".mesDialog").hide();
	});
	//点击父节点复选框
	$(".checkAll").click(function(){
		event.stopPropagation();
		$(this).toggleClass('select');
		if($(this).hasClass('select')==true){
			$(this).parent().parent().siblings('ul').find('em.checkChild').addClass('select');
			$(".sendBtn").show();
		}else{
			$(this).parent().parent().siblings('ul').find('em.checkChild').removeClass('select');
			if($(".checkAll").hasClass('select')==true){
				$(".sendBtn").show();	
			}else{
				$(".sendBtn").hide();
			}
		}
	});
	
	//点击子节点复选框
	$(".checkChild").click(function(){
		event.stopPropagation();
		$(this).toggleClass('select');
		if($(this).hasClass('select')==true){
			$(".sendBtn").show();
			if($(this).parent().parent().parent().find("em.select").length==$(this).parent().parent().parent().find('li').length){
				$(this).parent().parent().parent().parent().find('em.checkAll').addClass('select');
			}else{
				$(this).parent().parent().parent().parent().find('em.checkAll').removeClass('select');
			}
		}else{			
			if($(".checkChild").hasClass('select')==true){
				$(".sendBtn").show();	
				$(this).parent().parent().parent().parent().find('em.checkAll').removeClass('select');
			}else{
				$(".sendBtn").hide();
			}
		}
	});
	//点击群发按钮
	var studentIdArry= new Array();
	$("#sendBtn").click(function(){
		studentIdArry.splice(0,studentIdArry.length);
		for(var i=0;i<$("em.checkChild.select").length;i++){
			studentIdArry.push($("em.checkChild").parent().parent().eq(i).attr('id'));
		}
		$(".mesDialog").show();
	});
	//点击弹出框里的发送按钮
	$("#mesSubmit").click(function(){
		var mesTextarea = $("#mesTextarea").val();
		var userid = $("#teacherId").val();
		var senduserid = '';
		var mes =new Array();
		if(ws != null && mesTextarea != '') {
			for(var i=0;i<studentIdArry.length;i++){
				senduserid=studentIdArry[i];
				var text = {
					"userid": "t"+userid,
					"senduserid": "u"+senduserid,
					"textMessage": mesTextarea,
					"sendtype":1
				};
				mes.push(text);
			}
			ws.send(JSON.stringify(mes));
		}
		$("#mesTextarea").val('');
		$(".mesDialog").hide();
		
		$(".sendBtn").hide();
		$(".checkAll").removeClass('select');
		$(".checkChild").removeClass('select');
	});
	//点击关闭1，关闭弹出层
	/*$('#close1').click(function(){
		$(".imgDialog").hide();
		$(".imgBox").css({
			'height':'600px',
			'margin-top':'-300px'
		});
		$("#imgPic").attr('src','');
		$(".imgPic").css('height','600px');
	});*/
});
//获取班级列表函数
function classList(teacherid){
	var S= new Store();
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getClassByTeacher.action",
		async: false,
		data: {
			'teacherid': teacherid
		},
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			$.each(data, function(i,item) {
				var html='';
	
				if(item.notReadCount != 0){
					html +='<li data-classid="'+item.classid+'" class="chatLi">'
					 +'<img src="'+item.topimageurl+'"/>'
					 +'<div>'
					 +'<p>班级名称：<b>'+item.rname+'</b></p>'
					 +'<p>班级序号：<b>'+item.classid+'</b><em class="checkAll unselect"></em></p>'
					 +'</div>'
					 +'<span class="teacherSign">'+item.notReadCount+'</span>'
					 +'<ul class="chatList grade'+i+' none">'
					 +'</ul>'
					 +'</li>';
					 	
				}else{
					html +='<li data-classid="'+item.classid+'" class="chatLi">'
					 +'<img src="'+item.topimageurl+'"/>'
					 +'<div>'
					 +'<p>班级名称：<b>'+item.rname+'</b></p>'
					 +'<p>班级序号：<b>'+item.classid+'</b><em class="checkAll unselect"></em></p>'
					 +'</div>'
					 +'<span class="teacherSign none">'+item.notReadCount+'</span>'
					 +'<ul class="chatList grade'+i+' none">'
					 +'</ul>'
					 +'</li>';
				}
				$(".classList").append(html);
				
				//学生信息
				var childHtml='';
				studentList(teacherid,item.classid);
				var studentData = JSON.parse(S.get('studentData'));
				for(var j=0;j<studentData.length;j++){
					if(studentData[j].notReadCount!=0){
						var stuAvatar = studentData[j].topimageurl;
						if(stuAvatar==''){
							stuAvatar = './images/user.jpg'
						}
						childHtml+='<li id="'+studentData[j].userid+'">'
						 +'<div class="chatPhoto">'
						 +'<img src="'+stuAvatar+'"/>'
						 +'<span class="studentSign">'+studentData[j].notReadCount+'</span>'
						 +'</div>'
						 +'<div class="chatInfo">'
						 +'<div class="chatNote">'
						 +'<b>'+studentData[j].rname+'</b>'
						 +'<em>'+studentData[j].opertime+'</em>'
						 +'</div>'
						 +'<div class="chatMes">'+studentData[j].cont+'</div><em class="checkChild unselect"></em>'
						 +'</div>'
						 +'</li>'	
					}else{
						var stuAvatar = studentData[j].topimageurl;
						if(stuAvatar==''){
							stuAvatar = './images/user.jpg'
						}
						childHtml+='<li id="'+studentData[j].userid+'">'
						 +'<div class="chatPhoto">'
						 +'<img src="'+stuAvatar+'"/>'
						 +'<span class="studentSign none">'+studentData[j].notReadCount+'</span>'
						 +'</div>'
						 +'<div class="chatInfo">'
						 +'<div class="chatNote">'
						 +'<b>'+studentData[j].rname+'</b>'
						 +'<em>'+studentData[j].opertime+'</em>'
						 +'</div>'
						 +'<div class="chatMes">'+studentData[j].cont+'</div><em class="checkChild unselect"></em>'
						 +'</div>'
						 +'</li>'
					}
					
				}
				$('.grade'+i+'').html(childHtml);
			});
		}
	});
}
//获取学员列表函数
function studentList(teacherid,classid){
	var S=new Store();
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getUserByClass.action",
		async: false,
		data: {
			'teacherid': teacherid,
			'classid': classid
		},
		success: function(data) {
			S.set('studentData',data);
		}
	});
}

//获取聊天内容函数
function chatList(senduserid,recuserid){
	var html='';
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getMsgPage.action",
		async: false,
		data: {
			'page': 1,
			'limit':5,
			'senduserid':senduserid,
			'recuserid':recuserid,
			'sendusertype':2,
			'time':time
		},
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			$.each(data, function(i,item) {
				if(item.sendusertype==1){
					html +='<li>'
					 +'<div class="chatImg">'
					 +'<img src="'+$("#studentPhoto").val()+'"/>'
					 +'</div><div class="corner"></div>'
					 +'<div class="chatContent">'+item.cont+'</div>'
					 +'</li>'
				}else{
					html +='<li class="my">'
					 +'<div class="chatImg">'
					 +'<img src="'+$("#teacherPhoto").val()+'"/>'
					 +'</div><div class="cornermy"></div>'
					 +'<div class="chatContent">'+item.cont+'</div>'
					 +'</li>'
				}
				
				if(i==0){
					time=formatDateTime(item.opertime);
					//alert("第一条数据时间："+time);
				}
			});
			if(flag==0){
				$(".chatDialog").html(html);
			}else{
				$(".chatDialog").prepend(html);
			}
		}
	});
}
//获取聊天内容状态函数
function setMsgRead(senduserid,recuserid){
	$.ajax({
		type: "post",
		url: url + "/wsmessage/setMsgRead.action",
		async: false,
		data: {
			'senduserid':senduserid,
			'recuserid':recuserid,
			'sendusertype':2
		},
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
		}
	});
}
//获取教师的信息函数
function getTeacherInfo(teacherid){
	$.ajax({
		type: "post",
		url: url + "/teacher/getTeacherInfo.action",
		async: false,
		data: {
			'teacherid':teacherid
		},
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			$("#teacherPhoto").val(data.topimageurl);
			$("#teacherName").val(data.teachername);
		}
	});
}
//获取班ID的函数
var classArray=new Array();
function getClassByTeacherUser(teacherid,userid){
	$.ajax({
		type: "post",
		url: url + "/wsmessage/getClassByTeacherUser.action",
		async: false,
		data: {
			'teacherid':teacherid,
			'userid':userid
		},
		success: function(data) {
			data = JSON.parse(data);
			classArray.push(data);
			//console.log(data);
		}
	});
}
function getLoginID() {
	$.ajax({
		type: "get",
		url: url + "/login/getLoginID.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			$("#teacherId").val(data);
		}
	});
}
//var ws = new WebSocket("ws://10.1.70.11:8080/ws/websocket");
var ws = new WebSocket("ws://39.106.112.14/ws/websocket");
ws.onopen = function() {
	login();
};
ws.onmessage = function(evt) {
	var ms = JSON.parse(evt.data);
	//console.log(ms);
	var msTime=getNowFormatDate();
	var msUserid="u"+$("#studentId").val();
	if($("#chatDetail").css('display')=='block' && msUserid==ms.userid){
		var html = '<li><div class="chatImg"><img src="'+$("#studentPhoto").val()+'"/></div><div class="chatContent">'+ms.msg+'</div></li>';
		$('.chatDialog').append(html);
	}else{
		for(var i=0;i<$(".chatList li").length;i++){
			if(Number($(".chatList li").eq(i).attr('id'))==Number(ms.userid.replace("u",""))){
				$(".chatList li").eq(i).find('span.studentSign').show().text(Number($(".chatList li").eq(i).find('span.studentSign').text())+1);
				$(".chatList li").eq(i).find('.chatMes').text(ms.msg);
				$(".chatList li").eq(i).find('em').text(msTime);
			}
		}
		
		getClassByTeacherUser(1,ms.userid.replace("u",""));
		for(var j=0;j<$("#chatClass li.chatLi").length;j++){
			if(Number($("#chatClass li.chatLi").eq(j).attr('data-classid'))==Number(classArray[0])){
				$("#chatClass li.chatLi").eq(j).find('span.teacherSign').show().text(Number($("#chatClass li.chatLi").eq(j).find('span.teacherSign').text())+1);
			}
			
		}
	}
};
ws.onclose = function(evt) {
	//alert("WebSocketClosed!");
};
ws.onerror = function(evt) {
	//alert(evt);
};

function login() {
	var userid = $("#teacherId").val();
	//userid=1;
	if(ws != null && userid != '') {
		var login = {
			"userid": 't'+userid,
			"type": "loginWS"
		};
		ws.send(JSON.stringify(login));
	}
}
//发送消息函数
function sendMyMessage() {
	var S = new Store();
	var chatTextarea = $("#chatTextarea").val();
//	var userid = $("#teacherId").val();
	var userid = S.get('userid');
	var senduserid = $("#studentId").val();
	var html='';
	if(ws != null && chatTextarea != '') {
		var text = [{
			"userid": "t"+userid,
			"senduserid": "u"+senduserid,
			"textMessage": chatTextarea,
			"sendtype":1
		}];
		html= '<li class="my"><div class="chatImg"><img src="'+$("#teacherPhoto").val()+'"/></div><div class="cornermy"></div><div class="chatContent">'+chatTextarea+'</div></li>';
		$('.chatDialog').append(html);
		$("#chatTextarea").val('');
		
		ws.send(JSON.stringify(text));
	}
}
//发送图片函数
/*function previewImage(file){
	//验证上传文件的格式，图片格式验证
	var File = document.getElementById("uploadFile");
	var i = File.value.lastIndexOf('.');
	var len = File.value.length;
	var extEndName = File.value.substring(i + 1, len);
	var extName = "GIF,BMP,JPG,JPEG,PNG"; //首先对格式进行验证
	var html='';
	
	if(extName.indexOf(extEndName.toUpperCase()) == -1) {
		alert('上传文件格式错误');
		return false;
	};
	
	
	if(file.files && file.files[0]) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			html='<li class="my"><div class="chatImg"><img src="user.jpg"/></div><div class="cornermy"></div><div class="chatContent"><img src="'+evt.target.result+'" onclick="showImg(this)"/></div></li>';
			$('.chatDialog').append(html);
		}
		reader.readAsDataURL(file.files[0]);
	}
}
//显示图片函数
function showImg(img){
	$(".imgDialog").show();
	$("#imgPic").attr('src',img.src);
	if($("#imgPic").height()>560){
		var heightOld=Number($(".imgBox").css('height').substring(0,$(".imgBox").css('height').indexOf('px')));
		var heightNew=heightOld+Number($("#imgPic").height()-560);
		$(".imgBox").css({
			'height':heightNew+'px',
			'margin-top':heightNew*(-1)/2+'px'
		});
		$(".imgPic").css('height',heightNew+'px');
	}
	$("#imgPic").css({
		'margin-top':$("#imgPic").height()*(-1)/2+'px',
		'margin-left':$("#imgPic").width()*(-1)/2+'px'
	});
}*/
//获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    /*if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }*/
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
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
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    
};   
