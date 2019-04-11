var n=1;
$(function() {
	$(".selecteMenu li span").click(function(){
		$(this).siblings('ul').toggleClass('none');
	});
	//centerList();
	teacherList(n);
	event();
})
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
	setTimeout(function() {
		var el, li, i;
		el = document.getElementById('thelist');
		$('#thelist').html('');
		n=1;
		teacherList(n);
		document.getElementById("pullUp").style.display = "";
		myScroll.refresh();
	}, 1000);
}

function pullUpAction() {
	setTimeout(function() {
		var el, li, i;
		el = document.getElementById('thelist');
		n+=1;
		teacherList(n);
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
			if(pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			}
			if(pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}

			document.getElementById("pullUp").style.display = "none";
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
				pullDownAction(); 
			}
			if(pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				if(loadFlag==false){
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '没有更多数据了...';
				}else{
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				}
				pullUpAction();
			}
		}
	});
}
//点击事件
function event(){
	$('.menuBg').on('click','li',function(){
		var centerid = $(this).attr('data-id');
		var centerName = $(this).text();
		$('.selecteMenu>ul span').text(centerName).attr('data-id',centerid);
		$(this).parents('.menuBg').addClass('none');
	})
}
//获取筛选器中心列表
function centerList(){
	var cHtml = '';
	$.ajax({
		type:"post",
		url:url+"/specialty/getPageSonSpecialty.action",
		async:false,
		data:{parentid:1,showstate:1},
		success:function(data){
			data = JSON.parse(data);
			$.each(data, function(i,item) {
				cHtml+='<li data-id="'+item.specialtyid+'">'+item.specialtyname+'<li/>'
			});
			$('.menuBg').html(cHtml);
		}
	});
}
//教师列表
function teacherList(page){
	var tHtml='';
	$.ajax({
		type:"post",
		url:url+"/teacher/getTeacherPageByFrontEnd.action",
		async:false,
		data:{page:page,limit:5},
		success:function(data){
			if(data!=null && data!=undefined){
				data = JSON.parse(data);
				for(var i=0;i<data.length;i++){
					var cont = data[i].cont;
					if(cont=='null' || cont==undefined){
						cont = '';
					}else{
						if(cont.length>=50){
							cont = cont.substring(0, 50)+'...';
						}else{
							cont = cont.substring(0, 50);
						}
					}
					tHtml+='<li>'
						+'<a href="teacher-detail.html?teacherid='+data[i].teacherid+'">'
						+'<img src="'+data[i].topimageurl+'" />'
						+'<div class="teacher-intro">'
						+'<h3>'+data[i].teachername+'</h3>'
						+'<p><i class="iconfont icon-biaoqian"></i>'
						+'<b>'+data[i].teachertype+'</b>'
						+'</p>'
						+'<div class="des">'+cont+'</div>'
						+'</div>'
						+'</a>'
						+'</li>'
				}
				$('#thelist').append(tHtml);
			}else{
				loadFlag = false;
			}
		}
	});
}