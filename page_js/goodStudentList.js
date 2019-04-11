$(function() {
	$('.header_box').load('header.html', function() {
		main();
	});
	var totalRecords = getTotal();
	var limit = 10;
	totalPage = parseFloat(totalRecords / limit);
	if(parseInt(totalPage) - parseFloat(totalPage) == 0) {
		totalPage = totalPage;
	} else {
		totalPage = parseInt(totalPage + 1);
	}
	page(totalPage, totalRecords);
	studentList(1, 10);
});
//生成分页
function page(totalPage, totalRecords) {
	kkpager.generPageHtml({
		//总页码
		total: totalPage,
		//总数据条数
		totalRecords: totalRecords,
		mode: 'click', //默认值是link，可选link或者click
		click: function(n) {
			studentList(n, 10);
			// do something
			//手动选中按钮
			this.selectPage(n);
			return false;
		}
	});
}
//获取优秀学员总记录数
function getTotal() {
	$.ajax({
		type: "post",
		url: url + "/goodstudents/getPageGoodStudentsCount.action",
		async: false,
		success: function(data) {
			console.log(data);
			return data;
		}
	});
}
//获取优秀学员数据
function studentList(page, limit) {
	var sHtml = '';
	$.ajax({
		type: "post",
		url: url + "/goodstudents/getPageGoodStudentsPage.action",
		async: false,
		data: {
			page: page,
			limit: limit
		},
		success: function(data) {
			data = JSON.parse(data);
			console.log(data);
			$.each(data, function(i, item) {
				sHtml += '<li>' +
					'<a href="goodStudent_detail.html?id=' + item[0] + '">' +
					'<img src="' + item[5] + '">' +
					'<h2>' + item[1] + '</h2>' +
					'</a>' +
					'</li>'
			});
			$('.ex_student>ul').html(sHtml);
		}
	});
}