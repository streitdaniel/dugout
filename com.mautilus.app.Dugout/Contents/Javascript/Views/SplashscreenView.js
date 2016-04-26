/**
 * Splashscreen view
 * 
 * @class SplashscreenView
 * @extends MAF.system.FullscreenView
 */
var SplashscreenView = new MAF.Class({
	ClassName: 'SplashscreenView',

	Extends: MAF.system.FullscreenView,
	
	config: {
		events: {
			onAppend: function() {
				console.log('[SplashscreenView] onAppend');
			},
			onAnimationEnded: function() {
				console.log('[SplashscreenView] onAnimationEnded');
			}
		}
		
//		styles: {
//			backgroundColor: 'green'
//		}
	},
	

	initialize: function () {
		console.log('[SplashscreenView] initialize');
		this.parent();
		
		// var elem = this.element;  // DOM element
		// elem.addClass('new_class_name');
		// elem.removeClass('old_class_name');
		// this.setStyles({backgroundColor: '#900'});  // dynamicly set styles, better to use Javascript/Core/theme.js
	},

	/**
	 * Called - once, when view is created
	 * Do here - Initializes the basic objects on the view
	 * Place here - Register your global listeners and variables
	 */
	initView: function() {
		var onAppendProcess = function() {
			onsole.log('[SplashscreenView] onAppend1');
		};
		onAppendProcess.subscribeTo(this, 'onAppend', this);
		console.log('[SplashscreenView] initView');
	},
	
	/**
	 * Called - Once, when view is created
	 * Do here - View is loaded in the DOM tree
	 * Place here - Create and append most -if not all- of your elements here
	 */
	createView: function () {
		console.log('[SplashscreenView] createView');
	},

	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is visible to the user from here on
	 * Place here - Update your elements contents if it is dynamic and place listeners that are canceled in the hideView
	 */
	updateView: function () {
		console.log('[SplashscreenView] updateView');
	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is selected as currentview
	 * Place here - Remembered states are restored to their elements
	 */
	selectView: function() {
		console.log('[SplashscreenView] selectView');
	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - The focus on the view is placed
	 * Place here - If you want an other focus, do so here
	 */
	focusView: function() {
		console.log('[SplashscreenView] focusView');
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The application deselects the view as it's current
	 * Place here - Cancel listeners that are no longer necessary
	 */
	unselectView: function() {
		console.log('[SplashscreenView] unselectView');
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The view is hidden from the user
	 * Place here - Cancel listeners that are no longer necessary
	 */
	hideView: function() {
		console.log('[SplashscreenView] hideView');
	},
	
	/**
	 * Called - Once, when application is destroyed
	 * Do here - Removes all elements on the view
	 * Place here - If the application leaves memory leaks and/or pollution warnings in your console remove them here.
	 */
	destroyView: function() {
		console.log('[SplashscreenView] destroyView');
	}
},{
	FullscreenView: {
		styles: {
			width: '1920px',
			height: '720px',
			backgroundColor: 'orange'
		}
	}
}
);