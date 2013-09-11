// Define the jQuery plugin.
var wrapper_counter=0;
	jQuery.fn.pagination = function( objOptions ){
		$mainwrapper = $(this);
		var objSettings = jQuery.extend({},jQuery.fn.pagination.Default,objOptions);
 
		create_pagination(objSettings.Element_per_page);

 		function create_pagination(element_per_page){
			/*Calculate parts*/
			
/*=========================Calculate number for pagination=================*/
			pagecnt = Math.floor( $mainwrapper.find(objSettings.Wrapper).size()/element_per_page);
			pagerem = $mainwrapper.find(objSettings.Wrapper).size()%element_per_page;
			if(pagerem>0)
				pagecnt++;
			
			/*Create pagination*/	
			var paginationdata='';
			
/*=========================Create pagination links=========================*/

			for(var i=1; i<=pagecnt; i++){
				if (i==1)
					paginationdata+='<li class="firstpage"><a href="javascript:;">'+i+'</a><span class="dots">...</span></li>';
				else if(i == pagecnt)
					paginationdata+='<li class="lastpage"><span class="dots">...</span><a href="javascript:;">'+i+'</a></li>';			
				else 
					paginationdata+='<li><a href="javascript:;">'+i+'</a></li>';
			}
			
/*=========================Create pagination==============================*/
			
			$mainwrapper.find('.'+objSettings.pagination).html('<a class='+objSettings.Previous+' href="javascript:;" title="Prev Page">Previous</a><ul>'+paginationdata+'</ul><a class='+objSettings.Next+' href="javascript:;" title="Next Page">Next</a>');
			
/*=========================Attach first,last links=========================*/

			if(objSettings.first_last==1 || objSettings.first_last==3)
			{
				$mainwrapper.find('.'+objSettings.pagination).prepend('<a class='+objSettings.First_Link+' href="javascript:;" title="Go first">First</a>');
				$mainwrapper.find('.'+objSettings.pagination).append('<a class="'+objSettings.Last_Link+'" href="javascript:;" title="Go last">Last</a>');
			}
			
/*=========================Attach disable links=========================*/
			
			if(objSettings.show_disable_links)
			{
				$mainwrapper.find('.'+objSettings.pagination).prepend('<span class="'+objSettings.First_Link+' disable">First</span><span class="'+objSettings.Previous+' disable">Previous</span>');
				$mainwrapper.find('.'+objSettings.pagination).append('<span style="display:none;" class="'+objSettings.Next+' disable">Next</span><span class="'+objSettings.Last_Link+' disable" style="display:none;">Last</span>');
			}
			
/*=========================End Attach disable links=======================*/

			create_pages(0,element_per_page);
		}
		
		function create_pages(cnt,element_per_page)
		{
			var goon =element_per_page*cnt;
			
			
/*=========================Reset pagination=======================*/

			$mainwrapper.find(objSettings.Wrapper).removeClass('first last');
			$mainwrapper.find('.'+objSettings.pagination+' li').removeClass('active');
			
				$mainwrapper.find('.'+objSettings.pagination+' .firstpage .dots, .'+objSettings.pagination+' .lastpage .dots').hide();
				
				$mainwrapper.find('.'+objSettings.pagination+' .firstpage a').show();
				$mainwrapper.find('.'+objSettings.pagination+' .lastpage a').show();
			
			var last_li_index =$mainwrapper.find('.'+objSettings.pagination+' li').size()-1;
			
/*=========================Add first,last,active class=======================*/
			
			$mainwrapper.find(objSettings.Wrapper).eq(goon).addClass('first');
			var temp =goon;
			temp += element_per_page-1;
			$mainwrapper.find(objSettings.Wrapper).eq(temp).addClass('last');
			

			$mainwrapper.find('.'+objSettings.pagination).each(function(){
				$(this).find('li').eq(cnt).addClass('active');
				if(last_li_index>objSettings.number_of_middle_button+1)
				{
	/*=========================Reset li=======================*/
	
					$(this).find('li').hide();
					
	/*=========================Show/hide according li=======================*/
					
					if(cnt<objSettings.number_of_middle_button)
					{
						for(var i=0; i<objSettings.number_of_middle_button+1; i++)
							$(this).find('li').eq(i).show();
					
						if(last_li_index>objSettings.number_of_middle_button)
						{
							$(this).find('li.lastpage .dots').show();
							if(objSettings.first_last==1)
								$(this).find('li.lastpage a').hide();
						}
								
					}
					else
					{
						var pag_low_lim =0,pag_high_lim =0,first_dot = 0;
						if(cnt==last_li_index)
						{
							pag_low_lim = 0;
							pag_high_lim = 1;
							first_dot = 0;
						}
						else if(cnt==last_li_index-1)
						{
							pag_low_lim = 1;
							pag_high_lim = 1;
							first_dot = 0;
						}
						else
						{
							pag_low_lim = 2;
							pag_high_lim = 2;
							first_dot = 1;
						}
						
						for(var i=(cnt-objSettings.number_of_middle_button)+pag_low_lim; i<cnt+pag_high_lim; i++)
						{
							$(this).find('li').eq(i).show();
						}
						if(cnt<last_li_index-1)
						{
							$(this).find('li.lastpage .dots').show();
							if(objSettings.first_last==1)
								$(this).find('li.lastpage a').hide();
						}
						if((cnt-objSettings.number_of_middle_button)+first_dot>0)
						{
							$(this).find('li.firstpage .dots').show();
							if(objSettings.first_last==1)
								$(this).find('li.firstpage a').hide();
						}
						
					}
					
	/*=========================Ends Show/hide according li================================*/
	
				}

	/*=========================Always show first & last number link=======================*/
	
				$(this).find('li').eq(0).show();			
				$(this).find('li').eq(last_li_index).show();	
						
			});
/*=========================Hide disable links======================================*/

		if(objSettings.show_disable_links){
/*=========================First and Previous disable links========================*/

			if($mainwrapper.find('.'+objSettings.pagination+' li:first-child').hasClass('active'))
				var visiblity = 'none', rev_visibility = 'block';
			else
				var visiblity = 'block' , rev_visibility = 'none';
				
			$mainwrapper.find('.'+objSettings.Previous+', .'+objSettings.First_Link).css('display',visiblity);
			$mainwrapper.find('.'+objSettings.Previous+'disable,  .'+objSettings.First_Link+'disable').css('display',rev_visibility);

/*=========================Last and Next disable links========================*/

			if($mainwrapper.find('.'+objSettings.pagination+' li:last-child').hasClass('active'))
				var visibility = 'none', rev_visibility = 'block';
			else
				var visibility = 'block' , rev_visibility = 'none';
			
			$mainwrapper.find('.'+objSettings.Next+', .'+objSettings.Last_Link).css('display',visibility);
			$mainwrapper.find('.'+objSettings.Next+'disable,  .'+objSettings.Last_Link+'disable').css('display',rev_visibility);
				
		}
/*=========================Show disable links======================================*/
		else
		{
			
/*=========================First and Previous links========================*/

			if($mainwrapper.find('.'+objSettings.pagination+' li:first-child').hasClass('active'))
				var visibility = 'hidden';
			else
				var visibility = 'visible'
				
			$mainwrapper.find('.'+objSettings.Previous+', .'+objSettings.First_Link+', '+objSettings.Previous+', .'+objSettings.Previous).css('visibility',visibility);

/*=========================Last and Next links============================*/
			
			if($mainwrapper.find('.'+objSettings.pagination+' li:last-child').hasClass('active'))
				var visibility = 'hidden';
			else
				var visibility = 'visible'
			
			$mainwrapper.find(objSettings.Next+', .'+objSettings.Last_Link+', '+objSettings.Next+', .'+objSettings.Next).css('visibility',visibility);
				
		}
		
/*=========================Show list=========================================*/

			/*active relative section*/	
			var temp = element_per_page-1;
			temp = temp + goon;
			
			$mainwrapper.find(objSettings.Wrapper).hide();
			for(var i=goon; i<=temp; i++){
				$mainwrapper.find(objSettings.Wrapper).eq(i).show();
			}
			
		}
		
/*=========================Next Previous Events=========================================*/
		
		function next_prev(flag){
			
			var curpage = parseInt($mainwrapper.find('.'+objSettings.pagination+' li.active a').text());
			//var element_per_page = $mainwrapper.find('.'+objSettings.Items_per_page_wrapper+' dd.active a').text();
			curpage=curpage+flag;
			create_pages(curpage, objSettings.Element_per_page);
			
		}
		
		
/*=========================Click Events=========================================*/

/*=========================Number Click==============================*/
		$($mainwrapper).on('click',' .'+objSettings.pagination+' ul li a',function(){
			//var element_per_page = $mainwrapper.find('.'+objSettings.Items_per_page_wrapper+' dd.active a').text();
			create_pages(parseInt($(this).text())-1, objSettings.Element_per_page);
			
		});
		
/*=========================Next link Click============================*/
		
		$($mainwrapper).on('click',' .'+objSettings.Next,function(){
			
			next_prev(0);
			
		});
		
/*=========================Previous link Click========================*/
		
		$($mainwrapper).on('click',' .'+objSettings.Previous,function(){
			
			next_prev(-2);
			
		});
		
/*=========================First link Click============================*/
		
		$($mainwrapper).on('click',' .'+objSettings.First_Link,function(){
			
			var element_per_page = $mainwrapper.find('.'+objSettings.Items_per_page_wrapper+' dd.active a').text();
			create_pages(0,objSettings.Element_per_page);
			
		});
		
/*=========================Last link Click============================*/
		
		$($mainwrapper).on('click',' .'+objSettings.Last_Link,function(){
			
			var element_per_page = $mainwrapper.find('.'+objSettings.Items_per_page_wrapper+' dd.active a').text();
			create_pages($mainwrapper.find('.'+objSettings.pagination+' li:last a').text()-1,objSettings.Element_per_page);
			
		});
		
/*=========================Items per page link Click============================*/
		
		$mainwrapper.find('.'+objSettings.Items_per_page_wrapper+' dd').click(function(){
			
			$mainwrapper.find('.'+objSettings.Items_per_page_wrapper+' dd').removeClass('active');
			$(this).addClass('active');
			if($(this).find('a').text()=='All')
			{
				create_pagination($mainwrapper.find(objSettings.Wrapper).size());
				$mainwrapper.find('.'+objSettings.pagination).hide();
			}else
			{
				create_pagination($(this).text());
				$mainwrapper.find('.'+objSettings.pagination).show();
			}
			
		});
		
		
/*=========================Handle with arrow keys============================*/
		$(document).keyup(function(e){
			console.log(e.keyCode)
			switch(e.keyCode)
			{
				case 39:
					console.log($('.'+objSettings.pagination).find('ul li.active a').text());
					next_prev(0);
					break;
				case 37:
					next_prev(-2);
					break;
			}
		})
		
		/*Click events end*/		
 
		// Return this for method chaining.
		
		return( this );
	}
 
/*=========================Pagination options============================*/
 
	// Define the jQuery method's default properties.
	jQuery.fn.pagination.Default = {
		Wrapper:"ul.page-slide li",
		Element_per_page:30,
		pagination:"pagination",
		Next:'next',
		Previous:'prev',
		number_of_middle_button:3,
		show_disable_links:true,
		First_Link:'Gofirst',
		Last_Link:'Golast',
		Items_per_page_wrapper:'itemPerPage',
		first_last:3 /*1. Show first last links,
					   2. Show first number last number
					   3. Show both*/
		
		};