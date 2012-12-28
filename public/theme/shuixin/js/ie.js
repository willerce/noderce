/**
 * Isotope v1.5.19
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */


(function(window,$,undefined){'use strict';var document=window.document;var Modernizr=window.Modernizr;var capitalize=function(str){return str.charAt(0).toUpperCase()+str.slice(1);};var prefixes='Moz Webkit O Ms'.split(' ');var getStyleProperty=function(propName){var style=document.documentElement.style,prefixed;if(typeof style[propName]==='string'){return propName;}
propName=capitalize(propName);for(var i=0,len=prefixes.length;i<len;i++){prefixed=prefixes[i]+propName;if(typeof style[prefixed]==='string'){return prefixed;}}};var transformProp=getStyleProperty('transform'),transitionProp=getStyleProperty('transitionProperty');var tests={csstransforms:function(){return!!transformProp;},csstransforms3d:function(){var test=!!getStyleProperty('perspective');if(test){var vendorCSSPrefixes=' -o- -moz- -ms- -webkit- -khtml- '.split(' '),mediaQuery='@media ('+vendorCSSPrefixes.join('transform-3d),(')+'modernizr)',$style=$('<style>'+mediaQuery+'{#modernizr{height:3px}}'+'</style>').appendTo('head'),$div=$('<div id="modernizr" />').appendTo('html');test=$div.height()===3;$div.remove();$style.remove();}
return test;},csstransitions:function(){return!!transitionProp;}};var testName;if(Modernizr){for(testName in tests){if(!Modernizr.hasOwnProperty(testName)){Modernizr.addTest(testName,tests[testName]);}}}else{Modernizr=window.Modernizr={_version:'1.6ish: miniModernizr for Isotope'};var classes=' ';var result;for(testName in tests){result=tests[testName]();Modernizr[testName]=result;classes+=' '+(result?'':'no-')+testName;}
$('html').addClass(classes);}
if(Modernizr.csstransforms){var transformFnNotations=Modernizr.csstransforms3d?{translate:function(position){return'translate3d('+position[0]+'px, '+position[1]+'px, 0) ';},scale:function(scale){return'scale3d('+scale+', '+scale+', 1) ';}}:{translate:function(position){return'translate('+position[0]+'px, '+position[1]+'px) ';},scale:function(scale){return'scale('+scale+') ';}};var setIsoTransform=function(elem,name,value){var data=$.data(elem,'isoTransform')||{},newData={},fnName,transformObj={},transformValue;newData[name]=value;$.extend(data,newData);for(fnName in data){transformValue=data[fnName];transformObj[fnName]=transformFnNotations[fnName](transformValue);}
var translateFn=transformObj.translate||'',scaleFn=transformObj.scale||'',valueFns=translateFn+scaleFn;$.data(elem,'isoTransform',data);elem.style[transformProp]=valueFns;};$.cssNumber.scale=true;$.cssHooks.scale={set:function(elem,value){setIsoTransform(elem,'scale',value);},get:function(elem,computed){var transform=$.data(elem,'isoTransform');return transform&&transform.scale?transform.scale:1;}};$.fx.step.scale=function(fx){$.cssHooks.scale.set(fx.elem,fx.now+fx.unit);};$.cssNumber.translate=true;$.cssHooks.translate={set:function(elem,value){setIsoTransform(elem,'translate',value);},get:function(elem,computed){var transform=$.data(elem,'isoTransform');return transform&&transform.translate?transform.translate:[0,0];}};}
var transitionEndEvent,transitionDurProp;if(Modernizr.csstransitions){transitionEndEvent={WebkitTransitionProperty:'webkitTransitionEnd',MozTransitionProperty:'transitionend',OTransitionProperty:'oTransitionEnd',transitionProperty:'transitionEnd'}[transitionProp];transitionDurProp=getStyleProperty('transitionDuration');}
var $event=$.event,resizeTimeout;$event.special.smartresize={setup:function(){$(this).bind("resize",$event.special.smartresize.handler);},teardown:function(){$(this).unbind("resize",$event.special.smartresize.handler);},handler:function(event,execAsap){var context=this,args=arguments;event.type="smartresize";if(resizeTimeout){clearTimeout(resizeTimeout);}
resizeTimeout=setTimeout(function(){jQuery.event.handle.apply(context,args);},execAsap==="execAsap"?0:100);}};$.fn.smartresize=function(fn){return fn?this.bind("smartresize",fn):this.trigger("smartresize",["execAsap"]);};$.Isotope=function(options,element,callback){this.element=$(element);this._create(options);this._init(callback);};var isoContainerStyles=['width','height'];var $window=$(window);$.Isotope.settings={resizable:true,layoutMode:'masonry',containerClass:'isotope',itemClass:'isotope-item',hiddenClass:'isotope-hidden',hiddenStyle:{opacity:0,scale:0.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:'relative',overflow:'hidden'},animationEngine:'best-available',animationOptions:{queue:false,duration:800},sortBy:'original-order',sortAscending:true,resizesContainer:true,transformsEnabled:!$.browser.opera,itemPositionDataEnabled:false};$.Isotope.prototype={_create:function(options){this.options=$.extend({},$.Isotope.settings,options);this.styleQueue=[];this.elemCount=0;var elemStyle=this.element[0].style;this.originalStyle={};var containerStyles=isoContainerStyles.slice(0);for(var prop in this.options.containerStyle){containerStyles.push(prop);}
for(var i=0,len=containerStyles.length;i<len;i++){prop=containerStyles[i];this.originalStyle[prop]=elemStyle[prop]||'';}
this.element.css(this.options.containerStyle);this._updateAnimationEngine();this._updateUsingTransforms();var originalOrderSorter={'original-order':function($elem,instance){instance.elemCount++;return instance.elemCount;},random:function(){return Math.random();}};this.options.getSortData=$.extend(this.options.getSortData,originalOrderSorter);this.reloadItems();this.offset={left:parseInt((this.element.css('padding-left')||0),10),top:parseInt((this.element.css('padding-top')||0),10)};var instance=this;setTimeout(function(){instance.element.addClass(instance.options.containerClass);},0);if(this.options.resizable){$window.bind('smartresize.isotope',function(){instance.resize();});}
this.element.delegate('.'+this.options.hiddenClass,'click',function(){return false;});},_getAtoms:function($elems){var selector=this.options.itemSelector,$atoms=selector?$elems.filter(selector).add($elems.find(selector)):$elems,atomStyle={position:'absolute'};if(this.usingTransforms){atomStyle.left=0;atomStyle.top=0;}
$atoms.css(atomStyle).addClass(this.options.itemClass);this.updateSortData($atoms,true);return $atoms;},_init:function(callback){this.$filteredAtoms=this._filter(this.$allAtoms);this._sort();this.reLayout(callback);},option:function(opts){if($.isPlainObject(opts)){this.options=$.extend(true,this.options,opts);var updateOptionFn;for(var optionName in opts){updateOptionFn='_update'+capitalize(optionName);if(this[updateOptionFn]){this[updateOptionFn]();}}}},_updateAnimationEngine:function(){var animationEngine=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,'');var isUsingJQueryAnimation;switch(animationEngine){case'css':case'none':isUsingJQueryAnimation=false;break;case'jquery':isUsingJQueryAnimation=true;break;default:isUsingJQueryAnimation=!Modernizr.csstransitions;}
this.isUsingJQueryAnimation=isUsingJQueryAnimation;this._updateUsingTransforms();},_updateTransformsEnabled:function(){this._updateUsingTransforms();},_updateUsingTransforms:function(){var usingTransforms=this.usingTransforms=this.options.transformsEnabled&&Modernizr.csstransforms&&Modernizr.csstransitions&&!this.isUsingJQueryAnimation;if(!usingTransforms){delete this.options.hiddenStyle.scale;delete this.options.visibleStyle.scale;}
this.getPositionStyles=usingTransforms?this._translate:this._positionAbs;},_filter:function($atoms){var filter=this.options.filter===''?'*':this.options.filter;if(!filter){return $atoms;}
var hiddenClass=this.options.hiddenClass,hiddenSelector='.'+hiddenClass,$hiddenAtoms=$atoms.filter(hiddenSelector),$atomsToShow=$hiddenAtoms;if(filter!=='*'){$atomsToShow=$hiddenAtoms.filter(filter);var $atomsToHide=$atoms.not(hiddenSelector).not(filter).addClass(hiddenClass);this.styleQueue.push({$el:$atomsToHide,style:this.options.hiddenStyle});}
this.styleQueue.push({$el:$atomsToShow,style:this.options.visibleStyle});$atomsToShow.removeClass(hiddenClass);return $atoms.filter(filter);},updateSortData:function($atoms,isIncrementingElemCount){var instance=this,getSortData=this.options.getSortData,$this,sortData;$atoms.each(function(){$this=$(this);sortData={};for(var key in getSortData){if(!isIncrementingElemCount&&key==='original-order'){sortData[key]=$.data(this,'isotope-sort-data')[key];}else{sortData[key]=getSortData[key]($this,instance);}}
$.data(this,'isotope-sort-data',sortData);});},_sort:function(){var sortBy=this.options.sortBy,getSorter=this._getSorter,sortDir=this.options.sortAscending?1:-1,sortFn=function(alpha,beta){var a=getSorter(alpha,sortBy),b=getSorter(beta,sortBy);if(a===b&&sortBy!=='original-order'){a=getSorter(alpha,'original-order');b=getSorter(beta,'original-order');}
return((a>b)?1:(a<b)?-1:0)*sortDir;};this.$filteredAtoms.sort(sortFn);},_getSorter:function(elem,sortBy){return $.data(elem,'isotope-sort-data')[sortBy];},_translate:function(x,y){return{translate:[x,y]};},_positionAbs:function(x,y){return{left:x,top:y};},_pushPosition:function($elem,x,y){x=Math.round(x+this.offset.left);y=Math.round(y+this.offset.top);var position=this.getPositionStyles(x,y);this.styleQueue.push({$el:$elem,style:position});if(this.options.itemPositionDataEnabled){$elem.data('isotope-item-position',{x:x,y:y});}},layout:function($elems,callback){var layoutMode=this.options.layoutMode;this['_'+layoutMode+'Layout']($elems);if(this.options.resizesContainer){var containerStyle=this['_'+layoutMode+'GetContainerSize']();this.styleQueue.push({$el:this.element,style:containerStyle});}
this._processStyleQueue($elems,callback);this.isLaidOut=true;},_processStyleQueue:function($elems,callback){var styleFn=!this.isLaidOut?'css':(this.isUsingJQueryAnimation?'animate':'css'),animOpts=this.options.animationOptions,onLayout=this.options.onLayout,objStyleFn,processor,triggerCallbackNow,callbackFn;processor=function(i,obj){obj.$el[styleFn](obj.style,animOpts);};if(this._isInserting&&this.isUsingJQueryAnimation){processor=function(i,obj){objStyleFn=obj.$el.hasClass('no-transition')?'css':styleFn;obj.$el[objStyleFn](obj.style,animOpts);};}else if(callback||onLayout||animOpts.complete){var isCallbackTriggered=false,callbacks=[callback,onLayout,animOpts.complete],instance=this;triggerCallbackNow=true;callbackFn=function(){if(isCallbackTriggered){return;}
var hollaback;for(var i=0,len=callbacks.length;i<len;i++){hollaback=callbacks[i];if(typeof hollaback==='function'){hollaback.call(instance.element,$elems,instance);}}
isCallbackTriggered=true;};if(this.isUsingJQueryAnimation&&styleFn==='animate'){animOpts.complete=callbackFn;triggerCallbackNow=false;}else if(Modernizr.csstransitions){var i=0,firstItem=this.styleQueue[0],testElem=firstItem&&firstItem.$el,styleObj;while(!testElem||!testElem.length){styleObj=this.styleQueue[i++];if(!styleObj){return;}
testElem=styleObj.$el;}
var duration=parseFloat(getComputedStyle(testElem[0])[transitionDurProp]);if(duration>0){processor=function(i,obj){obj.$el[styleFn](obj.style,animOpts).one(transitionEndEvent,callbackFn);};triggerCallbackNow=false;}}}
$.each(this.styleQueue,processor);if(triggerCallbackNow){callbackFn();}
this.styleQueue=[];},resize:function(){if(this['_'+this.options.layoutMode+'ResizeChanged']()){this.reLayout();}},reLayout:function(callback){this['_'+this.options.layoutMode+'Reset']();this.layout(this.$filteredAtoms,callback);},addItems:function($content,callback){var $newAtoms=this._getAtoms($content);this.$allAtoms=this.$allAtoms.add($newAtoms);if(callback){callback($newAtoms);}},insert:function($content,callback){this.element.append($content);var instance=this;this.addItems($content,function($newAtoms){var $newFilteredAtoms=instance._filter($newAtoms);instance._addHideAppended($newFilteredAtoms);instance._sort();instance.reLayout();instance._revealAppended($newFilteredAtoms,callback);});},appended:function($content,callback){var instance=this;this.addItems($content,function($newAtoms){instance._addHideAppended($newAtoms);instance.layout($newAtoms);instance._revealAppended($newAtoms,callback);});},_addHideAppended:function($newAtoms){this.$filteredAtoms=this.$filteredAtoms.add($newAtoms);$newAtoms.addClass('no-transition');this._isInserting=true;this.styleQueue.push({$el:$newAtoms,style:this.options.hiddenStyle});},_revealAppended:function($newAtoms,callback){var instance=this;setTimeout(function(){$newAtoms.removeClass('no-transition');instance.styleQueue.push({$el:$newAtoms,style:instance.options.visibleStyle});instance._isInserting=false;instance._processStyleQueue($newAtoms,callback);},10);},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children());},remove:function($content,callback){var instance=this;var removeContent=function(){instance.$allAtoms=instance.$allAtoms.not($content);$content.remove();if(callback){callback.call(instance.element);}};if($content.filter(':not(.'+this.options.hiddenClass+')').length){this.styleQueue.push({$el:$content,style:this.options.hiddenStyle});this.$filteredAtoms=this.$filteredAtoms.not($content);this._sort();this.reLayout(removeContent);}else{removeContent();}},shuffle:function(callback){this.updateSortData(this.$allAtoms);this.options.sortBy='random';this._sort();this.reLayout(callback);},destroy:function(){var usingTransforms=this.usingTransforms;var options=this.options;this.$allAtoms.removeClass(options.hiddenClass+' '+options.itemClass).each(function(){var style=this.style;style.position='';style.top='';style.left='';style.opacity='';if(usingTransforms){style[transformProp]='';}});var elemStyle=this.element[0].style;for(var prop in this.originalStyle){elemStyle[prop]=this.originalStyle[prop];}
this.element.unbind('.isotope').undelegate('.'+options.hiddenClass,'click').removeClass(options.containerClass).removeData('isotope');$window.unbind('.isotope');},_getSegments:function(isRows){var namespace=this.options.layoutMode,measure=isRows?'rowHeight':'columnWidth',size=isRows?'height':'width',segmentsName=isRows?'rows':'cols',containerSize=this.element[size](),segments,segmentSize=this.options[namespace]&&this.options[namespace][measure]||this.$filteredAtoms['outer'+capitalize(size)](true)||containerSize;segments=Math.floor(containerSize/segmentSize);segments=Math.max(segments,1);this[namespace][segmentsName]=segments;this[namespace][measure]=segmentSize;},_checkIfSegmentsChanged:function(isRows){var namespace=this.options.layoutMode,segmentsName=isRows?'rows':'cols',prevSegments=this[namespace][segmentsName];this._getSegments(isRows);return(this[namespace][segmentsName]!==prevSegments);},_masonryReset:function(){this.masonry={};this._getSegments();var i=this.masonry.cols;this.masonry.colYs=[];while(i--){this.masonry.colYs.push(0);}},_masonryLayout:function($elems){var instance=this,props=instance.masonry;$elems.each(function(){var $this=$(this),colSpan=Math.ceil($this.outerWidth(true)/props.columnWidth);colSpan=Math.min(colSpan,props.cols);if(colSpan===1){instance._masonryPlaceBrick($this,props.colYs);}else{var groupCount=props.cols+1-colSpan,groupY=[],groupColY,i;for(i=0;i<groupCount;i++){groupColY=props.colYs.slice(i,i+colSpan);groupY[i]=Math.max.apply(Math,groupColY);}
instance._masonryPlaceBrick($this,groupY);}});},_masonryPlaceBrick:function($brick,setY){var minimumY=Math.min.apply(Math,setY),shortCol=0;for(var i=0,len=setY.length;i<len;i++){if(setY[i]===minimumY){shortCol=i;break;}}
var x=this.masonry.columnWidth*shortCol,y=minimumY;this._pushPosition($brick,x,y);var setHeight=minimumY+$brick.outerHeight(true),setSpan=this.masonry.cols+1-len;for(i=0;i<setSpan;i++){this.masonry.colYs[shortCol+i]=setHeight;}},_masonryGetContainerSize:function(){var containerHeight=Math.max.apply(Math,this.masonry.colYs);return{height:containerHeight};},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged();},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0};},_fitRowsLayout:function($elems){var instance=this,containerWidth=this.element.width(),props=this.fitRows;$elems.each(function(){var $this=$(this),atomW=$this.outerWidth(true),atomH=$this.outerHeight(true);if(props.x!==0&&atomW+props.x>containerWidth){props.x=0;props.y=props.height;}
instance._pushPosition($this,props.x,props.y);props.height=Math.max(props.y+atomH,props.height);props.x+=atomW;});},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height};},_fitRowsResizeChanged:function(){return true;},_cellsByRowReset:function(){this.cellsByRow={index:0};this._getSegments();this._getSegments(true);},_cellsByRowLayout:function($elems){var instance=this,props=this.cellsByRow;$elems.each(function(){var $this=$(this),col=props.index%props.cols,row=Math.floor(props.index/props.cols),x=(col+0.5)*props.columnWidth-$this.outerWidth(true)/2,y=(row+0.5)*props.rowHeight-$this.outerHeight(true)/2;instance._pushPosition($this,x,y);props.index++;});},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top};},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged();},_straightDownReset:function(){this.straightDown={y:0};},_straightDownLayout:function($elems){var instance=this;$elems.each(function(i){var $this=$(this);instance._pushPosition($this,0,instance.straightDown.y);instance.straightDown.y+=$this.outerHeight(true);});},_straightDownGetContainerSize:function(){return{height:this.straightDown.y};},_straightDownResizeChanged:function(){return true;},_masonryHorizontalReset:function(){this.masonryHorizontal={};this._getSegments(true);var i=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(i--){this.masonryHorizontal.rowXs.push(0);}},_masonryHorizontalLayout:function($elems){var instance=this,props=instance.masonryHorizontal;$elems.each(function(){var $this=$(this),rowSpan=Math.ceil($this.outerHeight(true)/props.rowHeight);rowSpan=Math.min(rowSpan,props.rows);if(rowSpan===1){instance._masonryHorizontalPlaceBrick($this,props.rowXs);}else{var groupCount=props.rows+1-rowSpan,groupX=[],groupRowX,i;for(i=0;i<groupCount;i++){groupRowX=props.rowXs.slice(i,i+rowSpan);groupX[i]=Math.max.apply(Math,groupRowX);}
instance._masonryHorizontalPlaceBrick($this,groupX);}});},_masonryHorizontalPlaceBrick:function($brick,setX){var minimumX=Math.min.apply(Math,setX),smallRow=0;for(var i=0,len=setX.length;i<len;i++){if(setX[i]===minimumX){smallRow=i;break;}}
var x=minimumX,y=this.masonryHorizontal.rowHeight*smallRow;this._pushPosition($brick,x,y);var setWidth=minimumX+$brick.outerWidth(true),setSpan=this.masonryHorizontal.rows+1-len;for(i=0;i<setSpan;i++){this.masonryHorizontal.rowXs[smallRow+i]=setWidth;}},_masonryHorizontalGetContainerSize:function(){var containerWidth=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:containerWidth};},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(true);},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0};},_fitColumnsLayout:function($elems){var instance=this,containerHeight=this.element.height(),props=this.fitColumns;$elems.each(function(){var $this=$(this),atomW=$this.outerWidth(true),atomH=$this.outerHeight(true);if(props.y!==0&&atomH+props.y>containerHeight){props.x=props.width;props.y=0;}
instance._pushPosition($this,props.x,props.y);props.width=Math.max(props.x+atomW,props.width);props.y+=atomH;});},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width};},_fitColumnsResizeChanged:function(){return true;},_cellsByColumnReset:function(){this.cellsByColumn={index:0};this._getSegments();this._getSegments(true);},_cellsByColumnLayout:function($elems){var instance=this,props=this.cellsByColumn;$elems.each(function(){var $this=$(this),col=Math.floor(props.index/props.rows),row=props.index%props.rows,x=(col+0.5)*props.columnWidth-$this.outerWidth(true)/2,y=(row+0.5)*props.rowHeight-$this.outerHeight(true)/2;instance._pushPosition($this,x,y);props.index++;});},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth};},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(true);},_straightAcrossReset:function(){this.straightAcross={x:0};},_straightAcrossLayout:function($elems){var instance=this;$elems.each(function(i){var $this=$(this);instance._pushPosition($this,instance.straightAcross.x,0);instance.straightAcross.x+=$this.outerWidth(true);});},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x};},_straightAcrossResizeChanged:function(){return true;}};$.fn.imagesLoaded=function(callback){var $this=this,$images=$this.find('img').add($this.filter('img')),len=$images.length,blank='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',loaded=[];function triggerCallback(){callback.call($this,$images);}
function imgLoaded(event){var img=event.target;if(img.src!==blank&&$.inArray(img,loaded)===-1){loaded.push(img);if(--len<=0){setTimeout(triggerCallback);$images.unbind('.imagesLoaded',imgLoaded);}}}
if(!len){triggerCallback();}
$images.bind('load.imagesLoaded error.imagesLoaded',imgLoaded).each(function(){var src=this.src;this.src=blank;this.src=src;});return $this;};var logError=function(message){if(window.console){window.console.error(message);}};$.fn.isotope=function(options,callback){if(typeof options==='string'){var args=Array.prototype.slice.call(arguments,1);this.each(function(){var instance=$.data(this,'isotope');if(!instance){logError("cannot call methods on isotope prior to initialization; "+"attempted to call method '"+options+"'");return;}
if(!$.isFunction(instance[options])||options.charAt(0)==="_"){logError("no such method '"+options+"' for isotope instance");return;}
instance[options].apply(instance,args);});}else{this.each(function(){var instance=$.data(this,'isotope');if(instance){instance.option(options);instance._init(callback);}else{$.data(this,'isotope',new $.Isotope(options,this,callback));}});}
return this;};})(window,jQuery);


//JQUERY For IE7/8 

jQuery(window).load(function(){
	// #################################
	// isotope
	// ################################							 
		var $container=jQuery('#item-wrap');
		$container.imagesLoaded(function(){
		jQuery('#item-wrap').isotope({
			transformsEnabled:false,
			animationEngine:'jquery',
			itemSelector:'.item'
		  });
		});
		//Filterable 
		jQuery('#filterable a').click(function(){
			jQuery(this).css('outline','none');
			jQuery('ul#filterable .current').removeClass('current');
			jQuery(this).parent().addClass('current');	
			var selector = jQuery(this).attr('data-filter');
			$container.isotope({ 
				transformsEnabled: false,
				animationEngine : 'jquery',			   
				filter: selector
			});
			return false;
		});
		//Resize screen 
		jQuery(window).bind('smartresize.isotope',function(){
		  $container.isotope({
		  	itemSelector : '.item'
		  });
		});
		//infi mark
	// #################################
	// Add link to block
	// ################################	
		jQuery('#item-wrap li.haslink').find('a').each(function(){
			var box = jQuery(this).parents('[rel]');
			if (jQuery.browser.msie == true && parseInt(jQuery.browser.version) < 9){
				jQuery(this).click(function(){
					document.location.href = box.attr('rel');
				})
				return;
			}
		})
	// #################################
	// Player
	// ################################
		if( jQuery('audio').length > 0 ) {
		jQuery('audio').mediaelementplayer({
			alwaysShowControls: false,
			audioHeight: 80,
			loop: true,
			startVolume: 0.8,
			alwaysShowHours: true,
			features: ['playpause','progress','current']
		});	
		}


	// #################################
	// Back top
	// ################################
	jQuery("#top").hide();
	jQuery(function () {
		   jQuery(window).scroll(function(){
				if (jQuery(window).scrollTop()>100){
					 jQuery("#top").fadeIn(300);
				}else{
					 jQuery("#top").fadeOut(100);
				}
		   });
		   jQuery("#top").click(function(){
				jQuery('body,html').animate({scrollTop:0},500);
				return false;
		   });
  	});
	/* #################################
	// Slider auto adjust window height
	// ################################ */
	if(jQuery("#supersized").length > 0) {
		 jQuery(window).resize(function() {
			  jQuery('#item-wrap').css({marginTop:jQuery(window).height()});
			  jQuery('#single-wrap').css({marginTop:jQuery(window).height()});
			  jQuery('#supersized,#controls-wrapper').css({height:jQuery(window).height()});
			  jQuery('#prevslide, #nextslide, #progress-back ').css({top:jQuery(window).height()});
			  if(jQuery(".sidebar_right").length > 0) { 
				   jQuery('.sidebar_right').css({top:jQuery(window).height()+40}); 
			  }
		 }).trigger('resize');
	}
	
	
	// #################################
	// Custom block size
	// ################################
	var baseColumnWidth = parseInt(window['blockWidth'] || 260); 
        //var baseColumnWidth = 200; 
    var marginX = parseInt(window['blockMargin'] || 10);
        //var marginX = 1;
	$container.find('li.item').css('width',+ baseColumnWidth +'px').css('margin-left',+ marginX +'px').css('margin-bottom',+ marginX +'px');	
	

	// #################################
	// Menu
	// ################################	
	jQuery("#navi>ul>li>ul").each(function() {
		jQuery(this).siblings("a").append('<span class="dot"></span>')
	});
	jQuery('#navi>ul>li').has('ul').each(function(){		
		var $menuunit = jQuery("#navi>ul>li");	
		$menuunit.children('.sub-menu').hide();
		$menuunit.hoverIntent({
			over:expandMenu,
			timeout: 100, 
			out:resetMenu
		});
		function expandMenu(){
			jQuery(this).children('.sub-menu').stop(true,false).animate({'opacity':'1'},330);
			jQuery(this).children('.sub-menu').show();	
			}
		function resetMenu() {
			jQuery(this).children('.sub-menu').stop(true,false).animate({'opacity':'0'},100);
			jQuery(this).children('.sub-menu').hide();	
		}
		//Sub menu
		$menuunit.find('li').hover(function(){
			 jQuery(this).children('ul.sub-menu').slideDown(200);
		 },function(){
			 jQuery(this).children('ul.sub-menu').slideUp(100);
		});
	})
	//end menu
	
	jQuery('ul.like_icon_intip').remove();
});