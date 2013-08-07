// JavaScript Document

$(document).ready(function()
	{ 
	var flag=0;
	var position = $('ul.sliderbase').position();
		var left = position.left;
		function change_pos (){
			 position = $('ul.sliderbase').position();
		 left = position.left;
		
			}
		
		
		flowplayer("a.player", "http://releases.flowplayer.org/swf/flowplayer-3.2.7.swf", {
			// this is the player configuration. You'll learn on upcoming demos.
				plugins: {
			controls: {
			volume: true
			}
			}
			}); 
	
	
		$("a.new_window").attr("target", "_blank");
		$(".li-video a").addClass("active");
		$(".li-video").click(function()
		{
			$(".li-video a").addClass("active");
			$(".li-mystics a").removeClass("active");
			$(".li-brains a").removeClass("active");
			$(".video-data").fadeIn();
			$(".mystics-data,.brains-data").fadeOut("slow");
		});
		
		$(".li-mystics").click(function()
		{
			  if ($.browser.msie) {
					flowplayer().pause();
				  }
			$(".li-video a").removeClass("active");
			$(".li-mystics a").addClass("active");
			$(".li-brains a").removeClass("active");
			$(".mystics-data").fadeIn();
			$(".video-data,.brains-data").fadeOut("slow");
			
			var my_video1 = document.getElementById("example_video_1");
			my_video1.pause();
				
			var my_video2 = document.getElementById("example_video_2");
			my_video2.pause();
				
			var my_video3 = document.getElementById("example_video_3");
			my_video3.pause();
			var my_video4 = document.getElementById("example_video_4");
			my_video3.pause();
		});
		
		$(".li-brains").click(function()
		{
			  if ($.browser.msie) {
					flowplayer().pause();
				  }
			$(".li-video a").removeClass("active");
			$(".li-mystics a").removeClass("active");
			$(".li-brains a").addClass("active");
			$(".brains-data").fadeIn();
			$(".video-data,.mystics-data").fadeOut("slow");
			
			var my_video1 = document.getElementById("example_video_1");
			my_video1.pause();
				
			var my_video2 = document.getElementById("example_video_2");
			my_video2.pause();
				
			var my_video3 = document.getElementById("example_video_3");
			my_video3.pause();
			var my_video4 = document.getElementById("example_video_4");
			my_video3.pause();
			
		});
		/*############## Sliding With Numbering ################*/
		
		
		var prevpage = 1;
		$(".one, .two, .three, .four").click(function()
		{
			var value=$(this).html();
			
			$(".slide-control li>a.active").removeClass("active");
			$("#"+value).addClass("active");
			$(".li-video a").addClass("active");
			$(".li-mystics a").removeClass("active");
			$(".li-brains a").removeClass("active");
			$(".video-data").fadeIn();
			$(".mystics-data,.brains-data").fadeOut("slow");
			var x=(value-1)*826;	
			$('ul.sliderbase').animate({left: - x});
			change_pos();
		    flag = 1;
		 
		var my_video1 = document.getElementById("example_video_1");
		my_video1.pause();
			
		var my_video2 = document.getElementById("example_video_2");
		my_video2.pause();
			
		var my_video3 = document.getElementById("example_video_3");
		my_video3.pause();
		var my_video4 = document.getElementById("example_video_4");
		my_video3.pause()
		});	
		
		/*##############  Sliding With Next Previous ###########*/
	
		
		$(".next").click(function()
	{	
	if(flag == 1)
	{
		change_pos();
		flag = 0;
	}
	
		$(".li-video a").addClass("active");
		$(".li-mystics a").removeClass("active");
		$(".li-brains a").removeClass("active");
		$(".video-data").fadeIn();
		$(".mystics-data,.brains-data").fadeOut("slow");
	
		if($(".slide-control>li>a").hasClass('active'))
  			{
   					var value=$(".slide-control>li>a.active").attr("id");  
   					$(".slide-control>li>a.active").removeClass("active");
					if( parseInt(value)==4)
					{
						value=0;
					}
   					value=parseInt(value)+1;
  					 $("#"+value).addClass("active");
   			}
		
		
		
		
		if(left <= -3304)
		{

			$('ul.sliderbase').stop();
			$('ul.sliderbase').css("left",0);
			$('ul.sliderbase').animate({left:-826});
			left = -826;
			
		}
		else
		{
			
			$('ul.sliderbase').stop();
			$('ul.sliderbase').css("left",left);
			$('ul.sliderbase').animate({left:left - 826});
			left= left - 826;
			
		}
		
		var my_video1 = document.getElementById("example_video_1");
		my_video1.pause();
		var my_video2 = document.getElementById("example_video_2");
		my_video2.pause();
		var my_video3 = document.getElementById("example_video_3");
		my_video3.pause();
		var my_video4 = document.getElementById("example_video_4");
		my_video4.pause();
		
	});
	$(".pre").click(function()
	{if(flag == 1)
	{
		change_pos();
		flag = 0;
	}
		$(".li-video a").addClass("active");
		$(".li-mystics a").removeClass("active");
		$(".li-brains a").removeClass("active");
		$(".video-data").fadeIn();
		$(".mystics-data,.brains-data").fadeOut("slow");
		
		if(left == 0)
		{
			$('ul.sliderbase').stop();
			$('ul.sliderbase').css("left",-826);
			$('ul.sliderbase').animate({left:left-2478});
			left = left-2478;
		}
		else
		{	
			$('ul.sliderbase').stop();
			$('ul.sliderbase').css("left",left);
			$('ul.sliderbase').animate({left:left + 826});
			left= left+826;
		}
		
		
		if($(".slide-control>li>a").hasClass('active'))
  			{
   					var value=$(".slide-control>li>a.active").attr("id");  
   					$(".slide-control>li>a.active").removeClass("active");
					if( parseInt(value)==1)
					{
						value=5;
					}
   					value=parseInt(value)-1;
  					 $("#"+value).addClass("active");
   			}
		var my_video1 = document.getElementById("example_video_1");
		my_video1.pause();
			
		var my_video2 = document.getElementById("example_video_2");
		my_video2.pause();
			
		var my_video3 = document.getElementById("example_video_3");
		my_video3.pause();
		var my_video4 = document.getElementById("example_video_4");
		my_video3.pause();
		
		
	});
	
	/*############### Video Starts With Big Play Button ###################*/
		$("#playbutton1").click(function()
	{
		var my_video1 = document.getElementById("example_video_1");
		my_video1.play();
		$(this).hide();
	});
	
	$("#playbutton2").click(function()
	{
		var my_video2 = document.getElementById("example_video_2");
		my_video2.play();
		$(this).hide();
	});
	
	$("#playbutton3").click(function()
	{
		var my_video3 = document.getElementById("example_video_3");
		my_video3.play();
		$(this).hide();
	});
	
	$("#playbutton4").click(function()
	{
		var my_video4 = document.getElementById("example_video_4");
		my_video4.play();
		$(this).hide();
	});
		
		
});


	
