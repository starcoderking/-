$(function() {
	$('.header_box').load('header.html', function() {
		navText('活动专区');
//		展示专区动画
		$('#showMenu').hover(function() {
			$('.menu').slideToggle();
		});
	});
//	临时点击事件
	$('ul li .right button').click(function(){
		location.href="course_detail.html";
	})
//	结束
});