var n = 1;
$(function() {
	studentList(n);
});
var loadFlag = true;
document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	document.addEventListener('DOMContentLoaded', function() {
		setTimeout(loaded, 200);
	}, false);
var myScroll,
	pullDownEl,
	pullDownOffset,
	pullUpEl,
	pullUpOffset,
	generatedCount = 0;

function pullDownAction() {
	setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');
		$('#thelist').html('');
		n=1;
		studentList(n);
//		for(i = 0; i < 5; i++) {
//			li = document.createElement('li');
//			li.innerText = 'Generated row ' + (++generatedCount);
//			el.insertBefore(li, el.childNodes[0]);
//		}
		document.getElementById("pullUp").style.display = "";
		myScroll.refresh();
	}, 1000);
}

function pullUpAction() {
	setTimeout(function() {
		var el, li, i;
		el = document.getElementById('thelist');

//		for(i = 0; i < 1; i++) {
//			li = document.createElement('li');
//			li.innerText = 'Generated row ' + (++generatedCount);
//			el.appendChild(li, el.childNodes[0]);
//		}
		n+=1;
		studentList(n);
		myScroll.refresh();
	}, 1000);
}

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');
	pullUpOffset = 10;
	//pullUpOffset = pullUpEl.offsetHeight;
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function() {
			//that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
			//that.minScrollY = -that.options.topOffset || 0;
			//alert(this.wrapperH);
			//alert(this.scrollerH);
			if(pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			}
			if(pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}

			document.getElementById("pullUp").style.display = "none";
//			document.getElementById("show").innerHTML = "onRefresh: up[" + pullUpEl.className + "],down[" + pullDownEl.className + "],Y[" + this.y + "],maxScrollY[" + this.maxScrollY + "],minScrollY[" + this.minScrollY + "],scrollerH[" + this.scrollerH + "],wrapperH[" + this.wrapperH + "]";
		},
		onScrollMove: function() {
			document.getElementById("show").innerHTML = "onScrollMove: up[" + pullUpEl.className + "],down[" + pullDownEl.className + "],Y[" + this.y + "],maxScrollY[" + this.maxScrollY + "],minScrollY[" + this.minScrollY + "],scrollerH[" + this.scrollerH + "],wrapperH[" + this.wrapperH + "]";
			if(this.y > 0) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新...';
				this.minScrollY = 0;
			}
			if(this.y < 0 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				this.minScrollY = -pullDownOffset;
			}

			if(this.scrollerH < this.wrapperH && this.y < (this.minScrollY - pullUpOffset) || this.scrollerH > this.wrapperH && this.y < (this.maxScrollY - pullUpOffset)) {
				document.getElementById("pullUp").style.display = "";
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新...';
			}
			if(this.scrollerH < this.wrapperH && this.y > (this.minScrollY - pullUpOffset) && pullUpEl.className.match('flip') || this.scrollerH > this.wrapperH && this.y > (this.maxScrollY - pullUpOffset) && pullUpEl.className.match('flip')) {
				document.getElementById("pullUp").style.display = "none";
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		},
		onScrollEnd: function() {
			document.getElementById("show").innerHTML = "onScrollEnd: up[" + pullUpEl.className + "],down[" + pullDownEl.className + "],Y[" + this.y + "],maxScrollY[" + this.maxScrollY + "],minScrollY[" + this.minScrollY + "],scrollerH[" + this.scrollerH + "],wrapperH[" + this.wrapperH + "]";
			if(pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '刷新中...';
				pullDownAction(); // Execute custom function (ajax call?)
			}
			if(pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				if(loadFlag==false){
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '没有更多数据了...';
				}else{
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				}
				pullUpAction(); // Execute custom function (ajax call?)
			}
		}
	});

	//setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}
//获取优秀学员数据
function studentList(page) {
	var sHtml = '';
	$.ajax({
		type: "post",
		url: url + "/goodstudents/getPageGoodStudentsPage.action",
		async: false,
		data: {
			page: page,
			limit: 9
		},
		success: function(data) {
			data = JSON.parse(data);
			if(data == '') {
				loadFlag = false;
			} else {
				//console.log(data);
				$.each(data, function(i, item) {
					sHtml += '<li>' +
						'<a href="student-detail.html?studentid=' + item[0] + '">' +
						'<img src="' + item[5] + '">' +
						'<h3>' + item[1] + '</h3>' +
						'</a>' +
						'</li>'
				});
				$('#thelist').append(sHtml);
			}
		}
	});
}