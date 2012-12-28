/*
	--------------------------------
	Infinite Scroll Behavior
	Manual / Twitter-style
	--------------------------------
	+ https://github.com/paulirish/infinitescroll/
	+ version 2.0b2.110617
	+ Copyright 2011 Paul Irish & Luke Shumard
	+ Licensed under the MIT license
	
	+ Documentation: http://infinite-scroll.com/
	
*/

jQuery.extend(jQuery.infinitescroll.prototype,{
	
	_setup_twitter: function infscr_setup_twitter () {
		var opts = this.options,
			instance = this;
			
		// Bind nextSelector link to retrieve
		jQuery(opts.nextSelector).click(function(e) {
			jQuery(this).fadeOut('fast');
			if (e.which == 1 && !e.metaKey && !e.shiftKey) {
				e.preventDefault();
				instance.retrieve();
			}
		});
		
		// Define loadingStart to never hide pager
		instance.options.loading.start = function (opts) {
			opts.loading.msg
				.appendTo(opts.loading.selector)
				.show(opts.loading.speed, function () {
                	beginAjax(opts);
            });
		}
	}
	
});

//Added by uiueux, for fashionic theme

jQuery(function(){
  
    /* 
	var count = ;
	var cpuntprepage =  */

	var $container = jQuery('#item-wrap');
	$container.infinitescroll({
		// callback		: function () { console.log('using opts.callback'); },
		navSelector  	: ".tw_style a:last",
		nextSelector 	: ".tw_style a:last",
		itemSelector 	: " .item",
		dataType	 	: 'html',
		behavior		: 'twitter',
		loading: {
		img				: "img/loading-infi.gif",
		msg				: null,
		msgText			: "Loading...",
		finished        : undefined,
		finishedMsg     :  ''
        }, 	
		errorCallback: function() { 
		// fade out the error message after 2 seconds
		jQuery('.tw_style a').fadeOut('normal');
		jQuery('#infscr-loading').fadeOut('normal'); 
		}
		// appendCallback	: false, // USE FOR PREPENDING
		// pathParse     	: function( pathStr, nextPage ){ return pathStr.replace('2', nextPage ); }
    }, function(newElements){
    		var newElems = jQuery(newElements).css({ opacity: 0 });
            newElems.imagesLoaded(function(){
           		if( navigator.platform == "iPhone" || navigator.platform == "iPod"|| navigator.platform == "iPad") {
               		$container.isotope('appended', newElems, hoverdirCallback);
				}else{
					$container.isotope('insert', newElems, hoverdirCallback);
				}
				jQuery('.tw_style a').fadeIn('normal');
			});
			
    	/*After Infinits Scroll the new items, Need Re-run some js for them. */
		
			//Gallery Block Hover 
			if( jQuery('li.imageblock .gallerylayout').length > 0 ) {
			    if (!(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)){jQuery('li.imageblock .gallerylayout').hoverdir();}
			 }
			 jQuery('li.item > div, li.item > a[class!="thumbwrap"], li.item > .gallerylayout').css('background', smallBlockBg);
			 // Middler image block hover
			jQuery('span.da-thumbs-con').each(function(){
				var hoverconHeight = jQuery(this).height();
				var hoverconMargin = -(hoverconHeight/2);
				jQuery(this).css('margin-top',+hoverconMargin);
			});
			 //End Gallery Block Hover 
             //Player  
             if( jQuery('audio').length > 0 ) {
				jQuery(newElements).find("audio").mediaelementplayer({
					alwaysShowControls: true,
					audioHeight: 80,
					loop: true,
					alwaysShowHours: true,
					features: ['playpause','progress','current']
				});	
			  }
			//End /Player 
    });  
});