jQuery(document).ready(function($){
	"use strict";
	initBlogs();
});


function initBlogs(){
	
	jQuery('.pbd-alp-placeholder').html('');
	
	if (jQuery('.posts_category_filter').length){
		jQuery('.posts_category_filter .showall .counter').text(" ("+jQuery('article').length+")");
		jQuery('.posts_category_filter li:not(.showall)').each(function(){
			var $thisFilter = jQuery(this);
				$thisFilter.find('.counter').text(" ("+jQuery('article.'+$thisFilter.attr('class').replace(" disable", "")).length+")");		
			if (jQuery('article.'+$thisFilter.attr('class').replace(" disable", "")).length < 1){
				$thisFilter.addClass('disable');
			} else {
				$thisFilter.removeClass('disable');
			}
		});
	}
				    	
	for (var i=0; i<17; i++){
		jQuery('li.depth-'+i).each(function(){
			jQuery(this).css({ 'width': jQuery(this).parent().width()-((i-1)*10)+'px' });
		});
	}
	
	if (jQuery('.post-listing .flexslider').length){
		jQuery('.post-listing .flexslider').each(function(){
			if (jQuery(this).parents('.single').length){
				jQuery(this).flexslider({
					animation: "fade",
					controlNav: true,
					directionNav: true,
					touch: true
				});					
			} else {
				jQuery(this).flexslider({
					animation: "fade",
					controlNav: true,
					directionNav: true,
					touch: true,
					start:function(slider){
						jQuery(slider).find('.flex-direction-nav li a').each(function(){
							jQuery(this).on("mouseenter", function(){
								jQuery(this).css('background-color',window.imperioOptions.styleColor);
							}).on("mouseleave", function(){
								jQuery(this).css('background-color','rgba(0, 0, 0, 0.5)');
							});
						});
					}
				});
			}
		});
	}
	
	
	if (jQuery('.the_movies').length){
		jQuery('.the_movies').each(function(){
			var who = jQuery(this).attr('data-movie');
			if (who){
				jQuery(this).html("<iframe src='"+jQuery(".v_links[data-movie="+who+"]").eq(0).html()+"' width='100%' height='370' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
			} else {
				jQuery(this).html("<iframe src='"+jQuery(".v_links").eq(0).html()+"' width='100%' height='370' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
			}
			if (jQuery(".the_movies").siblings(".v_links").length > 1){
	      		jQuery(this).find('.movies-nav').remove();
	        	jQuery(this).append('<ul class="flex-direction-nav movies-nav"><li><a class="prev" href="javascript:;">Previous</a></li><li><a class="next" href="javascript:;">Next</a></li></ul>');
	      		jQuery(this).siblings('.current_movie').remove();
	      		jQuery(this).after('<div hidden class="current_movie upper_hidden">0</div>');
	      		
	      		var elem = jQuery(this);
	      		
	      		jQuery(this).find('.movies-nav .prev').on("click", function(e){
	      			e.preventDefault();
	      			var index = parseInt(elem.siblings('.current_movie').html());
	      			var nextIndex = 0;
	      			if (index == 0) nextIndex = elem.siblings('.v_links').length - 1;
	      			else nextIndex = index-1;
	      			elem.find("iframe").attr('src', elem.siblings('.v_links').eq(nextIndex).html() );
	      			elem.siblings('.current_movie').html(nextIndex);
	      			
	      		});
	      		jQuery(this).find('.movies-nav .next').on("click", function(e){
	      			e.preventDefault();
	      			var index = parseInt(elem.siblings('.current_movie').html());
	      			var nextIndex = 0;
	      			if (index == elem.siblings('.v_links').length - 1) nextIndex = 0;
	      			else nextIndex = index+1;
	      			elem.find("iframe").attr('src', elem.siblings('.v_links').eq(nextIndex).html() );
	      			elem.siblings('.current_movie').html(nextIndex);
	      		});
	      	}
		});
	}
	
	if (jQuery('.postcontent .flexslider.slider').length){
		jQuery('.postcontent .flexslider.slider .mask .more').each(function(){
			jQuery(this).attr('onclick', 'jQuery(this).parents(\'.mask\').siblings(\'ul.slides\').find(\'li\').eq(0).find(\'a\').trigger(\'click\');');
		});
	}
			
	jQuery('a.comment-reply-link').each(function(){
		if (jQuery(this).attr('href').indexOf('#') != -1){
			jQuery(this).on('click', function(){
				jQuery('html,body').animate({scrollTop: jQuery(this).offset().top - 80}, 222, 'jswing');
			});
		}
	});
	if (jQuery('.container .vendor').length){
	jQuery(".container .vendor").fitVids();
	}

}

function imperio_monitorScrollTop(){
	
	if (jQuery('#pbd-alp-load-posts').length){
		var scrollTop = getScrollTop();
	
		window.loadingPoint = parseInt((jQuery('#pbd-alp-load-posts').offset().top - jQuery(window).height() + 50),10);
		
		if (scrollTop >= window.loadingPoint){
			clearInterval(window.interval);
			jQuery('#pbd-alp-load-posts a').trigger('click');
		}	
	} else {
		clearInterval(window.interval);
	}

}

function getScrollTop(){
    if(typeof pageYOffset!= 'undefined'){
        //most browsers
        return pageYOffset;
    }
    else{
        var B= document.body; //IE 'quirks'
        var D= document.documentElement; //IE with doctype
        D= (D.clientHeight)? D: B;
        return D.scrollTop;
    }
}


/* load more posts */
jQuery(document).ready(function($) {
	"use strict";
	// The number of the next page to load (/page/x/).
	window.imperio_pageNum = parseInt(window.imperioOptions.loader_startPage,10) != 0 ? parseInt(window.imperioOptions.loader_startPage,10) : 1;
	window.imperio_totalForward = 1;
	window.imperio_totalBackward = -1;
	
	// The maximum number of pages the current query can return.
	var max = parseInt(window.imperioOptions.loader_maxPages);
	
	// The link of the next page of posts.
	var nextLink = "empty";
	if (jQuery('.navigation .next-posts').parent().attr('href')) nextLink = jQuery('.navigation .next-posts').parent().attr('href');
	var prevLink = "empty";
	if (jQuery('.navigation .prev-posts').parent().attr('href')) prevLink = jQuery('.navigation .prev-posts').parent().attr('href');
	
	/**
	 * Replace the traditional navigation with our own,
	 * but only if there is at least one page of new posts to load.
	**/
	
	if (nextLink != "empty" || prevLink != "empty"){
		if (window.imperioOptions.reading_option === "scroll" || window.imperioOptions.reading_option === "scrollauto"){
			if((parseInt(window.imperio_pageNum, 10)+1) <= max) {
				// Insert the "More Posts" link.
				
				jQuery('.post-listing').each(function(){
		
					if (jQuery(this).parents('.recentPosts_widget').length == 0){
						
						if (jQuery(this).parents('.single').length == 0){
							var appendix = '<p id="pbd-alp-load-posts"><a href="javascript:;">'+ window.imperioOptions.imperio_load_more_posts_text +'</a></p>';
							jQuery(this).parent()
								.append('<div style="position:relative;float:left;display:inline-block;width:100%;" class="pbd-alp-placeholder pbd-alp-placeholder-'+ (parseInt(window.imperio_pageNum, 10)+1) +'"></div>')
								.append(appendix);			
						}
					
					}
					// Remove the traditional navigation.
					if (jQuery(this).parents('.single').length == 0){ jQuery('.navigation').css('display','none'); }
				});
				
			}
			if (parseInt(window.imperio_pageNum, 10) > 1){
				jQuery('.post-listing').each(function(){
		
					if (jQuery(this).parents('.recentPosts_widget').length == 0){
						
						if (jQuery(this).parents('.single').length == 0){
							var prependix = '<p id="pbd-alp-load-newer-posts" style="position: relative; height:50px;width:100%;text-align:center;"><a style=" position: relative; display:inline-block;" href="javascript:;">'+ window.imperioOptions.imperio_load_more_posts_text +'</a></p>';
							jQuery(this).parent()
								.prepend('<div class="pbd-alp-placeholder-newer-'+ (parseInt(window.imperio_pageNum, 10)-1) +'"></div>')
								.prepend(prependix);			
						}
					
					}
					// Remove the traditional navigation.
					if (jQuery(this).parents('.single').length == 0){ jQuery('.navigation').css('display','none'); }
				});	
			}
			
			
			/**
			 * Load new posts when the link is clicked.
			 */	
			if (jQuery('#pbd-alp-load-posts a').length){
				jQuery(document).on('click', '#pbd-alp-load-posts a', function(e) {
				
					// Are there more posts to load?
					if((window.imperio_pageNum + window.imperio_totalForward) <= max) {
					
						// Show that we're working.
						jQuery(this).html(''+window.imperioOptions.imperio_loading_posts_text+'<img style="width:16px; height: 16px; margin-left: 5px; position: relative;" src="'+jQuery('window.imperioOptions.templatepath').html()+'/images/ajx_loading.gif">');
						
						window.first = true;
						
						jQuery('.pbd-alp-placeholder-'+ parseInt(window.imperio_pageNum + window.imperio_totalForward,10)).load( nextLink + ' article',
							function() {
								
								jQuery('.pbd-alp-placeholder-'+ parseInt(window.imperio_pageNum + window.imperio_totalForward,10)+' article').each(function(){
									/* masonry specifics */
									if (jQuery('.post-listing').hasClass('journal')){
										window.iso.isotope('insert', jQuery(this));
										jQuery(window).trigger('resize');	
									} else {
										jQuery(this).appendTo(jQuery('.post-listing'));
									}
									if (jQuery(this).hasClass('recent')){
										jQuery(this).remove();
									}
								});
								
								if (window.first){
									var whereTo = jQuery('.pbd-alp-placeholder-'+ parseInt(window.imperio_pageNum + window.imperio_totalForward,10)).offset().top-100;
									window.first = false;
									if (window.imperioOptions.reading_option != "scrollauto"){
										jQuery('html,body').stop().animate({
									      "scrollTop": whereTo
									    }, 1200, "easeInOutExpo", function () {
									      //window.location.hash = target;
									   	});	
									}
								}
			
								window.imperio_totalForward = parseInt(window.imperio_totalForward+1);
			
								if (nextLink.indexOf('paged') < 0)
									nextLink = nextLink.replace(/\/page\/[0-9]?/, '/page/'+ parseInt(window.imperio_pageNum + window.imperio_totalForward,10)); /* links /page/x/ */
								else nextLink = nextLink.replace(/paged=[0-9]?/, "paged="+parseInt(window.imperio_pageNum + window.imperio_totalForward, 10)); /* links /?paged=x */
							
							
								// Add a new placeholder, for when user clicks again.
								jQuery('#pbd-alp-load-posts')
									.before('<div style="position:relative;float:left;width:100%;display:inline-block;" class="pbd-alp-placeholder pbd-alp-placeholder-'+ parseInt(window.imperio_pageNum + window.imperio_totalForward, 10) +'"></div>')
								
								// Update the button message.
								if((window.imperio_pageNum + window.imperio_totalForward ) <= max) {
									jQuery('#pbd-alp-load-posts a').text(window.imperioOptions.imperio_load_more_posts_text);
									if (window.imperioOptions.reading_option === "scrollauto" && !jQuery('body').hasClass('single')) {
										window.clearInterval(window.imperio_interval);
										window.imperio_interval = setInterval('imperio_monitorScrollTop()', 1000 );
									}
								} else {
									jQuery('#pbd-alp-load-posts a').text(window.imperioOptions.imperio_no_more_posts_text);
									var t=setTimeout(function(){
										jQuery('#pbd-alp-load-posts').slideUp(500).fadeOut(500);
									},5000);
									window.clearInterval(window.imperio_interval);
								}
								
								jQuery('.post-listing').next('.pbd-alp-placeholder').remove();
								
								initBlogs();
							}
						).fadeIn(5000);	
						
					} else {
						window.clearInterval(window.imperio_interval);
					}
					return false;
				});
			}
			
			
			if (jQuery('#pbd-alp-load-newer-posts a').length){
				jQuery(document).on('click', '#pbd-alp-load-newer-posts a', function(e) {
			
					//window.imperio_totalBackward = window.imperio_totalBackward-1;
					if((window.imperio_pageNum + window.imperio_totalBackward) > 0) {
					
						// Show that we're working.
						jQuery(this).html(''+window.imperioOptions.imperio_loading_posts_text+'<img style="width:16px; height: 16px; margin-left: 5px; position: relative;" src="'+jQuery('window.imperioOptions.templatepath').html()+'/images/ajx_loading.gif">');
						jQuery('.pbd-alp-placeholder-newer-'+ (window.imperio_pageNum + window.imperio_totalBackward)).load( prevLink + ' article',
							function() {
		
								jQuery('.pbd-alp-placeholder-newer-'+ (window.imperio_pageNum + window.imperio_totalBackward)+' article').each(function(){
									if (jQuery(this).hasClass('recent')) jQuery(this).remove();
									/* masonry specifics */
									if (jQuery('.post-listing').hasClass('journal')){
										jQuery(this).prependTo(jQuery('.journal'));
										window.iso.isotope('reloadItems').isotope({ sortBy: 'original-order' });
										jQuery(window).trigger('resize');									
									} else {
										jQuery(this).prependTo(jQuery('.post-listing'));
									}
								});
														
								window.imperio_totalBackward = window.imperio_totalBackward-1;
			
								if ( prevLink.indexOf('paged') < 0 )
									prevLink = prevLink.replace(/\/page\/[0-9]?/, '/page/'+ (window.imperio_pageNum + window.imperio_totalBackward)); /* links /page/x/ */
								else prevLink = prevLink.replace(/paged=[0-9]?/, "paged="+(window.imperio_pageNum + window.imperio_totalBackward)); /* links /?paged=x */		
								
								
								// Add a new placeholder, for when user clicks again.
								jQuery('#pbd-alp-load-newer-posts')
									.after('<div class="pbd-alp-placeholder-newer-'+ parseInt((window.imperio_pageNum + window.imperio_totalBackward)) +'"></div>')
								
								// Update the button message.
								if((window.imperio_pageNum + window.imperio_totalBackward+1) > 1) {
									jQuery('#pbd-alp-load-newer-posts a').text(window.imperioOptions.imperio_load_more_posts_text);
								} else {
									jQuery('#pbd-alp-load-newer-posts a').text(window.imperioOptions.imperio_no_more_posts_text);
									var t=setTimeout(function(){
										jQuery('#pbd-alp-load-newer-posts').slideUp(500).fadeOut(500);
									},5000);
								}
								
								if (jQuery('.post-listing').hasClass('journal')){
									jQuery('.pbd-alp-placeholder-newer-'+ (window.imperio_pageNum + window.imperio_totalBackward)).remove();
								}
								
								initBlogs();
							}
						).fadeIn(5000);	
						
					} else { 
						window.clearInterval(window.imperio_interval);
					}	
					return false;
				});
			}
				
		}	
	}
	
});