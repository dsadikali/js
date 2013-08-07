/**
 * @author alexander.farkas
 */
(function($){
	$.objScale = (function(){
		
		function getDim(obj){
			var ret = (obj.width && obj.height) ?
					obj :
					(obj.jquery)?
						{
							height: obj.innerHeight(),
							width: obj.innerWidth()
						} :
						{
							height: $(obj).innerHeight(),
							width: $(obj).innerWidth()
						};
			return ret; 
			
		}
		function scaleTo(img, num, side){
			var cur = getDim(img),
				percentage,
				reverseSide = (side == 'height') ?
					'width' :
					'height';
			
			percentage = cur[side] / num;
			return cur[reverseSide] / percentage;
		}
		
		function scaleHeightTo(img, height){
			return scaleTo(img, height, 'height');
		}
		
		function scaleWidthTo(img, width){
			return scaleTo(img, width, 'width');
		}
		
		function getMaxMinPos(objNum, containerNum, offset, normalNum){
			var ret = {};
			if(objNum < containerNum){
				ret['max'+offset] = (containerNum - objNum) / 2;
				ret['min'+offset] = ret['max'+offset];
				
			} else {
				ret['max'+offset] = 0;
				ret['min'+offset] = Math.abs(objNum - containerNum) * -1;
			}
			if(normalNum || normalNum === 0){
				ret[offset] = (normalNum < ret['min'+offset]) ?
					ret['min'+offset] :
					(normalNum > ret['max'+offset]) ?
					ret['max'+offset] :
					normalNum;
			}
			return ret;
		}
		
		function constrainMaxMinPositionForContainer(obj, container, cur){
			var ret = {};
			obj = getDim(obj);
			container = getDim(container);
			cur = cur ||
				{};
			$.extend(ret, getMaxMinPos(obj.height, container.height, 'top', cur.top), getMaxMinPos(obj.width, container.width, 'left', cur.left));
			return ret;
		}
		
		function scaleSidesIn(obj, container, opts){
			opts = $.extend({
				scaleToFit: false
			}, opts);
			var cur = getDim(obj),
				con = getDim(container),
				estimatetPer = con.height / con.width,
				curPer = cur.height / cur.width,
				ret = {};
			if(opts.scaleToFit !== estimatetPer > curPer){
				ret.width = con.width; 
				ret.height = scaleTo(obj, con.width, 'width');
				ret.margin = [(con.height - ret.height) / 2, (con.width - ret.width) / 2];
			} else {
				ret.width = scaleTo(obj, con.height, 'height'); 
				ret.height = con.height;
				ret.margin = [(con.height - ret.height) / 2, (con.width - ret.width) / 2];
			}
			
			return ret;
		}
		
		return {
			scaleWidthTo: scaleWidthTo,
			scaleHeightTo: scaleHeightTo,
			scaleSidesIn: scaleSidesIn,
			constrainMaxMinPositionForContainer: constrainMaxMinPositionForContainer
		};
	})();
})(jQuery);

/*
 * jQuery UI @VERSION
 *
 * Copyright (c) 2008 Paul Bakaus (ui.jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 *
 * $Id: ui.core.js 5587 2008-05-13 19:56:42Z scott.gonzalez $
 */
(function($) {

$.ui = {
	plugin: {
		add: function(module, option, set) {
			var proto = $.ui[module].prototype;
			for(var i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function(instance, name, args) {
			var set = instance.plugins[name];
			if(!set) { return; }
			
			for (var i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}	
	},
	cssCache: {},
	css: function(name) {
		if ($.ui.cssCache[name]) { return $.ui.cssCache[name]; }
		var tmp = $('<div class="ui-resizable-gen">').addClass(name).css({position:'absolute', top:'-5000px', left:'-5000px', display:'block'}).appendTo('body');
		
		//if (!$.browser.safari)
			//tmp.appendTo('body'); 
		
		//Opera and Safari set width and height to 0px instead of auto
		//Safari returns rgba(0,0,0,0) when bgcolor is not set
		$.ui.cssCache[name] = !!(
			(!(/auto|default/).test(tmp.css('cursor')) || (/^[1-9]/).test(tmp.css('height')) || (/^[1-9]/).test(tmp.css('width')) || 
			!(/none/).test(tmp.css('backgroundImage')) || !(/transparent|rgba\(0, 0, 0, 0\)/).test(tmp.css('backgroundColor')))
		);
		try { $('body').get(0).removeChild(tmp.get(0));	} catch(e){}
		return $.ui.cssCache[name];
	},
	disableSelection: function(e) {
		e.unselectable = "on";
		e.onselectstart = function() { return false; };
		if (e.style) { e.style.MozUserSelect = "none"; }
	},
	enableSelection: function(e) {
		e.unselectable = "off";
		e.onselectstart = function() { return true; };
		if (e.style) { e.style.MozUserSelect = ""; }
	},
	hasScroll: function(e, a) {
		var scroll = /top/.test(a||"top") ? 'scrollTop' : 'scrollLeft', has = false;
		if (e[scroll] > 0) { return true;}  e[scroll] = 1;
		has = e[scroll] > 0 ? true : false; e[scroll] = 0;
		return has;
	}
};


/** jQuery core modifications and additions **/

var _remove = $.fn.remove;
$.fn.remove = function() {
	$("*", this).add(this).trigger("remove");
	return _remove.apply(this, arguments );
};

// $.widget is a factory to create jQuery plugins
// taking some boilerplate code out of the plugin code
// created by Scott Gonz�lez and J�rn Zaefferer
function getter(namespace, plugin, method) {
	var methods = $[namespace][plugin].getter || [];
	methods = (typeof methods == "string" ? methods.split(/,?\s+/) : methods);
	return ($.inArray(method, methods) != -1);
}

var widgetPrototype = {
	init: function() {},
	destroy: function() {
		this.element.removeData(this.widgetName);
	},
	
	getData: function(key) {
		return this.options[key];
	},
	setData: function(key, value) {
		this.options[key] = value;
	},
	
	enable: function() {
		this.setData('disabled', false);
	},
	disable: function() {
		this.setData('disabled', true);
	}
};

$.widget = function(name, prototype) {
	var namespace = name.split(".")[0];
	name = name.split(".")[1];
	// create plugin method
	$.fn[name] = function(options) {
		var isMethodCall = (typeof options == 'string'),
			args = Array.prototype.slice.call(arguments, 1);
		
		if (isMethodCall && getter(namespace, name, options)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args) : undefined);
		}
		
		return this.each(function() {
			var instance = $.data(this, name);
			if (!instance) {
				$.data(this, name, new $[namespace][name](this, options));
			} else if (isMethodCall) {
				instance[options].apply(instance, args);
			}
		});
	};
	
	// create widget constructor
	$[namespace][name] = function(element, options) {
		var self = this;
		
		this.widgetName = name;
		
		this.options = $.extend({}, $[namespace][name].defaults, options);
		this.element = $(element)
			.bind('setData.' + name, function(e, key, value) {
				return self.setData(key, value);
			})
			.bind('getData.' + name, function(e, key) {
				return self.getData(key);
			})
			.bind('remove', function() {
				return self.destroy();
			});
		this.init();
	};
	
	// add widget prototype
	$[namespace][name].prototype = $.extend({}, widgetPrototype, prototype);
};


/** Mouse Interaction Plugin **/

$.ui.mouse = {
	mouseInit: function() {
		var self = this;
	
		this.element.bind('mousedown.'+this.widgetName, function(e) {
			return self.mouseDown(e);
		});
		
		// Prevent text selection in IE
		if ($.browser.msie) {
			this._mouseUnselectable = this.element.attr('unselectable');
			this.element.attr('unselectable', 'on');
		}
		
		this.started = false;
	},
	
	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
		
		// Restore text selection in IE
		($.browser.msie	&& this.element.attr('unselectable', this._mouseUnselectable));
	},
	
	mouseDown: function(e) {
		// we may have missed mouseup (out of window)
		(this._mouseStarted && this.mouseUp(e));
		this._mouseDownEvent = e;
		
		var self = this,
			btnIsLeft = (e.which == 1),
			elIsCancel = ($(e.target).is(this.options.cancel));
		if (!btnIsLeft || elIsCancel) {
			return true;
		}
		
		this._mouseDelayMet = !this.options.delay;
		if (!this._mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self._mouseDelayMet = true;
			}, this.options.delay);
		}
		
		// these delegates are required to keep context
		this._mouseMoveDelegate = function(e) {
			return self.mouseMove(e);
		};
		this._mouseUpDelegate = function(e) {
			return self.mouseUp(e);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);
		return false;
	},
	
	mouseMove: function(e) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !e.button) {
			return this.mouseUp(e);
		}
		if (this._mouseStarted) {
			this.mouseDrag(e);
			return false;
		}
		
		if (this.mouseDistanceMet(e) && this.mouseDelayMet(e)) {
			this._mouseStarted =
				(this.mouseStart(this._mouseDownEvent, e) !== false);
			(this._mouseStarted || this.mouseUp(e));
		}
		
		return !this._mouseStarted;
	},
	
	mouseUp: function(e) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
		
		if (this._mouseStarted) {
			this._mouseStarted = false;
			this.mouseStop(e);
		}
		
		return false;
	},
	
	mouseDistanceMet: function(e) {
		return (Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX),Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance);
	},
	
	mouseDelayMet: function(e) {
		return this._mouseDelayMet;
	},
	
	// These are placeholder methods, to be overriden by extending plugin
	mouseStart: function(e) {},
	mouseDrag: function(e) {},
	mouseStop: function(e) {}
};

$.ui.mouse.defaults = {
	cancel: null,
	distance: 0,
	delay: 0
};

})(jQuery);
/**
 * @author alexander.farkas
 */
(function($){
    $.fn.extend({
        tab: function(options){
            var args = Array.prototype.slice.call(arguments, 1), tabO;
            if(this.length){
				if (typeof options == "string") {
                    var tab = $.data(this[0], "accordion-tab");
                    tab[options].apply(tab, args);
                }
                else 
                    if (!$.data(this, "accordion-tab")) {
                         tabO = new $.tab(this, options);
                    }
			}
			return this.each(function(){
                if (!$.data(this, "accordion-tab") && tabO) {
                    $.data(this, "accordion-tab", tabO);
                }
                
            });
        }
    });
	$.tab = function(elms, s){
		this.s = $.extend({
                activeClass: 'on',
				lookToParent: false,
                firstActive: false,
                animationToggle: false,
                complete: function(){
                },
                closeOnClick: false,
                closeOther: true,
                onEvent: 'click',
                noAction: false,
                diaShow: false,
				tabListSel: false
            }, s);
			
			var that = this,
			tabID = 'tab-'+new Date().getTime(),
			ariaRoles,
			ariaStates;
			this.controls = elms;
			this.timerID = null;
			this.panels = [];
			if (this.s.diaShow) {
                this.timerID = setInterval(function(){
					that.diaShow.call(that);
				}, s.diaShow);
            }
			if(this.s.tabListSel){
				$(this.s.tabListSel).attr({'role': 'tablist'});
				ariaRoles = ['tab', 'tabpanel'];
			} else {
				ariaRoles = ['button', 'region'];
			}
			this.controls.each(function(i){
                var jElm = $(this),
				eId = jElm.attr('id');
				if(!eId){
					eId = tabID+i;
					jElm.attr({'id': eId});
				}
                that.panels.push($(that.getIDfromAnker(jElm)));
                that.panels[i].one('mouseover.tabsAperto focus.tabsAperto', function(){
                    clearInterval(that.timerID);
                }).attr({role: ariaRoles[1], 'aria-labelledby': eId, tabIndex: '-1', 'aria-hidden': 'false'})
					.css({
	                    outline: 'none'
	                });
                if (that.s.firstActive && i === 0) {
                    jElm.addClass(that.s.activeClass)
						.attr({'aria-selected': 'true'});
                }
                else
                    if (!jElm.is('.' + that.s.activeClass)) {
                        that.panels[i].css({
                            display: 'none'
                        }).attr({'aria-hidden': 'true'});
						jElm.attr({'aria-selected': 'false'});
                    } else {
						jElm.attr({'aria-selected': 'true'});
					}
                    jElm.bind(that.s.onEvent, function(e){
						clearInterval(this.timerID);
						that.showHide.call(that, this, e);
						return false;
					});
                
                jElm.bind('click.tabsAperto', function(e){
					that.clickHandler.call(that, this, e);
					return false;
				}).attr({role: ariaRoles[0]});				
			});
	};
	$.extend($.tab.prototype, {
		getIDfromAnker: function(jElm){
            var id = jElm.attr('href'), 
			fund = id.indexOf('#');
            id = (fund != -1) ? id.substr(fund) : false;
            return id;
        },
		diaShow: function(){
            var n, that = this;
            this.controls.each(function(i){
                if ($(this).is('.' + that.s.activeClass)) {
                    n = i + 1;
                    return false;
                }
            });
            var next = (this.controls[n]) ? this.controls[n] : this.controls[0];
            this.doAction(next);
        },
		showHide: function(elm, e) {
            var jElm = $(elm);
            if (!this.s.closeOnClick && jElm.is('.' + this.s.activeClass)) {
                return false;
            }
            var curActive = (this.s.closeOther) ? this.controls.filter('.' + this.s.activeClass) : $([]), curID = null, newID = this.getIDfromAnker(jElm);
            jElm.toggleClass(this.s.activeClass);
            if (!jElm.is('.' + this.s.activeClass)) {
                curActive = jElm;
            } else {
				jElm.attr({'aria-selected': 'true'});
			}
            if (curActive.length) {
                curActive.removeClass(this.s.activeClass);
				curActive.attr({'aria-selected': 'false'});
                curID = this.getIDfromAnker(curActive);
            }
            if (curID === newID) {
                newID = [];
                curActive = $([]);
            }
            var curActiveBlock = $(curID);
            var toActivateBlock = $(newID);
            if (!this.s.noAction) {
                if (!this.s.animationToggle) {
                    curActiveBlock.css({
                        display: 'none'
                    }).attr({'aria-hidden': 'true'});
                    toActivateBlock.css({
                        display: 'block'
                    }).attr({'aria-hidden': 'false'});
                    if (!e || (e && e.type == 'click')) {
						setTimeout(function(){
		                	toActivateBlock.focus();
		                }, 200);
                    }
                }
                else {
					
                    $.each(this.panels, function(){
                        this.stop(true, true);
                    });
                    curActiveBlock[this.s.animationToggle]().attr({'aria-hidden': 'true'});
                    toActivateBlock[this.s.animationToggle](function(){
                        if (e && e.type == 'click') {
							setTimeout(function(){
		                       toActivateBlock[0].focus();
		                    }, 200);
                        }
                    }).attr({'aria-hidden': 'false'});
                }
            }
            this.s.complete(jElm, toActivateBlock, curActive, curActiveBlock);
        },
		clickHandler: function(elm, e){
            var that = this;
			e.preventDefault();
			if (this.s.onEvent.indexOf('click') == -1) {
                var jElm = $(elm);
                setTimeout(function(){
                    $(that.getIDfromAnker(jElm)).focus();
                }, 9);
            }
            return false;
        }
	});
})(jQuery);


/**
 * @author alexander.farkas
 */
(function($){
    $.fn.extend({
        createLinkButton: function(s){
            s = $.extend({
                innerLink: '<span><span><span>$value</span></span></span>',
				extraClass: 'button',
				defaultSubmitText: 'abschicken'
            }, s);
            return this.each(function(){
				var jElm = $(this),
				classnames = this.className, 
				val = jElm.val();
				classnames = (classnames)?' class="' + classnames + '"':'';
				val = val || s.defaultSubmitText;
				
				var innerlink = s.innerLink.replace(/\$value/,val);
                var link = jElm.after('<a href="#"'+classnames+'>'+innerlink+'</a>').next('a').addClass(s.extraClass).attr('role', 'button');
				
				if($.browser.msie){
                	jElm.css({position: 'absolute', left: '-99999em', width: '0px', height: '0',overflow: 'hidden'})
						.attr({tabindex: '-1'});
				} else {
					jElm.css({display: 'none'});
				}
                link.bind('click.createLinkButton', function(){
					jElm.click();
                	return false;
				});
            });
        }
    });
})(jQuery);
(function($){
	var withinElement = function(parent, elem) {
		while (parent && parent != elem) {
			try {
				parent = parent.parentNode;
			} 
			catch (error) {
				parent = elem;
			}
		}
		return parent == elem;
	};
	
	var keyUp = 38, keyDown = 40, keyLeft = 37, keyRight = 39, keyStrg = 17, keySpace = 32, keyEnter = 13, keyShift = 16;
	
	$.widget("ui.menuitem", {
		init: function(){
			
			var that = this, 
			elm = this.element[0],
			o = this.options;
			this.timer = null;
			this.menuitem = $(o.menuitem,elm).filter(':first');
			this.update();
			var pI = that.options.parentInstance;
			
			that.element.bind('mousedown.menuitem', function(){
				pI.active = true;
				pI.show.call(pI, that);
			}).bind('mouseenter.menuitem', function(){
				if (pI.active || !pI.options.needToActivate) {
					pI.showTimeout.call(pI, that);
				}
			}).bind('mouseleave.menuitem', function(){
				 pI.hideTimeout.call(pI, that);
				 if(!pI.active){
				 	if(pI.options.needToActivate){
					 	pI.deRegisterKey.call(pI, that);
						pI.removeActive([]);
					}
				 }
				 
				clearTimeout(pI.blurTimer);
				pI.blurTimer = setTimeout(function(){
					
					pI.active = false;
					pI.removeActive([]);
				}, 99);
			});
			
			that.menuitem.attr({'role': 'menuitem', 'tabindex': '0'})
				.bind('focus.menuitem', function(e, from){
					 pI.addActive(that);
					 that.propagate('enter');
					 pI.registerKey.call(pI, that);
					 pI.clearHideDelay.call(pI, that);
					 pI.active = true;
				}).bind('blur.menuitem', function(e, from){
					pI.deRegisterKey.call(pI, that);
					if(e.originalEvent || (from && from == 'blur')){
						clearTimeout(pI.blurTimer);
						pI.blurTimer = setTimeout(function(){
							pI.active = false;
							pI.removeActive([]);
						}, 99);
					}
				}).bind('mouseenter.menuitem', function(){
					var elm = this;
						setTimeout(function(){
							var oZ = elm.style.zoom;
							elm.style.zoom = 1;
							//jQuery doubble-focus bug in ie
							if($.browser.msie){
								elm.focus();
							} else {
								$(elm).focus();
							}
							elm.style.zoom = oZ;
						}, 1);
					
				}).bind('click.menuitem',function(e){
					if(e.clientX || e.clientY){
						that.propagate('click');
					}
				});
				that.propagate('init');
			
		},
		update: function(){
			this.submenu = this.menuitem.next();
			this.cache = {};
			if(this.submenu.length){
				this.submenu.attr({'aria-hidden': true, 'role': 'menu'});
				this.menuitem.attr({'aria-haspopup': 'true'}).addClass(this.options.submenuClass);
			}
		},
		ui: function(){
            return {
                instance: this,
				parentInstance: this.options.parentInstance,
                options: this.options
            };
        },
        propagate: function(n){
            var args = [this.ui()];
			$.ui.plugin.call(this, n, args);
            this.element.triggerHandler("menuitem" + n, args);
			this.options.parentInstance.element.triggerHandler("menuitem" + n, [this]);
        },
		plugins: {}
	});

	$.ui.menuitem.defaults = {
		menuitem: '>[role^=menuitem],>a,>strong',
		submenuClass: 'hasSubmenu',
		bindItemClick: true,
		closeDelay: 300,
		openDelay: 250,
		keyUp: 'prevSiblingItem',
		keyDown: 'nextSiblingItem',
		keyLeft: 'parentItem',
		keyRight: 'childItem'
		
	};
		
	var menuProto = {
		init: function(){
			var o = this.options, that = this;
			this.itemOptions = $.extend({}, this.options);
			this.itemOptions.parentInstance = this;
			this.itemOptions.myMenu = this.element[0];
			this.cache = {};
			this.curOpen = [];
			this.initChildItems();
			this.initSubItems(this.element[0], this.itemOptions);
			var outerWidget = function(e){
				var t = e.originalTarget || e.target;
				if(!withinElement(t, that.element[0])){
					that.hideAll(true);
					that.active = false;
				}
			};
			$(document).bind('click.menubar', outerWidget);
		},
		initChildItems: function(){
			var o = this.options;
			this.element.attr({role: 'menu'}).addClass(o.menuClass);
			$(this.findItemsInMenu(this.element[0])).menuitem(this.itemOptions);
		},
		initSubItems: function(element){
			var o = this.options, that = this;
			$(o.selSubmenu, element).each(function(){
				var elm = this;
				function instantiateItems(){
					menuitems = that.findItemsInMenu(elm);
					that.itemOptions.myMenu = elm;
					$(menuitems).menuitem(that.itemOptions);
				}
				(o.lazyInstantiation?setTimeout(instantiateItems, 16):instantiateItems());
			});
		},
		findItemsInMenu: function(itemsParent){
			var found = false, nextParent = [], fitems = [], o = this.options;
			$(itemsParent).children().each(function(){
				var jElm = $(this);
				
				if(jElm.is(o.itemWrapper)){
					found = true;
					if(o.addPresentationRole && !this.getAttribute('role')){
						this.setAttribute('role', 'presentation');
					}
					fitems.push(this);
				} else {
					if(jElm.is(o.isSeperator)){
						jElm.attr({role: 'seperator'}).addClass(o.speratorClass);
					} else if(jElm.is(o.isRadiogroup)){
						jElm.attr({role: 'radiogroup'}).addClass(o.radiogroupClass);
					} else if(o.addPresentationRole && !this.getAttribute('role')){
						this.setAttribute('role', 'presentation');
					}
					nextParent.push(this);
				}
			});
			if(found){
				return fitems;
			}
			return this.findItemsInMenu(nextParent);
		},
		ui: function(){
            return {
                instance: this,
                options: this.options
            };
        },
        propagate: function(n, o){
            var args = [(o)?$.extend({},this.ui(),{menuitem: o}):this.ui()];
			$.ui.plugin.call(this, n, args);
            this.element.triggerHandler("menuitem" + n, args);
        },
		plugins: {},
		addActive: function(that){
			var p = this.getParents(that), mitem, o = this.options, curActive = [];
			that.menuitem.addClass(o.activeClass);
			curActive.push($.data(that.element[0]));
			p.each(function(){
				mitem = $.data(this, 'menuitem');
				curActive.push($.data(this));
				mitem.menuitem.removeClass(o.activeClass).addClass(o.activeParentsClass);
			});
			this.removeActive(curActive);
			
		},
		removeActive: function(curActive){
			var o = this.options;
			this.getSubItems().each(function(){
				if($.inArray($.data(this),curActive) == -1){
					mitem = $.data(this, 'menuitem');
					if(mitem){
						mitem.menuitem.removeClass(o.activeClass+' '+o.activeParentsClass);
					}
				}
			});
		},
		getSubItems: function(){
			return (this.cache.subitems = this.cache.subitems || $(this.options.itemWrapper,this.element[0]));
		},
		getParents: function(that){
			return (that.parentItems = that.parentItems || that.element.parents(that.options.itemWrapper));
		},
		clearHideDelay: function(that){
			clearTimeout(this.blurTimer);
			this.getParents(that).each(function(){
				clearTimeout($.data(this,'menuitem').timer);
			});
		},
		nextPrevSibling: function(that, num){
			var r, found = false;
			that.cache.siblings = that.cache.siblings || this.findItemsInMenu(that.options.myMenu);
			$.each(that.cache.siblings, function(i, item){
				if(item === that.element[0] && that.cache.siblings[i+num]){
					r = $(that.cache.siblings[i+num]);
					found = true;
					return false;
				}
			});
			if(!r || !r[0]){
				r = (num > 0)?
					$(that.cache.siblings[0]):
					$(that.cache.siblings[that.cache.siblings.length-1]);
			}
			return r.children('[role^=menuitem]:first');
		},
		nextPrevMenubarItem: function(that, num){
			var r, 
			instance = this,
			curItem,
			menubar = $(that.options.myMenu).parents('[role=menubar]:first');
			if(menubar[0]){
				var over = this.options.overClass;
				var menubarItems = this.findItemsInMenu(menubar[0]);
				$.each(menubarItems, function(){
					if($(this).is('.'+over)){
						curItem = $.data(this, 'menuitem');
						r = instance.nextPrevSibling(curItem, num);
						return false;
					}
				});
				if(curItem){
					var obj = this;
					setTimeout(function(){
						obj.hide.call(obj, curItem, true);
					}, 10);
				}
				
			}
			return r;
		},
		keyNav: {
			childItem: function(that){
				if(!that.cache.childItem){
					that.cache.childItem = that.submenu.find('[role^=menuitem]:first');
					if(!that.cache.childItem[0]){
						that.cache.childItem = this.nextPrevMenubarItem(that, 1);
					}
					
				}
				if(that.cache.childItem[0]){
					this.show(that);
				}
				return that.cache.childItem;
			},
			parentItem: function(that){
				if(!that.cache.parentItem){
					that.cache.parentItem = $(that.options.myMenu).prev();
					if(that.cache.parentItem.parent()[0] && $($.data(that.cache.parentItem.parent()[0], 'menuitem').options.myMenu).is('[role=menubar]')){
						that.cache.parentItem = this.nextPrevMenubarItem(that, -1);
					}
				}
				if(that.cache.parentItem[0]){
					this.getParents(that);
					if(that.parentItems[0]){
						var obj = this;
						setTimeout(function(){
							obj.hide.call(obj, $.data(that.parentItems[0], 'menuitem'), true, false, true);
						}, 20);
					}
				}
				return that.cache.parentItem;
			},
			nextSiblingItem: function(that){
				that.cache.nextItem = that.cache.nextItem || this.nextPrevSibling(that, 1);
				if(that.cache.nextItem){
					var obj = this;
					setTimeout(function(){
						obj.hide.call(obj, that, true, false, true);
					}, 20);
				}
				return that.cache.nextItem;
			},
			prevSiblingItem: function(that){
				that.cache.prevItem = that.cache.prevItem || this.nextPrevSibling(that, -1);
				if(that.cache.prevItem){
					var obj = this;
					setTimeout(function(){
						obj.hide.call(obj, that, true, false, true);
					}, 20);
				}
				return that.cache.prevItem;
			}
		},
		processKeyNav: function(e, that){
		 	var next, o = that.options;
			switch (e.keyCode) {
				case keyRight:
					next = this.keyNav[o.keyRight].call(this, that);
				break;
				case keyLeft:
					next = this.keyNav[o.keyLeft].call(this, that);
				break;
				case keyDown: 
					next = this.keyNav[o.keyDown].call(this, that);
				break;
				case keyUp:
					next = this.keyNav[o.keyUp].call(this, that);
				break;
				case keyEnter:
					that.propagate('click');
				break;
				default: 
					if(that.keyHandlers && that.keyHandlers[e.keyCode]){
						next = that.keyHandlers[e.keyCode](e);
					}
					
				break;
			}
			if(next && next[0]){
				this.deRegisterKey();
				setTimeout(function(){
					that.menuitem.triggerHandler('blur.menuitem', 'blur');
					next.focus();
				},1);
				e.preventDefault();
				return false;
			}
			return true;
		},
		registerKey: function(that){
			var thisO = this;
			$(document).unbind('keydown.menuitem').bind('keydown.menuitem', function(e){
				 return thisO.processKeyNav.call(thisO, e, that);
			});
		},
		deRegisterKey: function(){
			$(document).unbind('keydown.menuitem');
		},
		getItemWidget: function(elm){
			if(elm.jquery){
				elm = elm[0];
			}
			return $.data(elm, 'menuitem');
		},
		openFocus: function(that, close){
			if(!that.widgetName){
				that = this.getItemWidget(that);
			}
			this.active = true;
			if(close){
				this.hideAll();
			}
			this.show(that);
			setTimeout(function(){
				that.menuitem.focus();
			}, 1);
		},
		show: function(that, anim){
			clearTimeout(that.timer);
			var status = that.submenu.attr('aria-hidden'),
			o = this.options;
			this.hideAll();
			if((!o.needToActivate || this.active) && (status && status != 'false')){
				this.propagate('beforeOpen', that);
				anim = anim || o.showAnim;
				if(anim){
					anim.call(that.submenu);
				}
				that.element.addClass(o.overClass);
				that.submenu.attr({'aria-hidden': false});
			}
		},
		showTimeout: function(that, delay){
		 	delay = delay || that.options.openDelay;
			clearTimeout(that.timer);
			this.clearHideDelay(that);
			
			var thisO = this;
			that.timer = setTimeout(function(){
				thisO.show(that);
				setTimeout(function(){
					thisO.clearHideDelay.call(thisO, that);
				}, 20);
			}, delay);
		},
		hideTimeout: function(that, delay, f){
			delay = delay || that.options.closeDelay;
			clearTimeout(that.timer);
			var thisO = this;
			if(this.options.closeOnLeave || f){
				that.timer = setTimeout(function(){
					thisO.hide(that, true);
				}, delay);
			}
		},
		hideAll: function(force){
			var that = this, o = this.options;
			this.getSubItems().each(function(){ 
				if(this.className.indexOf(o.overClass) != -1){
					that.hide($.data(this,'menuitem'), force);
				}
			});
		},
		hide: function(that, force, anim, focus){
			var o = this.options;
			if(force || !that.menuitem.is('.'+o.activeParentsClass+', .'+o.activeClass)){
				anim = anim || o.hideAnim;
				((anim)?anim.call(that.submenu, that):that.element.removeClass(o.overClass));
				that.submenu.attr({'aria-hidden': true});
				this.propagate('afterClose', that); 
				if(force && !focus){
					that.menuitem.removeClass(o.activeParentsClass+' '+o.activeClass);
				}
			}
		}
	};
	
	$.widget("ui.menu", menuProto);

	$.ui.menu.defaults = {
		/* Selector */
		selSubmenu: '[role=menu],ul,ol',
		/* is*/
		itemWrapper: 'li',
		isSeperator: '[role=seperator],.seperator',
		isRadiogroup: '.radiogroup, [role=radiogroup]',
		/* CSS-Classes */
		speratorClass: 'seperator',
		radiogroupClass: 'radiogroup',
		overClass: 'over',
		menuClass: 'ui-menu',
		activeParentsClass: 'active-parent',
		activeClass: 'active',
		/* cfg */
		addPresentationRole: true,
		needToActivate: false,
		closeOnLeave: true,
		showAnim: false,
		lazyInstantiation: true
	};
	
	
	var menubarProto = $.extend({}, menuProto, {
		initChildItems: function(){
			var o = this.options;
			this.menubarItemOptions = $.extend({}, this.itemOptions, $.ui.menubar.itemDefaults, o.menubarItem);
			this.element.attr({role: 'menubar'}).addClass(o.menuClass);
			$(this.findItemsInMenu(this.element[0])).menuitem(this.menubarItemOptions);
		}
	});
	
	$.widget("ui.menubar", menubarProto);
	
	$.ui.menubar.itemDefaults = {
		openDelay: 9,
		keyUp: 'parentItem',
		keyDown: 'childItem',
		keyLeft: 'prevSiblingItem',
		keyRight: 'nextSiblingItem'
	};
		
	$.ui.menubar.defaults = $.extend({}, $.ui.menu.defaults, 
		{
			menuClass: 'ui-menubar',
			needToActivate: true,
			closeOnLeave: false,
			menubarItem: {}
		}
	);
})(jQuery);

/**
 * @author trixta
 * @version 0.8 alpha
 * 
 * ToDo für 1.0 beta
 * 
 * 2. Verhältnis zwischen menuitem und menu/menubar konsistenter machen
 * ---
 * version 1.0 final:
 * 6. Konsistenz zwischen Klassen und Bugfixes
 * ---
 * next ToDo:
 * 2. Usermode/Contrastmode - Unterstützung (insbesondere Radiobuttons, Checkboxen, evtl. aber auch Seperator und Unertmenü-Anzeige (Anwender -> Beispiel) 
 */
(function($){

	$.extend($.ui.menuitem.defaults, {
		radio_checkbox: true,
		isCheckbox: '.checkbox,[role=menuitemcheckbox]',
		isRadio: '.radio,[role=menuitemradio]',
		checkboxClass: 'checkbox',
		radioClass: 'radio',
		checkedClass: 'checked',
		checkedRadioClass: 'checked-radio',
		checkedCheckboxClass: 'checked-checkbox',
		hideAfterClick: true
		
	});
	var checkRadioProto = {
		uncheckOption: function(elm){
			var instance = $.data(elm, 'menuitem'),
			o = instance.options;
			if(instance.checked){
				instance.menuitem.attr({'aria-checked': false}).removeClass(o.checkedClass);
				instance.checked = false;
				instance.propagate('unchecked');
				instance.propagate('change');
			}
			if(o.hideAfterClick){
				this.hideAll(true);
				this.active = false;
			}
			return false;
		},
		activateRadio: function(elm){
			var instance = $.data(elm, 'menuitem'),
			that = this;
			if (!instance.checked) {
				instance.cache.Radiosiblings = instance.cache.Radiosiblings || instance.element.siblings(':has([role=menuitemradio])');
				this.checkOption(elm);
				instance.cache.Radiosiblings.each(function(){
					that.uncheckOption.call(that, this);
				});
			}
		},
		checkOption: function(elm){
			var instance = $.data(elm, 'menuitem'),
			o = instance.options;
			if(!instance.checked){
				instance.menuitem.attr({'aria-checked': true}).addClass(o.checkedClass);
				instance.checked = true;
				instance.propagate('checked');
				instance.propagate('change');
			}
			if(o.hideAfterClick){
				this.hideAll(true);
				this.active = false;
			}
			return false;
		},
		toggleOption: function(elm){
			var instance = $.data(elm, 'menuitem');
			this[(instance.checked)?'uncheckOption':'checkOption'](elm);
			return false;
		}
	};
	
	$.extend($.ui.menu.prototype, checkRadioProto);
	$.extend($.ui.menubar.prototype, checkRadioProto);
	
	$.ui.plugin.add("menuitem", "radio_checkbox", {
		init: function(ui){
			 var jElm = ui.instance.menuitem,
			 o = ui.instance.options;
			 if(jElm.is(o.isCheckbox+','+o.isRadio)){
				var clickOption, that = this;
				if(jElm.is(o.isCheckbox)){
					clickOption = function(e){
						ui.parentInstance.toggleOption.call(ui.parentInstance, ui.instance.element[0]);
						e.preventDefault();
					};
					o.checkedClass = o.checkedCheckboxClass;
					jElm.addClass(o.checkboxClass).attr({role: 'menuitemcheckbox'});
				} else {
					clickOption = function(e){
						ui.parentInstance.activateRadio.call(ui.parentInstance, ui.instance.element[0]);
						e.preventDefault();
					};
					
					jElm.addClass(o.radioClass).attr({role: 'menuitemradio'});
					o.checkedClass = o.checkedRadioClass;
				}
				o.isChecked = '.'+o.checkedClass+',[aria-checked=true]';
				if(jElm.is(o.isChecked)){
					jElm.addClass(o.checkedClass).attr({'aria-checked': true});
					ui.instance.checked = true;
				} else {
					jElm.removeClass(o.checkedClass).attr({'aria-checked': false});
					ui.instance.checked = false;
				}
				ui.instance.element.bind('menuitemclick', clickOption);
			 }
		}
	});
	
	
})(jQuery);

(function($){
	/**
	 * @id locationModule
	 */
	$.location = (function(){
		/**
		 * @id querys
		 */
		var querys = {},
		/**
		 * @id paths
		 */
			paths = {},
			triedXtimes = 0,
			tryXtimes = 10;
		
		/**
		 * @id createPathRelativeTo
		 */
		function createPathRelativeTo(relPath, basePath, pathName){
			
			var relParts = relPath.split('../'),
				baseParts = basePath.split('/'),
				path;
				
			if(relPath.match(/\.\.\/$/)){
				relParts.pop();
			} else if(relPath.match(/\/$/)) {
				relParts[relParts.length-1] = relParts[relParts.length-1].replace(/\/$/, '');
			}
			
			if(relParts[relParts.length-1].match(/\.\.\/$/)){
				relParts.pop();
			}
			
			if(!baseParts[baseParts.length-1]){
				baseParts.pop();
			}
			
			$.each(relParts, function(i, part){
				if(!part){
					baseParts.pop();
				} else {
					baseParts.push(part);
				}
			});
			
			path = baseParts.join('/');
			
			if(path){
				path += '/';
			}
			
			if(pathName && !paths[pathName]){
				paths[pathName]	= path;
			} else if(pathName && paths[pathName]) {
				throw 'Pathname "'+pathName+'" already exists. Try another name for your path!';
			}
			return path;
		}
		/**
		 * @id createPaths
		 */
		function createPaths(jsName, opts){
			var src = $('script[src*='+jsName+']').attr('src'),
				pathMatch;
			opts = $.extend({relativeCSS: '../css/', relativeImg: '../img/', relativeBase: '../'}, opts);
			
			if(src){
				pathMatch = new RegExp('(\.*)'+jsName);
				paths.js = pathMatch.exec(src);
				paths.js = (paths.js && paths.js[0] && (paths.js[1] || paths.js[1] === '')) ?
					paths.js[1] :
					null;
			}
			
			if(triedXtimes < tryXtimes && (!paths.js && paths.js !== '')){
				triedXtimes++;
				if(triedXtimes < tryXtimes-1){
					setTimeout(function(){
						createPaths(jsName, opts);
					}, 2);
				} else {
					$(function(){
						createPaths(jsName, opts);
					});
				}
			} else if(paths.js || paths.js === ''){
				createPathRelativeTo(opts.relativeBase, paths.js, 'base');
				createPathRelativeTo(opts.relativeCSS, paths.js, 'css');
				createPathRelativeTo(opts.relativeImg, paths.js, 'img');
			} else {
				throw 'Could not determine the paths! Are you sure that you entered the correct name of the JS-file? ("'+jsName+'")';
			}
			return paths;
		}
		
		/**
		 * @id issetQuery
		 */
		function issetQuery(name){
			return (querys[name] || querys[name] === '');
		}
		/**
		 * @id strToObj
		 */
		function strToObj(str, obj){
			str = str ||
				location.search;
			obj = obj ||
				 querys;
			str = str.replace(/^\?/,'').replace(/&amp;/g, '&').split(/&/);
			$.each(str, function(i, param){
				queryPair = param.split(/\=/);
				obj[queryPair[0]] = (queryPair[1]) ?
					queryPair[1] :
					'';
			});
			return obj;
		}
				
		strToObj();
		
		return {
			querys: querys,
			issetQuery: issetQuery,
			createPaths: createPaths,
			createPathRelativeTo: createPathRelativeTo,
			paths: paths,
			strToObj: strToObj
		};
	})();
})(jQuery);

/*
jQuery Url Plugin
	* Version 1.0
	* 2009-03-22 19:30:05
	* URL: http://ajaxcssblog.com/jquery/url-read-get-variables/
	* Description: jQuery Url Plugin gives the ability to read GET parameters from the actual URL
	* Author: Matthias Jäggli
	* Copyright: Copyright (c) 2009 Matthias Jäggli under dual MIT/GPL license.
*/
(function ($) {
	$.url = {};
	$.extend($.url, {
		_params: {},
		init: function(){
			var paramsRaw = "";
			try{
				paramsRaw = 
					(document.location.href.split("?", 2)[1] || "").split("#")[0].split("&") || [];
				for(var i = 0; i< paramsRaw.length; i++){
					var single = paramsRaw[i].split("=");
					if(single[0])
						this._params[single[0]] = unescape(single[1]);
				}
			}
			catch(e){
				alert(e);
			}
		},
		param: function(name){
			return this._params[name] || "";
		},
		paramAll: function(){
			return this._params;
		}
	});
	$.url.init();
})(jQuery);