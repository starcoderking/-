$(function() {
	$('.header_box').load('header.html', function() {
		//      main();
		
		//菜单滑动下拉
		$('#showMenu').hover(function(){
			$('.menu').slideToggle();
		});
	});
	$('.teacherBg').Tabs({
		auto:3000
	});
});