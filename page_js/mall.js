$(function() {
	$('.header_box').load('header.html', function() {
		navText('商 城');
		//		展示专区动画
		$('#showMenu').hover(function() {
			$('.menu').slideToggle();
		});
	});
})