$(function() {
	$('.header_box').load('header.html', function() {
		main();
		navText('展示专区');
//		//菜单滑动下拉
//		$('#showMenu').hover(function(){
//			$('.menu').slideToggle();
//		});
	});
});