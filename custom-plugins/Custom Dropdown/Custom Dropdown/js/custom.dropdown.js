// jQuery Custom Dropdown.
var wrapper_counter=0;

	jQuery.fn.customDropdown = function( objOptions ){
		
		var obj = jQuery.extend({},jQuery.fn.customDropdown.Default,objOptions);
			
			$(obj.mainSelector).each(function(){
				$(this).append("<dl><dt><div></div></dt><dd></dd></dl>");
				$(this).find(' dl dd').append('<ul class="cf" />');
				var ele = $(this);
				var default_text = $(this).find('select').attr('title');
				$(this).find('option').each(function(){
					var mainSel = $(this).closest(obj.mainSelector);
				if($(this).text()==ele.find('select').val()){
					if(default_text)
						mainSel.find('dl dt div').text(default_text)
					else
						mainSel.find('dl dt div').text(this.text)
						mainSel.find('dl ul').append('<li class="active">' + this.text +'</li>')
						mainSel.find('li.active').hide();
						}
			
				else{
						$(this).closest(obj.mainSelector).find('dl dd ul').append("<li>" + this.text +"</li>")
					}
			
					})		
			});
			
			

		
				$(obj.mainSelector+' dt').click(function(){
					var mainSel = $(this).closest(obj.mainSelector);
					$(obj.mainSelector).removeClass('focused');
					mainSel.addClass('focused');
					$(obj.mainSelector+' dd').each(function(){
						if(!$(this).closest(obj.mainSelector).hasClass('focused'))
							$(this).hide();
					});
					mainSel.find('dd').toggle();					
					mainSel.find('dd li').show();					
					mainSel.find('li.active').hide();					
					})	
				
				$(obj.mainSelector+' li').click(function(){
					var mainSel = $(this).closest(obj.mainSelector);
					mainSel.find('dd').hide();
					mainSel.find('li').removeClass('active')
					$(this).addClass('active')
					var txt = $(this).text();
					mainSel.find('dt div').text($(this).text())
					mainSel.find('option').removeAttr('selected')
					mainSel.find('select').val($(this).html())
					mainSel.find('option').each(function(){
					if($(this).text()== txt)
							$(this).attr('selected',true);
					});
					
				})	
		
				$(obj.mainSelector+' select').hide()
				$(obj.mainSelector+' dd').hide()		
		
		return( this );
		
		}


/*=========================customDropdown options============================*/

	// Define the jQuery method's default properties.

	jQuery.fn.customDropdown.Default = 
		{
			mainSelector:'.customDropdown select'
		}
$(function(){		
	$('body').customDropdown({
		mainSelector:'.customDropdown'
	});	
	
	$(document).mouseup(function(e) {
		if($(e.target).parent(".customDropdown dt").length==0){
				$(".customDropdown").find('dd').hide();
			}
			});		
	
})



