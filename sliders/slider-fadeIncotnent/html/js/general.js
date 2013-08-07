// main js

$(document).ready(function(){
	
		
	 $("#nav li").hover(function() {
		 $(this).find("a").animate({opacity: "0"}, 1000);
		 $(this).find(".bullet").animate({opacity: "1"}, 1000);
		 },
		function() {
		  $(this).find("a").animate({opacity: "0.7"}, 1000);
		  $(this).find(".bullet").animate({opacity: "0"}, 1000);
		});
		
	 $("#nav-vertical li").hover(function() {
		$(this).find(".bullet").animate({opacity: "1"}, 1000);
		 },
		function() {
		  $(this).find(".bullet").animate({opacity: "0"}, 1000);
	 });
		
		
	/* $("#slider-home li.current").hover(function() {
		 $(this).find(".description").animate({opacity: "0.5"}, 1000);
		 },
		function() {
		  $(this).find(".description").animate({opacity: "0.7"}, 1000);
		 
		});*/
		
		//$(".description").animate({ opacity: '0' });
		
		/*$('#nav li').click(function() {
		  $('slider-home li').find(".description").animate({opacity: "1"}, 1000, function() {
			// Animation complete
		  });
		});*/
	
		
		$("#slider-home li.current").live("myCustomEvent", function(e, myName, myValue) {
		  //$(this).text("Hi there!");
		  //$(".description").stop().css("opacity", 1)		   
			});
		$('#slider-home li').eq(0).children('.description').fadeIn(1000);
	/*$("#slider-home li.current").live("myCustomEvent", function(e, myName, myValue) {
		  //$(this).text("Hi there!");
		  $(".description").stop().css("opacity", 1)
				   .text("myName = " + myName)
				   .fadeIn(30).fadeOut(1000);
		});
		$("#nav li").click(function () {
		  $("#slider-home li.current").trigger("myCustomEvent");
		});*/

		
		
		
	 //$("#mainnavigation li li a.active").css({color: "#871313"});
		



	 

});

	/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */
