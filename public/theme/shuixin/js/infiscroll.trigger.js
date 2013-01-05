		jQuery(document).ready(function(){
			
			  var $container = jQuery('#item-wrap');
			  $container.infinitescroll({
				navSelector  : '#page-nav',    // selector for the paged navigation 
				nextSelector : '#page-nav a',  // selector for the NEXT link (to page 2)
				itemSelector : '.item',     // selector for all items you'll retrieve
				loading: {
				img				: "img/loading-infi.gif",
				msg				: null,
				msgText			: "Loading...",
				finished        : undefined,
				finishedMsg     :  ''
				},
				errorCallback: function() { jQuery('#infscr-loading').fadeOut('normal'); }
			},
			// Call Isotope as a callback function () { jQuery('#infscr-loading').fadeOut('normal'); }
			function( newElements ) {
				   var newElems = jQuery(newElements).css({ opacity: 0 });
				   newElems.imagesLoaded(function(){
						if( navigator.platform == "iPhone" || navigator.platform == "iPod"|| navigator.platform == "iPad") {
							$container.isotope('appended', newElems);
						}else{
							$container.isotope('insert', newElems);
						}
				   
				   });
				   /*
				   After Infinits Scroll the new items, Need Re-run some js for them.
				   */
					//Player
					if( jQuery('audio').length > 0 ) {
						jQuery(newElements).find("audio").mediaelementplayer({
							alwaysShowControls: true,
							audioHeight: 80,
							loop: true,
							startVolume: 0.8,
							alwaysShowHours: true,
							features: ['playpause','progress','current']
						});	
					}
					//End player				
				   
				   //Gallery Block Hover 
				   if( jQuery('li.imageblock .gallerylayout').length > 0 ) {
					 if (!(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)){ jQuery('li.imageblock .gallerylayout').hoverdir();  } 
					} 
					//Middler image block hover
					jQuery('span.da-thumbs-con').each(function(){
						var hoverconHeight = jQuery(this).height();
						var hoverconMargin = -(hoverconHeight/2);
						jQuery(this).css('margin-top',+hoverconMargin);
					});
					//End Gallery Block Hover 
					
					//Block Color
					jQuery('li.item > div.audio_wrap, li.item > div.item_standard, li.item > div.layout-video, li.item > a[class!="thumbwrap"], li.item > .gallerylayout').css('background', smallBlockBg);
					
					
					//For ie8
					if(jQuery.browser.msie == true && parseInt(jQuery.browser.version) < 9){
						 $container.find('li.item').css('width','240px').css('margin-left','1px').css('margin-bottom','1px');    
					}//End if ie
			  }) 
		})