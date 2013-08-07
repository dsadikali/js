/*
 * All java script logic for the application.
 *
 * The code relies on the jQuery JS library to
 * be also loaded.
 */

var triumph = (function (jQuery) {

	// function for bar-button on the homepage
	var barbuttonoverlay = {
		init: function () {
			var overlayWidth = 0;
			var overlayHeight = 0;
			var barWidth = 0;
			var barHeight = 0;
			var marginTop = 1;
			var marginLeft = 1;
			var overlayBorder = 0;
			  
			$(".bar-button").click(function () { 	
		
				if ( $(this).parent().find(".overlay").hasClass("visible") )
				{ 
					$(this).parent().find(".overlay").removeClass("visible");
				}
				else
				{
					$(this).parents().find(".overlay").removeClass("visible");
					$(this).parent().find(".overlay").addClass("visible");
					
					overlayWidth = parseInt( $(this).parent().find(".overlay").outerWidth() );
					overlayHeight = parseInt( $(this).parent().find(".overlay").outerHeight() );
					barHeight = parseInt( $(this).outerHeight() );
					barWidth = parseInt( $(this).outerWidth() );
					marginTop = -1*( overlayHeight+barHeight );
					marginLeft = barWidth - overlayWidth;
		
					$(this).parents().find(".overlay").css('margin-top', marginTop)
					$(this).parents().find(".overlay").css('margin-left', marginLeft)
				}
								
		   	});
		
			$(".serviceslot .overlay .close-button").click(function () { 
				if ($(this).parent().parent().hasClass("visible") )
				{
					$(this).parents().find(".overlay").removeClass("visible");
				}
			});
		}
	};
	
	// function for round corner fix product image corner only for IE 
	var roundcornerfix = {
		init: function () {
			$(function(){
		      //  if($.browser.msie){
			        for (var i=0; i<=0; i++) {
			          $('.imgwrapper, .productimage a').each(function(){
			              $(this).append('<div class="image-mask tl">').append('<div class="image-mask tr">').append('<div class="image-mask br">').append('<div class="image-mask bl">').find('.innerBorder').remove();
			          });
			        } 
		      //  }
		    });
		}
	};
	
	return { 
		init: function () {
			barbuttonoverlay.init();
			roundcornerfix.init();
		}	
	};
}(jQuery));

function bindSizeguidedialog() {
	$(".sizeguide .icon").live('click', function (ev) {
		var sizeChartUrl= $(this).attr('data-size-chart');
		var sizeChartTitle = $(this).attr('data-title');
		var containerId = "sizeguidecontainer";
		var sizeChartType = $(this).attr('sizeChartType');

		if( $("#" + containerId).length == 0) {
			$(document.body).append('<div id="'+containerId+'"></div>');
		}

		app.ajax.load({
			selector: "#"+containerId,
			url: sizeChartUrl,
			callback: function() {
				if( $("#"+containerId).dialog("isOpen") == true ) {
					return;
				}
				$("#"+containerId).dialog({
					bgiframe: true,
					autoOpen: true,
					modal: true,
			    	width: 'auto',
			    	resizable: false,
			    	draggable: false,
			    	title: sizeChartTitle,
			    	dialogClass: 'sizeGuideDialog '+sizeChartType,
			    	close: function(){
						$(this).empty().dialog('destroy');
					}
				});
			}
		});
		
		// Webtrekk
		wtsendinfo("product_detail.size_guide", "click");
	});
}

function bindsearchinput() {
	$('.simplesearchinput').focusin(function() {
		$(this).addClass("focus");
	});
	
	//$('#searchinput').focusout(function() {
		//$(this).removeClass("focus");
	//});
}
/*
var searchHandler = (function (jQuery) {

	var defaultval;
	
	var setDefaultValue = {
		init: function () {
			defaultval = $(".simplesearchinput").val();
			console.log("SetDefaultValue: "+defaultval);
		}
	};
	
	return { 
		init: function () {
			setDefaultValue.init();
		}	
	};
	
}(jQuery));
*/


function searchHandler() {

	var defaultval;
	var searchterm;
	var searchurl;
	var searchterm;
	
	defaultval = $(".simplesearchinput").val();

	jQuery("#SimpleSearchForm").submit(function() {
		
		searchterm = $(".simplesearchinput").val();
		searchUrl = jQuery("#SimpleSearchForm").attr("action");
		
		if(searchterm != '' && searchterm != defaultval){
			window.location = app.util.appendParamToURL(searchurl, "q", searchTerm);
		}else{
			$(".simplesearchinput").addClass('redtext');
			$(".simplesearchinput").val(defaultval);
	        return false;
		}
		
    });
}	

function binddialog() {
	$(".dialogbox a").live('click', function (event) {
		event.preventDefault();
		var chartUrl= $(this).attr('data-chart');
		var chartTitle = $(this).attr('data-title');
		var containerId = "dialogcontainer";
		var chartType = $(this).attr('chartType');

		if( $("#" + containerId).length == 0) {
			$(document.body).append('<div id="'+containerId+'"></div>');
		}

		app.ajax.load({
			selector: "#"+containerId,
			url: chartUrl,
			callback: function() {
				if( $("#"+containerId).dialog("isOpen") == true ) {
					return;
				}
				$("#"+containerId).dialog({
					bgiframe: true,
					autoOpen: true,
					modal: true,
			    	width: 'auto',
			    	resizable: false,
			    	draggable: false,
			    	title: chartTitle,
			    	dialogClass: 'genericDialog '+chartType,
			    	close: function(){
						$(this).empty().dialog('destroy');
					}
				});
			}
		});
		
		// Webtrekk
		//wtsendinfo("product_detail.size_guide", "click");
		
	});
}

function newsletter() {
	var subscribe=app.URLs.newsletterSubscribeUrl;
	var unsubscribe=app.URLs.newsletterUnSubscribeUrl;
	var title=app.resources.title;
	var titleerror=app.resources.titleError;
	$(document.body).append('<div id="NewsletterSub"></div>');
	$('#NewsletterSub').hide();
   
	function doConnectFunction() {
	    $( "#NewsletterSub" ).dialog( "option", "title", title );
		$('#NewsletterSub').dialog({
			bgiframe: true,
			autoOpen: false,
			modal: true,
	    	height: 'auto',
	    	width: 'auto',
	    	title: title,
	    	resizable: false,
	    	draggable: false
		});	
	}
	function doNoConnectFunction() {
		$( "#NewsletterSub" ).dialog( "option", "title", titleerror );
		$( "#NewsletterSub" ).dialog( "option", "position", 'center' );
	}
	$('#subscribenl,.open-newsletter-dialog').bind('click', function (event) {
		var i = new Image();
		i.src=baseURL+'?d=' + escape(Date()); 
		$( "#NewsletterSub" ).dialog( "option", "title", title );
		i.onload = doConnectFunction;
		i.onerror = doNoConnectFunction;
		
		$("#NewsletterSub").load(subscribe,{"email":jQuery("#newsletterinput")[0].value},function() {
			var enteredValue = $('#newsletterinput.simplesearchinput').val();
			$("input[name='${pdict.CurrentForms.newsletter.subscribe.email.htmlName}']").val(enteredValue);
			function bindEvents() {
				$('#subscribeSend').bind('click', function (event) {
							event.preventDefault();
							jQuery('#NewsletterSub').load(jQuery('#subscribeSend').parents('form')[0].action, jQuery(jQuery('#subscribeSend').parents('form')[0]).serializeArray(), bindEvents);	//recursive binding for each time the form was sent
						}
					); 
				jQuery('#showUnSubscribe').bind('click', function (event) {						
							event.preventDefault();
							jQuery('#NewsletterSub').load(unsubscribe, {"email":jQuery("#newsletterinput")[0].value}, bindEvents);			
						});
				jQuery('#resetBtnNwslttr').bind('click', function (event) {
							$(':input','#dwfrm_newsletter_subscribe').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');	
						}
					);	
				jQuery('#unSubscribeSend').bind('click', function (event) {
							event.preventDefault();
							jQuery('#NewsletterSub').load(jQuery('#unSubscribeSend').parents('form')[0].action, jQuery(jQuery('#unSubscribeSend').parents('form')[0]).serializeArray(), bindEvents);	//recursive binding for each time the form was sent
						}
					);
				//init form values 
				jQuery("input[name='${pdict.CurrentForms.newsletter.subscribe.firstname.htmlName}']").each(
						function (index,element) {
							jQuery(element).focus(function () {
								if (this.value === "${Resource.msg('forms.newsletter.firstname.default','forms',null)}") {
									this.value = '';
								}
							});
						}
					);
				jQuery("input[name='${pdict.CurrentForms.newsletter.subscribe.lastname.htmlName}']").each(
						function (index,element) {
							jQuery(element).focus(function () {
								if (this.value === "${Resource.msg('forms.newsletter.lastname.default','forms',null)}") {
									this.value = '';
								}
							});
						}
					);
				jQuery("input[name='${pdict.CurrentForms.newsletter.subscribe.email.htmlName}']").each(
						function (index,element) {
							jQuery(element).focus(function () {
								if (this.value === "${Resource.msg('forms.newsletter.email-confirm.default','forms',null)}") {
									this.value = '';
								}
							});
						}
					);	
				$('#dwfrm_newsletter_subscribe').formidable();
			}
	
			var wtUrl = webtrekkUrl + "?contentID=newsletter.registration&contentGroup=newsletter&wtTrackingType=newslettertracking";
			$.getJSON(wtUrl, function(data){
				app.webtrekk.trackingHandler(data);
			});
			$('#NewsletterSub').dialog('open'); 
			bindEvents();
		});

	});
}



// the SEO onpage-content needs to be placed right below the HTML-code of the navigation (#onpage-text), but visually placed at the page footer (#onpage-target)
// the onpage-content is delivered by a content-slot 'home-onpage-seo' within homepage.isml
var positionOnPageText = function(){
	
	// position the 'onpage-text'-node to the position of the 'onpage-target'-node only if slot is present and contains some text 
	if($('#onpage-text').length > 0 && $.trim($('#onpage-text').text()) != ""){
		// wait until teaser images are reliably loaded
		$('.teasers').imagesLoaded( function(){
			$('#onpage-text').css({position : 'absolute'}).css({top: $('#onpage-target').position().top});
			$('#onpage-target').css({height: $('#onpage-text').outerHeight()});
		});
	} else {
		// delete onpage-text and onpage-target node from DOM
		$('#onpage-text, #onpage-target').empty().remove();
	}
}


//if DOM ready
jQuery(document).ready(function () {
	triumph.init();
	bindSizeguidedialog();
	binddialog();
	newsletter();
	bindsearchinput();
	positionOnPageText();
	searchHandler();
});



// add additional functionality before app.producttile.toggleVariationThumbnail() :
//   display badge on mouse over color-swatches for sale colors only
(function(){
	
	var toggleVariationThumbnailHook = function(swatch){
		var badge =         swatch.find('.sale-badge');
		var badges =        swatch.parent().find('.sale-badge');
		var selectedBadge = swatch.parent().find('a.selected').find('.sale-badge');

		// if current swatch has a badge, then show this badge. Otherwise hide it.
		if(badge.length > 0){
			badge.show();
		} else {
			badges.hide();
		}
		
		// this indicates an mouseout event
		var mouseout = !swatch.parents('.producttile').find(".productimage img").hasClass('temp');
		
		// if selected swatch has a badge, then show this badge on mouseout
		if(mouseout && selectedBadge.length > 0){
			selectedBadge.show();
		}
		
		// if selected swatch has no badge, then hide current badge on mouseout
		if(mouseout && selectedBadge.length == 0){
			badge.hide();
		}
	};
	
	var toggleVariationThumbnail = app.producttile.toggleVariationThumbnail;
	app.producttile.toggleVariationThumbnail = function(swatch){
		toggleVariationThumbnail.apply(this, arguments);
		toggleVariationThumbnailHook.apply(this, arguments);
	};
	
})()

