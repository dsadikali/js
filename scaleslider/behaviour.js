/**
 * @author alexander.farkas
 */


(function($){

    function initMenu(){
        function menuShow(){
            var jElm = $(this);
			
			if(!$.browser.msie) {
				jElm.stop(true, true)
					.css({
                        opacity: 0
                    })
					.animate({
						opacity: 1
					}, {
						duration: 300
					});
			}
			
            $('ul:first', this).stop(true, true).css({
                marginTop: '-' + jElm.height() + 'px'
            }).animate({
                marginTop: '-1px'
            }, {
                duration: 300
            });
        }
        function menuHide(ui){
            var jElm = $(this);
            $('ul:first', this).animate({
                marginTop: '-' + jElm.height() + 'px'
            }, {
                duration: 300,
                complete: function(){
                    $(this).css({
                        marginTop: '-1px'
                    });
                    ui.element.removeClass('over');
                }
            });
			if (!$.browser.msie) {
				jElm.animate({
					opacity: 0
				}, {
					duration: 300,
					complete: function(){
						jElm.css({
							opacity: 1
						});
						ui.element.removeClass('over');
					}
				});
			}
        }
        function minMaxWidth(type, ui){
            var width = ui.menuitem.menuitem.outerWidth(), minWidth = 0;
            
            ui.menuitem.submenu.css({
                'visibility': 'hidden'
            });
            ui.menuitem.element.addClass('over');
            
            $('span:not(.bl,.br)', ui.menuitem.submenu[0]).each(function(){
                var sW = $(this).width();
                
                if (sW > minWidth) {
                    minWidth = sW;
                }
            });
            
            ui.menuitem.element.removeClass('over');
            ui.menuitem.submenu.css({
                'visibility': ''
            });
            
            minWidth += 21; /* 2x9px + 3 */
            if (minWidth > width) {
                width = minWidth;
            }
            ui.menuitem.submenu.css({
                'width': width + 'px'
            });
        }
        $('#nav-global').menubar({
            selSubmenu: 'div',
            needToActivate: false,
            closeOnLeave: true,
            showAnim: menuShow,
            hideAnim: menuHide
        }).bind('menuitembeforeOpen', minMaxWidth);
        
        $('#nav-meta').menubar({
            selSubmenu: 'div',
            needToActivate: false,
            closeOnLeave: true,
            showAnim: menuShow,
            hideAnim: menuHide
        }).bind('menuitembeforeOpen', minMaxWidth);
    }
    
    
    $.triumpgBgImg = (function(){
        var viewport, imgSize, imgDim, staticImg, imgNum;
        function calcViewport(){
            viewport = {
                height: $(window).height(),
                width: $(window).width()
            };
        }
        
        function calcImgSize(img){
            if (img[0]) {
                imgDim = {
                    height: img.height(),
                    width: img.width()
                };
            }
        }
        
        function adjustBgImg(){
            img = staticImg;
            calcViewport();
            
            var windowRatio = viewport.width / viewport.height, imgRatio = imgDim.width / imgDim.height;
            if (windowRatio < imgRatio) {
                img.css({
                    width: 'auto',
                    height: viewport.height + 'px'
                });
            }
            else {
                img.css({
                    width: '100%',
                    height: 'auto'
                });
            }
        }
        function showNext(){
        
            staticImg = $('#bg-img img:last');
            calcImgSize(staticImg);
            adjustBgImg(staticImg);
            $('#overlay').animate({
                opacity: 0.9,
                backgroundColor: '#ffffff'
            }, {
                duration: 400,
                complete: function(){
                    staticImg.css({
                        opacity: 1
                    });
                    $('#bg-img img:first').remove();
                }
            }).animate({
                opacity: 0.5,
                backgroundColor: '#000000'
            }, {
                duration: 400
            });
        }
        function loadNext(path){
            var img = new Image();
            img.src = path;
            $(img).css({
                opacity: 0
            }).appendTo($('#bg-img')[0]);
            if (img.complete) {
                showNext();
            }
            else {
                $(img).load(showNext);
            }
            
        }
        
        return {
            init: function(){
                staticImg = $('#bg-img img:first');
                if (staticImg && staticImg[0]) {
                    if (staticImg[0].complete) {
                        calcImgSize(staticImg);
                        adjustBgImg(staticImg);
                        $(window).bind('resize', adjustBgImg);
                    }
                    else {
                        staticImg.bind('load', function(){
                            calcImgSize(staticImg);
                            adjustBgImg(staticImg);
                        });
                        $(window).bind('resize', adjustBgImg);
                    }
                }
                
            },
            loadNext: loadNext
        
        };
    })();
    (function($){
        $.imgPreLoad = (function(){
            var srcList = [], ready = false, started = false;
            function loadImg(){
                if (srcList.length) {
                    started = true;
                    var src = srcList.shift(), img = new Image();
                    img.src = src;
                    if (img.complete) {
                        loadImg();
                    }
                    else {
                        $(img).load(loadImg);
                    }
                }
                else {
                    started = false;
                }
            }
            return {
                add: function(src){
                    srcList.push(src);
                    if (ready && !started) {
                        loadImg();
                    }
                },
                ready: function(){
                    ready = true;
                    loadImg();
                }
            };
        })();
        $(window).bind('load', $.imgPreLoad.ready);
    })(jQuery);
    (function($){
        $.widget('ui.imageGallery', {
            init: function(){
                var that = this, o = this.options;
                this.links = $(o.link, this.element[0]);
                this.imageStage = $(o.imageStage, this.element[0]);
                this.imageStage.attr('tabIndex', '-1');
                if ($.imgPreLoad) {
                    this.links.each(function(){
                        $.imgPreLoad.add($(this).attr('href'));
                    });
                }
                function switchPic(e){
                    that.switchImgStage.call(that, this, e);
                    setTimeout(function(){
                        that.imageStage[0].focus();
                    }, 200);
                    return false;
                }
                this.links.bind('click.imageGallery', switchPic).attr('role', 'button');
                
            },
            switchImgStage: function(elm, e){
                var jElm = $(elm), src = jElm.attr('href');
                this.links.removeClass('active');
                jElm.addClass('active');
                if (!this.options.switchImgFn) {
                    $('img', this.imageStage).attr('src', src);
                }
                else {
                    this.options.switchImgFn.call(this, src, jElm);
                }
            }
        });
        $.ui.imageGallery.defaults = {
            link: 'a',
            imageStage: 'div.photo',
            switchImgFn: false
        };
    })(jQuery);
    var zoomGallery = (function(){
        var img, jImg, zoomContainer, gallery, galleryDim, nowDim, dimArray, poses;
        
        function constrainToGallery(left, top, width, height){
            width = width || parseFloat(img.style.width, 10);
			height = height || parseFloat(img.style.height, 10);
			
			var maxMin = $.objScale.constrainMaxMinPositionForContainer(
				{
					width: width, 
					height: height
				}, galleryDim, 
				{
					left: left,
					top: top
				});
            return [maxMin.left, maxMin.top];
        }
		
        function dragImg(e){
            
			var x = poses.x - e.clientX, 
				y = poses.y - e.clientY, 
				left = poses.left - x, 
				top = poses.top - y;
            var nPos = constrainToGallery(left, top);
            nPos[0] = nPos[0] || 0;
			nPos[1] = nPos[1] || 0;
            img.style.left = nPos[0] + 'px';
            img.style.top = nPos[1] + 'px';
            poses = {
                x: e.clientX || 0,
                y: e.clientY || 0,
                top: nPos[1],
                left: nPos[0]
            };
        }
        function scale(){
            var dir = (this.className == 'zoom-in') ? 1 : -1;
           
			if (dimArray[nowDim + dir]) {
                nowDim += dir;
                var pos = {
	                    top: parseFloat(img.style.top) + ((parseFloat(img.style.height) - dimArray[nowDim].height) / 2),
	                    left: parseFloat(img.style.left) + ((parseFloat(img.style.width) - dimArray[nowDim].width) / 2)
	                },
					cPos = constrainToGallery(pos.left, pos.top, dimArray[nowDim].width, dimArray[nowDim].height);
				
				pos.left = cPos[0];
				pos.top = cPos[1];
                var css = $.extend({}, dimArray[nowDim], pos);
				jImg.animate(css, {duration: 200});
            }
            return false;
        }
        function mouseDown(e){
            poses = {
                x: e.clientX,
                y: e.clientY,
                top: parseFloat(img.style.top, 10),
                left: parseFloat(img.style.left, 10)
            };
        }
        
        function prepareNewImg(){
            var imgDim = $.objScale.scaleSidesIn(this, galleryDim),
				difDim = {
					width: galleryDim.width - imgDim.width,
					height: galleryDim.height - imgDim.height
				};
			
			if(difDim.width < 5 && difDim.width > 0){
				imgDim.height = $.objScale.scaleWidthTo(imgDim, galleryDim.width);
				imgDim.width = galleryDim.width;
			} else if(difDim.height < 5 && difDim.height > 0){
				imgDim.width = $.objScale.scaleHeightTo(imgDim, galleryDim.height);
				imgDim.height = galleryDim.height;
				
			}
            var maxDim = {width: this.width, height: this.height};
            
            nowDim = 0;
            var stepWidth = (Math.abs(imgDim.width - maxDim.width)) / 3, stepHeight = (Math.abs(imgDim.height - maxDim.height)) / 3;
            dimArray = $.extend({}, imgDim);
			delete dimArray.margin;
			dimArray = [dimArray];
            for (var i = 0; i < 2; i++) {
                dimArray.push({
                    width: imgDim.width + stepWidth,
                    height: imgDim.height + stepHeight
                });
				
                stepWidth += stepWidth;
                stepHeight += stepHeight;
            }
            dimArray.push($.extend({}, maxDim));
            var css = {
                position: 'absolute',
                width: imgDim.width,
                height: imgDim.height,
                top: imgDim.margin[0],
                left: imgDim.margin[1],
				opacity: 0
            };
            jImg.css(css)
				.prependTo(zoomContainer[0])
				.animate({
					opacity: 1
				},
				{
					duration: 200
				})
				.bind('mousedown', mouseDown);
            
            
            var mouseDrag = new MouseDrag();
            mouseDrag.mouseInit();
            
        }
        
        function MouseDrag(){
            this.element = jImg;
            this.options = $.ui.mouse.defaults;
        }
        $.extend(MouseDrag.prototype, $.ui.mouse, {
            mouseDrag: dragImg
        });
        function switchImage(src, jElm){
            $('img:first', zoomContainer[0]).animate({
                opacity: 0
            }, {
                duration: 300,
                complete: function(){
                    $(this).remove();
                }
            });
            img = new Image();
            jImg = $(img);
            jImg.load(prepareNewImg);
            img.src = src;
        }
        function init(){
            gallery = $('#gallery');
            if (gallery[0]) {
                var imgSrc = $('#photo-index a').attr('href');
                img = new Image();
                
                
                zoomContainer = $('<div id="zoom-image"><div class="zoom-control"><a href="#" class="zoom-in">zoom in</a><a href="#" class="zoom-out">zoom out</a></div></div>');
                zoomContainer.insertBefore('#photo-index');
				
				galleryDim = {
                    width: $('#zoom-image').innerWidth(),
                    height: $('#zoom-image').innerHeight()
                };
				
                $('#gallery').imageGallery({
                    imageStage: '#zoom-image',
                    link: '#photo-index a',
                    switchImgFn: switchImage
                });
                
                jImg = $(img);
                jImg.load(prepareNewImg);
                img.src = imgSrc;
                $('a', zoomContainer[0]).click(scale);
            }
        }
        return {
            init: init,
            element: jImg,
            dragImg: dragImg
        };
    })();
    
    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    (function(){
        var cache = {};
        
        $.tmpl = function tmpl(str, data){
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ? cache[str] = cache[str] ||
            tmpl(document.getElementById(str).innerHTML) :            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
            
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            
            // Convert the template into pure JavaScript
            str
            	.replace(/^[\s]*<!--/, '')
				.replace(/-->[\s]*$/, '')
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>")
				.join("p.push('")
				.split("\r")
				.join("\\'") +
            "');}return p.join('');");
            
            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
    })();
    
    $.fn.rewriteSelect = function(opts){
        opts = $.extend({
            changeFn: function(){
            }
        }, opts);
        return this.each(function(){
            var jElm = $(this), val = jElm.val(), 
				name = jElm.attr('name'), 
				width = jElm.width() + 5, 
				selText = $('option:eq(' + this.selectedIndex + ')', this).text(), 
				selContainer = jElm.parent(), 
				selIndicator = '<span style="width: ' + width + 'px" class="indicator"><span class="tl"></span><span class="tr"></span><span class="bl"></span><span class="br"></span><em>' + selText + '</em></span>', 
				options = '', 
				selected, 
				buttonSubmit = jElm.is('.has-submit'),//
 				form;
            
            
            $('option', this).each(function(){
                selected = (this.selected) ? ' class="radio checked-radio"' : ' class="radio"';
                options += '<li><span' + selected + ' data-value="' + $(this).val() + '">' + $(this).text() + '</span></li>';
            });
            width += 2;
            var selectReplacement = $('<ul><li>' + selIndicator + '<div style="width: ' + width + 'px" class="options"><div><ul>' + options + '</ul><span class="bl"></span><span class="br"></span></div></div></li></ul>').appendTo(selContainer[0]);
            jElm.remove();
            var hiddenInput = $('<input type="hidden" value="' + val + '" name="' + name + '" />').appendTo(selContainer[0]);
            selIndicator = $('span.indicator em', selContainer[0]);
            if (!buttonSubmit) {
                form = selectReplacement.parents('form:first');
                $('input[type=submit]', form[0]).remove();
            }
            selectReplacement.menubar({
                selSubmenu: 'div',
                needToActivate: true,
                closeOnLeave: false,
                menuitem: 'span'
            }).bind('menuitemchange', function(e, instance){
                if (instance.checked) {
                    var text = $.trim(instance.element.text());
                    selIndicator.text(text);
                    hiddenInput.val(instance.menuitem.attr('data-value'));
                }
                opts.changeFn();
                if (!buttonSubmit && form) {
                    form.submit();
                }
                
            });
        });
    };
		
	function filterList(){
		var params = {},
			paramText = {},
			dynWrapper,
			selectwrapper,
			ahrComplete = false,
			animComplete = false;

		function renderResult(result){
			$.each(result.selects, createSelects);
		
			if($.browser.msie){
				dynWrapper
					.html($.tmpl('product_tmpl', result.resultset))
					.css('visibility', 'visible');
			} else {
				dynWrapper
					.html($.tmpl('product_tmpl', result.resultset))
					.css('opacity', 1)
					.slideDown(400);
			}
		}

		function getFilteredData(json, status){
			if (status && status == 'success') {
				ahrComplete = json;
				if(animComplete){
					if(json.resultset && json.resultset.category){
						renderResult(json);
					}
					ahrComplete = false;
				}
			}
		}

		function createSelects(i, item){
			var selIndicator, options, selected, id, oldSelect, selectReplacement, selText;
			options = '';
			for (var prop in item) {
				id = prop;
				
				paramText[id] = paramText[id] ||
					'';
				
				$.each(item[prop].text, function(i, text){
					selected = ' class="radio"';
					if ((!params[id] && !$.location.querys[id] && i === 0) || // initial
						(!params[id] && $.location.querys[id]  == item[prop].val[i]) || // query vorhanden
						 (params[id] == item[prop].val[i]) || // name/val gespeichert
						 (paramText[id] == text)) { // text vorhanden
						selected = ' class="radio checked-radio"';
						params[id] = item[prop].val[i];
						paramText[id] = text;
						selText = text;
					}
					options += '<li><span' + selected + ' data-value="' + item[prop].val[i] + '">' + text + '</span></li>';
					
				});
				selText = selText ||
					item[prop].text[0];
					
				selIndicator = '<span class="indicator"><span class="tl"></span><span class="tr"></span><span class="bl"></span><span class="br"></span><em>' + selText + '</em></span>';
				selectReplacement = '<ul id="' + id + '"><li>' + selIndicator + '<div class="options"><div><ul>' + options + '</ul><span class="bl"></span><span class="br"></span></div></div></li></ul>';
				oldSelect = $('#' + id);
				if (oldSelect[0]) {
					selectReplacement = $(selectReplacement).replaceAll(oldSelect[0]);
				}
				else {
					selectReplacement = $('<div class="select">' + selectReplacement + '</div>').appendTo('#filter fieldset').find('#' + id);
				}
				selectReplacement
					.menubar({
						selSubmenu: 'div',
						needToActivate: true,
						closeOnLeave: false,
						menuitem: 'span'
					})
					.bind('menuitemchange', function(e, instance){
						if (instance.checked) {
							var text = $.trim(instance.element.text()), 
								id = instance.options.parentInstance.element.attr('id'), 
								val = instance.menuitem.attr('data-value');
							params[id] = val;
							paramText[id] = text;
							instance.parentItems.find('span.indicator em').text(text);
							//selIndicator.text(text);
							ahrComplete = false;
							animComplete = false;
							$.getJSON(selectBoxes.actionUrl, params, getFilteredData);
							if($.browser.msie){
								dynWrapper.css('visibility', 'hidden');
								animComplete = true;
							} else {
								dynWrapper
									.stop()
									.animate({
										opacity: 0,
										height: 'hide'
									}, {
										duration: 1555,
										complete: function(){
											$('#filter fieldset').html('');
											animComplete = true;
											if(ahrComplete){
												getFilteredData(ahrComplete, 'success');
												animComplete = false;
											}
										}
									});
							}
						}
					});
				if($.browser.msie && $.browser.version < 8){
					selectReplacement.parent().css({
						width: '170px',
						'float': 'right'
					});
				}
			}
		}
		
		function generateList(data){
			data = data || selectBoxes.selects;
			$.each(data, createSelects);
		}
		
		if (typeof selectBoxes != 'undefined') {
			
			$('#filter').append('<fieldset></fieldset>');
			generateList();
			dynWrapper = $('#progress div.dyn-wrapper');
		}
	}
	
    function lingerieToc(){
		
		function switchTab(activeTab, activePanel, deactivatedTab){
			activeTab
				.parent()
				.addClass('active');
			deactivatedTab
				.parent()
				.removeClass('active');
		}
		
		$('#glossary-nav li.active a, #fabric-toc li.active a').addClass('active');
		
		$('#glossary-nav a').tab({
			'tabListSel': '#glossary-nav', 
			'activeClass': 'active',
			complete: switchTab
		});
		
		$('#fabric-toc a').tab({
			'activeClass': 'active',
			complete: switchTab
		});
		
		$('ol.toc-panel').each(function(){
			$('a', this).tab();
		});
	}
	 
	function mapUrlParamToData( param ) {
		switch( param ) {
			case 'uk/en':
				triumph_data.unit = 'cm';
				triumph_data.country = 'gb';
				break;
			case 'de/de':	
				triumph_data.unit = 'cm';
				triumph_data.country = 'de';
				break;
			default:
				triumph_data.unit = 'cm';
				triumph_data.country = 'de';
				break;
		}
	}
	
    function callOnReady(){
    	if(!$.browser.msie && typeof selectBoxes != 'undefined'){
    		$('body').addClass('scroll');
    	}
    	filterList();
    	$('select').rewriteSelect();
      initMenu();
      $.triumpgBgImg.init();
      zoomGallery.init();
      $('input[type=submit]').createLinkButton({
      	extraClass: 'input',
        innerLink: '<span class="tl"></span><span class="tr"></span><span class="bl"></span><span class="br"></span><span>$value</span>'
      });
      lingerieToc();
      $('div.box-2>div:nth-child(2n), div.box-3>div:nth-child(3n), div.box-4>div:nth-child(4n)').addClass('last');
      
      /* IhatE U */
      if ($.browser.msie) {
      	var overlay = $('#overlay'), opac = (overlay.is('.mod')) ? 0 : 0.5;
        overlay.css({
        	'opacity': opac
        });
      }
		
		// get country and unit from url if available
		var langInUrl = window.location.pathname.match(/\/[a-zA-Z]{2}\/[a-zA-Z]{2}\//);
		langInUrl = ( langInUrl != null ) ? langInUrl.toString().match(/[a-zA-Z]{2}\/[a-zA-Z]{2}/) : null;
		langInUrl = ( langInUrl != null ) ? langInUrl.toString() : '';
		var country_lang = ( jQuery.url.param("dest") ) ? jQuery.url.param("dest") : langInUrl;
		mapUrlParamToData( country_lang );
		
		// set error messages, loaded from html
		triumph_data.errorHandler.header = $('.warning h3').text();
		triumph_data.errorHandler.text = $('.warning p').text();
				
      $('#main').getFitted();
    }
    $(callOnReady);
})(jQuery);


