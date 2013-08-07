// JavaScript Document

	Cufon.replace('h1, p', {fontFamily: 'Angelic War', hover: true
});
	

 $(document).ready( function () {
	 
	 $('h1 span').hover(function(){
		 $(this).addClass("blue");
		 Cufon.replace(this, {fontFamily: 'Angelic War', hover: true});
	 });
	 $('h1').mouseout(function(){
		 $('h1 span').removeClass("blue");
		 Cufon.replace('h1', {fontFamily: 'Angelic War', hover: true});
	 });
	 
 });