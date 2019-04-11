$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	var nid=GetQueryString('nid');
	getNews(nid);
	courseRec();
});
//获取轮播图详情内容
function getNews(nid){
	$.ajax({
		type:"post",
		url:url+"/news/getPageNewsByid.action",
		async:false,
		data:{'nid':nid},
		success:function(data){
			data = JSON.parse(data);
			//console.log(data);
			if(data.createtime!=''&&data.createtime!=undefined){
				$('.details_time').html(data.createtime);
			}
			if(data.newsname!=''&&data.newsname!=undefined){
				$('.details_title').html(data.newsname);
			}
			if(data.newscontent!=''&&data.newscontent!=undefined){
				$('.details_mes').html(data.newscontent);
			}
		}
	});
}
//从url中获取参数值
 function GetQueryString(name){
　　 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　 var r = window.location.search.substr(1).match(reg);
　　 if(r!=null)return  unescape(r[2]); return null;
}
//课程推荐
function courseRec() {
	var cHtml = '';
	var minNum;
	var maxNum;
	var stateHtml;
	var random = ''; //随机数
	var arr = []; //随机数数组
	var courseNum='';
	$.ajax({
		type: "get",
		url: url + "/course/getIndexCourseList.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			if(data != '' && data != undefined) {
				var totalNum = data.length;
				if(totalNum>=3){
					courseNum=3;
				}else{
					courseNum = data.length;
				}
				for(var i = 0; i < courseNum; i++) {
					random = parseInt(totalNum * Math.random());
					var YN = isInArray(arr, random);
					if(YN) {
						courseNum+=1;
						cHtml+='';
					} else {
						arr.push(random);
						var price = parseFloat(data[random][11] / 100);
						var startTime = data[random][3];//开课时间
						if(startTime==''||startTime==null){
							startTime = '待教务老师通知';
						}
						minNum = Number(data[random][8]);
						maxNum = Number(data[random][9]);
						var proportion = minNum/maxNum;
						if(proportion <= 0.3&&proportion>=0) {
							stateHtml = '<b class="state01">余'+(maxNum-minNum)+'</b>'
						} else if(proportion < 0.6 && proportion > 0.3) {
							stateHtml = '<b class="state02">余'+(maxNum-minNum)+'</b>'
						} else if(proportion >= 0.6 && proportion<1){
							stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>余' + (maxNum-minNum) + '</b>'
						}else{
							stateHtml = '<b class="state04">已满</b>'
						}
						cHtml += '<li>' +
							'<a href="course_detail.html?id=' + data[random][0] + '">' +
							'<img src="' + data[random][2] + '">' +
							'<div class="course_info">' +
							'<div class="title">' + data[random][1] + '</div>' +
							'<div class="info">' +
							'<span title="' + startTime + '">开课时间:' + startTime + '</span><b><em>￥</em>' + price + '</b>' +
							'</div>' +
							'</div>' +
							stateHtml +
							'</a>' +
							'</li>'
					}

				}
				cHtml += '<li class="two_code">' +
					'<a>' +
					'<img src="./img/two_code1.jpg">' +
					'<div class="course_info">' +
					'<div class="title">关注我们获取更多</div>' +
					'</div>' +
					'</a>' +
					'</li>'
				$('.slidebar ul').html(cHtml);
			}
		}
	});
//	console.log(arr);
}
//数组验重函数
function isInArray(arr, value) {
	for(var i = 0; i < arr.length; i++) {
		if(value === arr[i]) {
			return true;
		}
	}
	return false;
}