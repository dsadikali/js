// JavaScript Document
var noofpage, /*Number of group to show per page (i.e 3)*/ 
pagerem, 
totalparent, 
pageno,
pagegroup, /*How many bunch of 3*/
totalbox;
function create_pagination(pagecnt){
	pageno=pagecnt; /*Number of pages to show per page*/
	noofpage = pagecnt/4;  
	pagegroup=noofpage;
	
	totalparent = $('.offer-section').size();
	totalbox=$('.offerbox ').size();
	$('.articleNums').html(totalbox+' Artikel Gefunden');
	pagecnt = Math.floor( totalparent/noofpage );
	pagerem = $('.offer-section').size()%noofpage ;
	
	if(pagerem>0)
		pagecnt++;
	var paginationdata=''
	
	for(var i=1; i<=pagecnt; i++)
		paginationdata+='<li><a href="javascript:create_pages('+(i-1)+');"><span>'+i+'</span></a></li>';
	$('.pagination').html(paginationdata);
	create_pages(0);
}

function create_pages(cnt){
	$('.pagination li').removeClass('show');
	for(var i=cnt; i<=cnt+2; i++)
		$('.pagination li').eq(i).addClass('show');
		if($('.pagination li.show').index()+3>=totalparent)
		{
			$('.pagination li').eq(totalparent-3).addClass('show');
			$('.pagination li').eq(totalparent-2).addClass('show');
			$('.nextdots').hide();
		}
		else{$('.nextdots').show();}
		if($('.pagination li.show').index()==0)
		{
			$('.prevdots').hide();
		}else{
			$('.prevdots').show();
		}
			
		
	var goon =noofpage*cnt;
	
	$('.offerbox:first-child').addClass('first');

	$('.pagination li').removeClass('active');
	$('.bottompagination .pagination li').eq(cnt).addClass('active');
	$('.pagination li').eq(cnt++).addClass('active');

	if($('.pagination li:last-child').hasClass('active'))
		$('.nextPage, .dots').css('display','none');
	else
		$('.nextPage, .dots').css('display','block');
	if($('.pagination li:first-child').hasClass('active'))
		$('.prevPage').css('display','none');
	else
		$('.prevPage').css('display','block');
	if(pagegroup==1)
		var post_per_page=2;
	else
		var post_per_page=5;
		
	$('.offer-section').removeClass('active');
	$('.offer-section').eq(goon).addClass('active');
	
}
function next_prev(flag){
	var curpage = parseInt($('.bottompagination .pagination li.active a span').text());
	for(var i=curpage; i<=curpage+2; i++)
		$('.pagination li').eq(i).addClass('show');
	curpage=curpage+flag;
	create_pages(curpage);
}
$(document).ready(function(){
	$('.offerbox :last-child').addClass('last');
	create_pagination(4);
	$('.itemPerPage dd').click(function(){
		$('.itemPerPage dd').removeClass('active');
		$(this).addClass('active');
		if($(this).text()=='All'){
			$('.offer-section').addClass('active');
			$('.paginationOuter').hide();
		}else{
			create_pagination($(this).text());
			$('.paginationOuter').show();
		}
	});
	$('.nextPage, .dots').click(function(){
		next_prev(0);
	});
	$('.prevPage').click(function(){
		next_prev(-2);
	});
});