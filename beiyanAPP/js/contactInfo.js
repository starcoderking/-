//Map实例 
var map;
map = new BMap.Map("allmap");
//第1步：设置地图中心点   
var point = new BMap.Point(117.24449,39.103374); //GPS坐标  
var marker = new BMap.Marker(point);  // 创建标注
map.addOverlay(marker);              // 将标注添加到地图中
//第2步：初始化地图,设置中心点坐标和地图级别。    
map.centerAndZoom(point,18);
//第3步：启用滚轮放大缩小    
map.enableScrollWheelZoom(true);
//第4步：向地图中添加缩放控件    
var ctrlNav = new window.BMap.NavigationControl({
	anchor: BMAP_ANCHOR_TOP_LEFT,
	type: BMAP_NAVIGATION_CONTROL_LARGE
});
map.addControl(ctrlNav);
var sContent ="北方演艺集团艺术教育中心";
var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
map.openInfoWindow(infoWindow,point); //开启信息窗口
$(function(){
	//contactWay()
});
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
				$('.infoBg').html(data.infocontent);
			}
		}
	});
}