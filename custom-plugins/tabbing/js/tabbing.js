// Define the jQuery plugin.
var wrapper_counter=0;
	jQuery.fn.tabbing = function( objOptions ){
		
		var obj = jQuery.extend({},jQuery.fn.tabbing.Default,objOptions);
		var main_id = this; 
		
		var init_ele;
		if(obj.active_addressbar)
		{
			var s = window.location.href;
			
			if(getSecondPart(s))
				init_ele=getSecondPart(s);
			else
				init_ele=obj.FirstTimeShow;
			
		}
		else{
				init_ele=obj.FirstTimeShow;
				$(obj.TabClass+' a').attr('href','javascript:;');
			}
			
			activate_tab(init_ele);	
					
		function getSecondPart(str) {return str.split('#')[1];}
		
		function activate_tab(ele){
			$(main_id).hide();
			$(obj.TabClass).removeClass('active');
			$('#'+ele).show();
			$(obj.TabClass+' a[title|="'+ele+'"]').parent().addClass('active');
		}
/*=========================Click event============================*/		
		$(obj.TabClass).click(function(){
			activate_tab($(this).find('a').attr('title'));
		});
/*=========================Click event============================*/
		return( this );
	}
 
/*=========================Tabbing options============================*/
 
	// Define the jQuery method's default properties.
	jQuery.fn.tabbing.Default = 
		{
			TabClass:'.tabs li',
			FirstTimeShow:"tab2",
			active_addressbar:false
		};