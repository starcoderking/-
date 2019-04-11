$(function() {
	$('.header_box').load('header.html', function() {
		main();
		navText('中心简介');
	});
	/*$('.teacherBg').Tabs({
		auto:3000
	});*/
	centerIntro();//中心简介
	honorShow();//荣誉展示
	education();//教育环境展示
	contactWay();//联系方式
	
	starTeacherNav(1);
	starTeacher(2);//添加明星教师列表
	centerInfo(5);
	//  明星教师显示
	$('.tab_menu li').hover(function() {
		$(this).addClass('current').siblings().removeClass('current');
		var i = $(this).attr('data-id');
		var j = $(this).attr('data-newid');
		starTeacher(i);
		centerInfo(j);
	});
	initMap();//初始化地图
});
//中心简介
function centerIntro(){
	$.ajax({
		type:"post",
		url:url+"/sysinformation/getContByidShowByFrontEnd.action",
		async:false,
		data:{id:1},
		success:function(data){
			data = JSON.parse(data);
			if(data.infocontent!=''&&data.infocontent!=undefined){
				$('.companyBg').html(data.infocontent);
			}
		}
	});
}
//荣誉展示
function honorShow(){
	var hHtml='';
	$.ajax({
		type:"get",
		url:url+"/grades/getGradesTopFive.action",
		async:false,
		success:function(data){
			data = JSON.parse(data);
			if(data.length>=5){
				$('.honor_list>a').show();
			}else{
				$('.honor_list>a').hide();
			}
			$.each(data, function(i,item) {
				hHtml+='<a href="honor_detail.html?id='+item[0]+'">'
					+'<li>'
					+'<div class="honor_img"><img src="'+item[2]+'"></div>'
					+'<div class="honor_name">'+item[1]+'</div>'
					+'<div class="honor_more">了解详情>></div>'
					+'</li>'
					+'</a>'
			});
			$('.honor_list>ul').html(hHtml);
		}
	});
}
//教育环境展示
function education(){
	$.ajax({
		type:"post",
		url:url+"/sysinformation/getContByidShowByFrontEnd.action",
		async:false,
		data:{id:3},
		success:function(data){
			data = JSON.parse(data);
			if(data.infocontent!=''&&data.infocontent!=undefined){
				$('.education_center').html(data.infocontent);
			}
		}
	});
}
//联系方式
function contactWay(){
	$.ajax({
		type:"post",
		url:url+"/sysinformation/getContByidShowByFrontEnd.action",
		async:false,
		data:{id:2},
		success:function(data){
			data = JSON.parse(data);
			console.log(data.infocontent);
			if(data.infocontent!=''&&data.infocontent!=undefined){
				$('.about_contact').html(data.infocontent);
			}
		}
	});
}



//明星教师
function starTeacherNav(id){
	var nHtml='';
	$.ajax({
		type:"post",
		url:url+"/specialty/getPageSonSpecialty.action",
		async:false,
		data:{parentid:id},
		success:function(data){
			data=JSON.parse(data);
			$.each(data, function(i,item) {
				if(i<6&&i==0){
					nHtml+='<li class="current" data-id="'+item.specialtyid+'" data-newid="'+(Number(item.specialtyid)+3)+'">'+item.specialtyname+'</li>'
				}else if(i<6){
					nHtml+='<li data-id="'+item.specialtyid+'" data-newid="'+(Number(item.specialtyid)+3)+'">'+item.specialtyname+'</li>'
				}else{
					return false;
				}
			});
			$('.tab_menu').html(nHtml);
		}
	});
}
function starTeacher(index){
	var tHtml='';
	$.ajax({
		type:"post",
		url:url+"/teacher/getTeacher.action",
		async:false,
		data:{parentid:index},
		success:function(data){
			data=JSON.parse(data);
			//console.log(data);
			$.each(data, function(i,item) {
				tHtml+='<li>'
					+'<a href="teacher_detail.html?id='+item.teacherid+'">'
					+'<div class="teacherImg"><img src="'+item.topimageurl+'"/></div>'
					+'<div class="teacherName">'+item.teachername+'</div>'
					+'</a>'
					+'</li>'
			});
			$('.teacherList>ul').html(tHtml);
		}
	});
}
function centerInfo(index){
	var tHtml='';
	$.ajax({
		type:"post",
		url:url+"/sysinformation/getContByidShowByFrontEnd.action",
		async:false,
		data:{id:index},
		success:function(data){
			data=JSON.parse(data);
			$('.teacherMes').html(data.infocontent);
		}
	});
}
//创建和初始化地图函数：
function initMap(){
    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件
    address();
}
//创建地图函数：
function createMap(){
    var map = new BMap.Map("mapContent");//在百度地图容器中创建一个地图
    var point = new BMap.Point(117.244386,39.103364);//定义一个中心点坐标
    map.centerAndZoom(point,17);//设定地图的中心点和坐标并将地图显示在地图容器中
    window.map = map;//将map变量存储在全局
}
//地图事件设置函数：
function setMapEvent(){
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}
//地图控件添加函数：
function addMapControl(){
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(ctrl_nav);
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
    map.addControl(ctrl_sca);
}
function address(){
    var p = new BMap.Point(117.244386,39.103364);
    //添加地图覆盖物
    //map.addOverlay(new BMap.Marker(p));
    var sword = new BMap.Icon('./img/address.png', new BMap.Size(30,50));
    var marker = new BMap.Marker(p, {icon: sword});
    map.addOverlay(marker);
    //marker.setAnimation(BMAP_ANIMATION_BOUNCE);
}
