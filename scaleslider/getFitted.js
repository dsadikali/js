var triumph_data = {
	errorHandler: {
		header: "",
		text: ""
	},
	collision: {
	},
	categories: {
		cupdrag: 'tops',
		bustdrag: 'tops',
		waistdrag: 'underwear',
		hipdrag: 'underwear'
	},
	unitUrl: "",
	sizeUrl: "",
   //unitUrl: "../../global/get_fitted/data/",
	//sizeUrl: "../../global/get_fitted/data/",
	
	/*country: 'de',*/
	unit: 'cm' 
};

// used to check if all ajax requests have completed
// increment by one for every ajax request made in the application
// fired is used to call checkSize() method only once and on every handler event
var complete = 2;
var fired = false;


(function($){
	if(!document.defaultView || !document.defaultView.getComputedStyle){ // IE6-IE8
		var oldCurCSS = jQuery.curCSS;
		jQuery.curCSS = function(elem, name, force){
			if(name === 'background-position'){
				name = 'backgroundPosition';
			}
			if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
				ret = oldCurCSS.apply(this, arguments);
				return ret;
			}
			ret = oldCurCSS.call(this, elem, 'backgroundPositionX', force) +' '+ oldCurCSS.call(this, elem, 'backgroundPositionY', force);
			return ret;
		};
	}

	
	
	$.widget(
			'ui.fittedSlider', 
			$.extend(
					{}, 
					$.ui.mouse,
					{
						init: function(){
							// VARIABLES 
							this.ui = {
									parent: {
										self: this.element.parents('div.drag-wrapper:first')
									},
									valElm: this.element.find('div.value:first'),
									posBG: this.element.css('backgroundPosition'),
									positions: {}
							};
							this.ui.parent = $.extend({}, this.ui.parent, {
								bodyPart: this.ui.parent.self.attr('id'),
								valElm2: this.ui.parent.self.find('strong:first'),
								more: this.ui.parent.self.find('a.more:first'),
								less: this.ui.parent.self.find('a.less:first')
							});
							this.ui.valX = this.ui.posBG.substring(0, this.ui.posBG.indexOf('px'));
							this.ui.posBG = this.ui.posBG.substring(this.ui.valX.length, this.ui.posBG.length);
							this.ui.valX = parseInt(this.ui.valX, 10);
							this.curVal = parseInt(this.ui.valElm.html(), 10);
							// EVENTS
							var that = this;
							this.ui.parent.more.bind('click', 
									function(e) {
										that.element.triggerHandler('sliderChange', {val: $.ui.fittedSlider.defaults.steps});
										return false;
									}
							);
							this.ui.parent.less.bind('click', 
									function() { 
										that.element.triggerHandler('sliderChange', {val: -$.ui.fittedSlider.defaults.steps});
										return false;
									}
							);
							
							
							this.element.bind('sliderChange', function(e, data){
								that.changeSlider(e, data);
							});
							
							//METHODS
							this.mouseInit();
							this.handleHoverHandles();
							
						},
						
						changeSlider: function(e, data) {
							var dims = $.ui.fittedSlider.defaults.dimensions;
							if((this.curVal + data.val/$.ui.fittedSlider.defaults.steps) >= dims[this.ui.parent.bodyPart].minimum && 
									(this.curVal + data.val/$.ui.fittedSlider.defaults.steps) <= dims[this.ui.parent.bodyPart].maximum) {
								this.ui.valX -= data.val;
								this.element.css({
									backgroundPosition: (this.ui.valX) + this.ui.posBG
								});
								this.curVal += data.val/$.ui.fittedSlider.defaults.steps;
								this.ui.valElm.html(parseInt(this.curVal, 10));
								this.ui.parent.valElm2.html(parseInt(this.curVal, 10)+$.ui.fittedSlider.defaults.unit);
								this.element.triggerHandler('sliderUpdate', {elm: this});
							}
						},
						
						handleHoverHandles: function() {
							this.element.hover(function() {
								var moveableElm = $('div.fitted-zoom-inner', '#container-1'),
										elm = $('div.active-drag')
													.removeClass('active-drag')
													.attr('id');
								$('span[rel="'+elm+'"]', '#container-1')
									.removeClass(''+elm+'-line-active');
								var newElm = $(this)
									.parents('div.drag-wrapper')
									.addClass('active-drag')
									.attr('id');

								if(newElm === 'waistdrag' || newElm === 'hipdrag') {
									moveableElm
										.animate({top: '-81px'}, {duration: 200});
								} else {
									moveableElm
										.animate({top: '0px'}, {duration: 200});
								}
								
								$('span[rel="'+newElm+'"]', '#container-1')
								.addClass(''+newElm+'-line-active');
								
							}, function() {});
						},
						
						mouseStart: function(e) {
							this.ui.positions.startX = e.pageX;
						},
						
						mouseDrag: function(e) {
							this.element.triggerHandler('sliderChange', {val: parseInt((this.ui.positions.startX - e.pageX), 10)});
							this.ui.positions.startX = e.pageX;
						},
						
						updateNewUnits: function() {
							this
								.ui
								.parent
								.valElm2
								.html(
										$.ui.fittedSlider.defaults.dimensions[this.ui.parent.bodyPart].defaults + '' + 
										$.ui.fittedSlider.defaults.unit);
							this
								.ui
								.valElm
								.html(
										$.ui.fittedSlider.defaults.dimensions[this.ui.parent.bodyPart].defaults);
							
							
							this.curVal = $.ui.fittedSlider.defaults.dimensions[this.ui.parent.bodyPart].defaults;
							
							this
								.element
								//.css({backgroundPosition: this.ui.valX+''+this.ui.posBG});
								.removeAttr('style')
							
							if(!this.element.is('.drag-inner-'+$.ui.fittedSlider.defaults.unit)) {
								this.element
									.removeClass('drag-inner-cm')
									.removeClass('drag-inner-in')
									.addClass('drag-inner-'+$.ui.fittedSlider.defaults.unit);
							}
							this.ui.posBG = this.element.css('backgroundPosition');
							this.ui.valX = this.ui.posBG.substring(0, this.ui.posBG.indexOf('px'));
							this.ui.posBG = this.ui.posBG.substring(this.ui.valX.length, this.ui.posBG.length);
							this.ui.valX = parseInt(this.ui.valX, 10);
						}
					}
			)
	);
	
	
	$.widget(
			'ui.getFitted', 
			$.extend(
					{},
					{
						init: function(e) {
							if($('#cupdrag').length !== 0) {
								var that = this;
								this.errors = [true, true];
								this.slider = [];
								this.errorCode = '';
								this.unit = triumph_data.unit;
								this.country = triumph_data.country;
								this.getSizeTable(this.unit, this.country);
								this.getUnitDimensions(this.unit);
								
								this.braSize = $('span.bra-size', this.element);
								this.slipSize = $('span.slip-size', this.element);
								
								var self = this;
								this.forms = $('#unit-filter, #country-filter')
									.each(function() {
									var that = this;
									$(this)
										.unbind('submit')
										.bind('submit', function() {return false;})
										.find('ul.ui-menubar ul li')
										.bind('menuitemclick', function() {
											var val = $(this).find('span:first').attr('data-value');
											if(that.id === "unit-filter") {
												self.unit = val;
											}
											else if(that.id === "country-filter") {
												self.country = val;
											}
											self.getSizeTable(self.unit, self.country);
											self.getUnitDimensions(self.unit);
											return false;
										});
									});
							}
						},
						getUnitDimensions: function(unit) {
							var that = this;
							$.ajax({
								url: $.ui.getFitted.defaults.unitUrl+unit+".json",
								dataType: "json",
								success: function() {
									that.unitSuccess.apply(that, arguments);
									complete--;
								}
							});
						},
						
						getSizeTable: function(unit, country) {
							var that = this;
							$.ajax({
								url: $.ui.getFitted.defaults.sizeUrl+country+unit+".json",
								dataType: "json",
								success: function() {
									that.sizeSuccess.apply(that, arguments);
									complete--;
								}
							});
						},
						
						unitSuccess: function(data, stat, xhr) {
							var that = this;
							data = data.data;
							
							$.ui.fittedSlider.defaults = $.extend({}, $.ui.mouse.defaults, data.triumph_dimensions);
							$.ui.getFitted.defaults = $.extend({}, $.ui.getFitted.defaults, data);
							
							$('div.drag-inner', this.element).each(function(i) {
								$(this)
									.fittedSlider()
									.bind('sliderUpdate', that, that.handleUpdatedSlider);
								that.slider.push($(this).data('fittedSlider'));
								$(this).data('fittedSlider').updateNewUnits();
								if(i%2) {
									$(this).data('fittedSlider').element.triggerHandler('sliderUpdate', {elm: $(this).data('fittedSlider')});
								}
							});
							
						}, 
						
						sizeSuccess: function(data, stat, xhr) {
							var that = this;
							data = data.data;
							
							$.ui.getFitted.defaults.sizes = data.sizes;
						},
						
						handleUpdatedSlider: function(e, data) {
							var that = e.data;
							var parentID = data.elm.ui.parent.self.attr('id'),
									opts = $.ui.getFitted.defaults, otherElm;
							
							function checkForCollision() {
								if(opts.collision && opts.collision.smaller && (opts.collision.smaller[0] === parentID || opts.collision.smaller[1] === parentID)) {
									if(opts.collision.smaller[0] === parentID) {
										otherElm = $('#'+opts.collision.smaller[1]).find('div.drag-inner').data('fittedSlider');
										if(data.elm.curVal > otherElm.curVal) {
											otherElm.element.triggerHandler('sliderChange', {val: (data.elm.curVal-otherElm.curVal)*5});
										}
									}
									else {
										otherElm = $('#'+opts.collision.smaller[0]).find('div.drag-inner').data('fittedSlider');
										if(data.elm.curVal < otherElm.curVal) {
											otherElm.element.triggerHandler('sliderChange', {val: (data.elm.curVal-otherElm.curVal)*5});
										}
									}
								}
							}
							
							
							function checkSizes() {
								
								var sizes,
										firstVal, 
										secondVal,
										errorElm = $('.result .warning');
								
								if($.ui.getFitted.defaults.categories[parentID] === 'tops') {
									that.errors[0] = false;
									sizes = $.ui.getFitted.defaults.sizes.tops;
									firstVal = parseInt(that.slider[0].curVal, 10);
									secondVal = parseInt(that.slider[1].curVal, 10);
									for(var i = 0, len = sizes.length; i<len;i++) {
										if(secondVal >= sizes[i].bust.min && secondVal <= sizes[i].bust.max) {
											for(var j = 0, jlen = sizes[i].cup.length; j<jlen; j++) {
												if(firstVal >= sizes[i].cup[j].min && firstVal <= sizes[i].cup[j].max) {
														that.braSize.html(sizes[i].name+' '+sizes[i].cup[j].type);
														that.errors[0] = true;
														break;
												}
											}
											if(that.errors[0]) { break; }
										}
									}
								}

								if($.ui.getFitted.defaults.categories[parentID] === 'underwear') {
									that.errors[1] = false;
									sizes = $.ui.getFitted.defaults.sizes.underwear;
									firstVal = parseInt(that.slider[2].curVal, 10);
									secondVal = parseInt(that.slider[3].curVal, 10);
									for(var k = 0, klen = sizes.length; k < klen; k++) {
										if(firstVal >= sizes[k].waist.min && firstVal <= sizes[k].waist.max && secondVal >= sizes[k].hip.min && secondVal <= sizes[k].hip.max) {
												that.slipSize.html(sizes[k].name);
												that.errors[1] = true;
												break;
										}
									}
								}
								
								if(!(that.errors[0] && that.errors[1])) {
									errorElm.find('h3:first').html($.ui.getFitted.defaults.errorHandler.header);
									errorElm.find('p:first').html($.ui.getFitted.defaults.errorHandler.text);
									errorElm.css({display: 'block'})
									
									if(!that.errors[0]) {
										that.braSize.html('');
									} else {
										that.slipSize.html('');
									}
								} else {
									errorElm.css({display: ''});
								}
							}
							
							checkForCollision();
							// start processing of data after all ajax requests have completed
							$('body').ajaxSuccess( function() {
								if( complete === 0 && fired === false ) {
									checkSizes();
									fired = true;
								}
							});
							if( fired === true ) {
								checkSizes();
							}
						}
					}
			)
	);
	
	$.ui.fittedSlider.defaults = $.extend({}, $.ui.mouse.defaults, {});
	$.ui.getFitted.defaults = $.extend({}, $.ui.mouse.defaults, triumph_data);
	
	
})(jQuery);
