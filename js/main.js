;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		},
			anyButIOS: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.anyButIOS() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};

	var counter = function() {
		$('.js-counter').countTo({
			formatter: function (value, options) {
				var finalValue = value.toFixed(options.decimals);
				if (finalValue >= options.to && options.plus) {
					finalValue += '+';
				}
	      		return finalValue;
			}
		});
	};


	var counterWayPoint = function() {
		if ($('#naran-counter').length > 0 ) {
			$('#naran-counter').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout(counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	// Animations
	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 25, 'easeInOutExpo' ); /* Delay from previous animation, default: k * 200 */
					});
					
				}, 100); 
				
			}

		} , { offset: '85%' } ); /* Where in scroll the animatino is triggered */
	};


	var burgerMenu = function() {
		$('.js-naran-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});
	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {
		$(document).click(function (e) {
			var container = $("#naran-aside, .js-naran-nav-toggle");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ( $('body').hasClass('offcanvas') ) {
					$('body').removeClass('offcanvas');
					$('.js-naran-nav-toggle').removeClass('active');
				}
			}
		});
		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {
    			$('body').removeClass('offcanvas');
    			$('.js-naran-nav-toggle').removeClass('active');
	    	}
		});
	};

	var clickMenu = function() {
		$('#navbar a:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar');

				if (!section) { // Allow to follow links that are not a section in the page
					return true;
				}
				else if ( section && $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 0 /* No offset. Default: -55 */
			    	}, 500);
			  	}

		    if ( navbar.is(':visible')) {
		    	navbar.removeClass('in');
		    	navbar.attr('aria-expanded', 'false');
		    	$('.js-naran-nav-toggle').removeClass('active');
		    }

			event.preventDefault();
			return false;
		});
	};

	// Reflect scrolling in navigation
	var navActive = function(section) {
		var $el = $('#navbar > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});
	};

	var navigationSection = function() {
		var $section = $('section[data-section]');
		$section.waypoint(function(direction) {	  	
		  	if (direction === 'down') {
				navActive($(this.element).data('section'));
		  	}
		}, {
			// offset: '150px'
			// Create special offset for contact so that it's highlighted even if it doesn't fill the screen.
			offset: function() {
				if ($(this.element).data('section') === 'contact') {
					return 500;
				} else {
					return 150;
				}
			}
		});
		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 150; } /* 155 */
		});
	};

	var sliderMain = function() {
	  	$('#naran-hero .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 5000,
			directionNav: true,
			start: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			},
			before: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			}

	  	});
	};

	// Replace send-message form's action with the real call to formspree when the end user submits the form. 
	// This is done to avoid including my email address in the html code and make it more difficult for mail spam robots.
	var sendMessage = function () {
		var messageForm = $('#send-message');
		messageForm.on('submit', function(e) {
			messageForm.attr('action', 'https://formspree.io/' + decode('&#114;&#117;&#098;&#101;&#110;&#064;&#110;&#097;&#114;&#097;&#110;&#046;&#105;&#111;'));
		});
	};

	// Sends a telegram notification when the page is loaded
	var sendNotification = function () {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://api.telegram.org/bot" + decode('&#054;&#048;&#051;&#048;&#051;&#057;&#056;&#054;&#048;:&#065;&#065;&#069;&#074;&#051;&#107;&#077;&#055;&#108;&#049;&#065;&#086;&#051;&#083;&#101;&#074;&#099;&#114;&#110;&#080;&#068;&#112;&#097;&#082;&#100;&#101;&#120;&#088;&#087;&#054;&#085;&#109;&#055;&#089;&#065;') + "/sendMessage", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
    		chat_id: decode('&#045;&#051;&#057;&#052;&#051;&#048;&#049;&#054;&#055;&#056;'),
    		text: "Live visitor at naran.io"
		}));
	};

	var decode = function (str) {
		return str.replace(/&#(\d+);/g, function(match, dec) {
			return String.fromCharCode(dec);
		});
	};

	var stickyFunction = function() {
		var h = $('.image-content').outerHeight();

		if ($(window).width() <= 992 ) {
			$("#sticky_item").trigger("sticky_kit:detach");
		} else {
			$('.sticky-parent').removeClass('stick-detach');
			$("#sticky_item").trigger("sticky_kit:detach");
			$("#sticky_item").trigger("sticky_kit:unstick");
		}

		$(window).resize(function(){
			var h = $('.image-content').outerHeight();
			$('.sticky-parent').css('height', h);


			if ($(window).width() <= 992 ) {
				$("#sticky_item").trigger("sticky_kit:detach");
			} else {
				$('.sticky-parent').removeClass('stick-detach');
				$("#sticky_item").trigger("sticky_kit:detach");
				$("#sticky_item").trigger("sticky_kit:unstick");

				$("#sticky_item").stick_in_parent();
			}
		});
		$('.sticky-parent').css('height', h);
		$("#sticky_item").stick_in_parent();
	};

	// Document on load.
	$(function(){
		fullHeight();
		counter();
		counterWayPoint();
		contentWayPoint();
		burgerMenu();
		clickMenu();
		// navActive();
		navigationSection();
		// windowScroll();
		mobileMenuOutsideClick();
		sliderMain();
		sendMessage();
		sendNotification();
		stickyFunction();
	});

}());