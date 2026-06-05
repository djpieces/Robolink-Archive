jQuery( function ( $ ) {

	$( '.wh-sensei-courses-carousel' ).each( function () {
		var $this       = $( this );

		if ( $this.data( 'type' ) !== 'carousel' ) {
			return;
		}

		var items       = $this.data( 'itemsDesktop' ) || 4;
		var slideSpeed  = $this.data( 'slideSpeed' ) || 500;
		var autoPlay    = $this.data( 'autoPlay' ) || false;
		var showBullets = $this.data( 'showBullets' ) || false;
		var autoHeight  = $this.data( 'autoHeight' ) || false;

		var options = {
			items: items,
			itemsCustom: false,
			itemsDesktop: [1199, items],
			itemsDesktopSmall: [980, items],
			itemsTablet: [768, 2],
			itemsTabletSmall: false,
			itemsMobile: [479, 1],
			singleItem: false,
			itemsScaleUp: false,

			//Basic Speeds
			slideSpeed: slideSpeed,
			paginationSpeed: 800,
			rewindSpeed: 1000,

			//Autoplay
			autoPlay: autoPlay,
			stopOnHover: false,

			// Navigation
			//navigationText: ['<', '>'],
			rewindNav: true,
			scrollPerPage: false,

			//Pagination
			pagination: showBullets,
			paginationNumbers: !showBullets, // this has to be reversed to use bullets

			// Responsive
			responsive: true,
			responsiveRefreshRate: 200,
			responsiveBaseWidth: window,

			// CSS Styles
			baseClass: 'owl-carousel',
			theme: 'owl-theme',

			//Lazy load
			lazyLoad: true,
			lazyFollow: true,
			lazyEffect: 'fade',

			//Auto height
			autoHeight: autoHeight
		};

		$this.owlCarousel(options);

	} ); 

} );