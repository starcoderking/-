$(function() {
	$('.footer').load('footer.html',function(){
		main();
		navText('展示');
	});
	init();
});
function init() {
	var S = new Store();
	var I = new Interfaces();
//	新闻资讯
	var news_data = JSON.parse(I.query_news());
	var newHtml = '';
	if(news_data.length < 4) {
		$('.new_more').hide();
		for(var i = 0; i < news_data.length; i++) {
			var createtime = news_data[i].createtime;
			if(createtime==null){
				createtime='';
			}
			newHtml += '<li data-id="' + news_data[i].newsid + '">' +
				'<a href="news-detail.html?newsid='+news_data[i].newsid+'">' +
				'<div>' + news_data[i].newsname + '</div>' +
				'<em>' + createtime + '</em>' +
				'</a>' +
				'</li>'
		}
	} else {
		for(var i = 0; i < 4; i++) {
			var createtime = news_data[i].createtime;
			if(createtime==null){
				createtime='';
			}
			newHtml += '<li data-id="' + news_data[i].newsid + '">' +
				'<a href="news-detail.html?newsid='+news_data[i].newsid+'">' +
				'<div>' + news_data[i].newsname + '</div>' +
				'<em>' + createtime + '</em>' +
				'</a>' +
				'</li>'
		}
	}
	$('.news').html(newHtml);
//	明星教师
	var teacher_data = JSON.parse(I.query_teacher_list(1));
	var teacherHtml = '';
	for(var i=0;i<3;i++){
		teacherHtml+='<li>'
				+'<a href="teacher-detail.html?teacherid='+teacher_data[i].teacherid+'">'
				+'<img src="'+teacher_data[i].topimageurl+'"/>'
				+'<span>'+teacher_data[i].teachername+'</span>'
				+'</a>'
				+'</li>'
	}
	$('.teacher').html(teacherHtml);
//	优秀学员
	var student_data = JSON.parse(I.query_excellent_student());
	var studentHtml = '';
	for(var i=0;i<3;i++){
		studentHtml+='<li>'
			+'<a href="student-detail.html?studentid='+student_data[i].goodstudentsid+'">'
			+'<img src="'+student_data[i].indeximg+'" />'
			+'<span>'+student_data[i].goodstudentsname+'</span>'
			+'</a>'
			+'</li>'
	}
	$('.student').html(studentHtml);
}