$(document).ready(function(){
	$('#navigation ul li').eq($('#navigation ul li.active').index()-1).css('background','none');
	$('.offer-section .offerbox:nth-child(3n)').addClass('last');
	$('#navigation ul li:last').addClass('last');
	$('.subnavigationInner ul li:first-child').addClass('first');
	$('.subnavigationInner ul li:last').addClass('last');
		if($('.subnavigationInner li.last').hasClass('active'))
	{
		$('#subnavigation').addClass('no-shadow');
	}
	$('.subnavigationInner li').eq($('.subnavigationInner li.active').index()-1).css('background','none');
	$('.image-box:last').addClass('last');
	var totalli=$('#navigation li').size();
	var revcnt =totalli;
	for(var i=0; i<totalli; i++)
	{
		$('#navigation li').eq(i).css('z-index',revcnt--);
	}
	$('#navigation li').hover(function(){
		$('#navigation li').eq($(this).index()-1).css('background','none');
	},function(){
		$('#navigation li').eq($(this).index()-1).css('background','url("img/bgi/nav-divider.png") no-repeat right 10px');
	});
	$('#navigation li.active').hover(function(){
		$('#navigation li').eq($(this).index()-1).css('background','none');})
	$('.deposez').click(function(){
		$('#popup, .fade').show();
	});
	$('.fade, .close').click(function(){
		$('#popup, .fade').hide();
	});
	
	$('form#application input').focus(function(){
		$(this).addClass('selected');
	});
	$('form#application input').blur(function(){
		$(this).removeClass('selected');
	});
	
});