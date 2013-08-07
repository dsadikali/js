function bgstretch(){
	var winW = $(window).width();
	var winH = $(window).height();
	var initW = 700, initH = 440;
	var imgW,imgH;
	var ratio = initH / initW;
		
	imgW = winW;
	imgH = winW * ratio;
	
	if(imgH < winH){
		imgH = winH;
		imgW = imgH / ratio;
	}
	$('.bgstretch-img').css({width:imgW,height:imgH});
}