$(function() {
	$('.header_box').load('header.html', function() {
		//		展示专区动画
		$('#showMenu').hover(function() {
			$('.menu').slideToggle();
		});
	});
});