$(function() {
	$('.footer').load('footer.html',function(){
		main();
		navText('首页');
	});
	banner();
	navBar();
	courseRec(); 
	event();
});

function event(){
	$('.titleName').on("click",'span',function(e){
		location.href='course-recommend.html';
		return false;
	});
}
//轮播图列表
function banner() {
	var lHtml = '';
	$.ajax({
		type: "GET",
		url: url + "/pictureshow/getPictureShow.action",
		async: false,
		success: function(data) {
//			alert(data);
			data = JSON.parse(data);
			//console.log(data);
			$.each(data, function(i, item) {
				if(item.typenum==1){
					lHtml += '<div class="swiper-slide">'
				      +  '<a href="banner-detail.html?id=' + item.id + '" class="link">'
				      +  '<img src="'+ item.url +'" />'
				      +  '</a></div>'
				}else{
					lHtml += '<div class="swiper-slide">'
				      +  '<a href="'+item.weburl+'" class="link">'
				      +  '<img src="'+ item.url +'" />'
				      +  '</a></div>'
				}
			});
			$('#banner').html(lHtml);
		}
	});
	//轮播图启用
	var swiper = new Swiper('.swiper-container', {
	    pagination: '.swiper-pagination',
	    paginationClickable: true
	});
}
//轮播图下边的中心按钮
function navBar() {
	var nHtml = '';
	var str,substr;
	$.ajax({
		type: "get",
		url: url + "/specialty/getPageSpecialtyList.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			navArr = data;
			$.each(navArr, function(i, item) {
				if(item.curdegree == 2 && navArr != '' && navArr != undefined) {
					str=item.specialtyname;
					substr=str.substr(0,str.length-2);
					if(item.specialtyid == 2) {
						nHtml += '<a href="center_course.html?centerid='+item.specialtyid+'&newid='+(Number(item.specialtyid)+3)+'" data-id="' + item.specialtyid + '"><li>'
						      +  '<div class="menuBgs menu01"><i class="iconfont icon-xiganqiaochenfufc9702"></i></div>'
						      +  '<div class="menuTitle">'+ substr +'</div>'
						      +  '</li></a>'
					} else if(item.specialtyid == 3) {
						nHtml += '<a href="center_course.html?centerid='+item.specialtyid+'&newid='+(Number(item.specialtyid)+3)+'" data-id="' + item.specialtyid + '"><li>'
						      +  '<div class="menuBgs menu02"><i class="iconfont icon-gangqin"></i></div>'
						      +  '<div class="menuTitle">'+ substr +'</div>'
						      +  '</li></a>'
					} else if(item.specialtyid == 4) {
						nHtml += '<a href="center_course.html?centerid='+item.specialtyid+'&newid='+(Number(item.specialtyid)+3)+'" data-id="' + item.specialtyid + '"><li>'
						      +  '<div class="menuBgs menu03"><i class="iconfont icon-xiqu"></i></div>'
						      +  '<div class="menuTitle">'+ substr +'</div>'
						      +  '</li></a>'
					} else if(item.specialtyid == 5) {
						nHtml += '<a href="center_course.html?centerid='+item.specialtyid+'&newid='+(Number(item.specialtyid)+3)+'" data-id="' + item.specialtyid + '"><li>'
						      +  '<div class="menuBgs menu04"><i class="iconfont icon-quyizatan"></i></div>'
						      +  '<div class="menuTitle">'+ substr +'</div>'
						      +  '</li></a>'
					} else if(item.specialtyid == 6) {
						nHtml += '<a href="center_course.html?centerid='+item.specialtyid+'&newid='+(Number(item.specialtyid)+3)+'" data-id="' + item.specialtyid + '"><li>'
						      +  '<div class="menuBgs menu05"><i class="iconfont icon-wudao"></i></div>'
						      +  '<div class="menuTitle">'+ substr +'</div>'
						      +  '</li></a>'
					} else if(item.specialtyid == 7) {
						nHtml += '<a href="center_course.html?centerid='+item.specialtyid+'&newid='+(Number(item.specialtyid)+3)+'" data-id="' + item.specialtyid + '"><li>'
						      +  '<div class="menuBgs menu06"><i class="iconfont icon-yishuquan2"></i></div>'
						      +  '<div class="menuTitle">'+ substr +'</div>'
						      +  '</li></a>'
					}
				}
			});
			$('.menu').html(nHtml);
		}
	});
}

//课程推荐
function courseRec() {
	var cHtml = '';
	var minNum;
	var maxNum;
	var stateHtml;
	$.ajax({
		type: "get",
		url: url + "/course/getIndexCourseList.action",
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			//console.log(data);
			if(data != '' && data != undefined) {
				$.each(data, function(i, item) {
					var price = parseFloat(item[11] / 100);
					var startTime = item[3];//开课时间
					if(startTime==''||startTime==null){
						startTime = '待教务老师通知';
					}
					minNum = Number(item[8]);
					maxNum = Number(item[9]);
					var proportion = minNum/maxNum;
					if(proportion <= 0.3&&proportion>=0) {
						stateHtml = '<b class="state01">余'+(maxNum-minNum)+'</b>'
					} else if(proportion < 0.6 && proportion > 0.3) {
						stateHtml = '<b class="state02">余'+(maxNum-minNum)+'</b>'
					} else if(proportion >= 0.6 && proportion<1){
						stateHtml = '<b class="state03"><em class="icon iconfont icon-huo"></em>余'+(maxNum-minNum)+'</b>'
					}else{
						stateHtml = '<b class="state04">已满</b>'
					}
					if(i < 4) {
						cHtml += '<a href="course-detail.html?id=' + item[0] + '">'
						      +  '<li>'
						      +  '<div class="courseImg"><img src="' + item[2] + '" /></div>'
						      +  stateHtml
						      +  '<h4>' + item[1] + '</h4>'
						      +  '<p>开课时间:<span>' + startTime + '</span></p>'
						      +  '<div><i class="iconfont icon-tianjiaren"></i>'
						      +  '<span class="people-number">'+maxNum+'人</span>'
						      +  '<font>￥<em>'+ price +'</em></font></div>'
						      +  '</li>'
						      +  '</a>'
					} else {
						return false;
					}
				});
				$('.course ul').html(cHtml);
			}
		}
	});
}