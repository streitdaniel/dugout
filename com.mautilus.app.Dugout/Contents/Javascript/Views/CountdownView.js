/**
 * Countdown view
 * 
 * @class CountdownView
 * @extends MAF.system.FullscreenView
 */
var CountdownView = new MAF.Class({
	ClassName: 'CountdownView',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		console.log('[CountdownView] initialize');
		this.parent();

		this.colors = ['red', 'orange', 'green'];
		this.beepsTimes = [2200, 1150, 3000];
		this.color = 0;
		this.semaphore = {};
	},

	/**
	 * Called - once, when view is created
	 * Do here - Initializes the basic objects on the view
	 * Place here - Register your global listeners and variables
	 */
	initView: function() {
		console.log('[CountdownView] initView');
	},
	
	/**
	 * Called - Once, when view is created
	 * Do here - View is loaded in the DOM tree
	 * Place here - Create and append most -if not all- of your elements here
	 */
	createView: function () {
		console.log('[CountdownView] createView');

		for (var i in this.colors) {
			// assign color
			var color = this.colors[i];

			this.semaphore[color] = new MAF.element.Image({
				autoShow: false,
				hideWhileLoading: true,
				src: '/Images/semaphore_' + color + '.png'
			});

			this.semaphore[color].appendTo(this);
			// add basic class
			this.semaphore[color].element.addClass('imgSemaphore');
			//this.semaphore[color].show();

		}

	},

	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is visible to the user from here on
	 * Place here - Update your elements contents if it is dynamic and place listeners that are canceled in the hideView
	 */
	updateView: function () {
		console.log('[CountdownView] updateView');

		dugout.audio.playSound(dugout.audio.COUNTDOWN_SOUND);

		this.color = (this.color >= 3) ? 0 : this.color ;
		//dugout.audio.playSound(dugout.audio.COUNTDOWN_SOUND);

		this.semaphore[this.colors[this.color]].show()

		// colors interval changing
		var scope = this;
		if (this.color < 2) {
			setTimeout(function() {
				scope.semaphore[scope.colors[scope.color]].hide();
				scope.color += 1;
				scope.updateView();
			}, scope.beepsTimes[scope.color]);
		} else {
			setTimeout(function() {
				scope.semaphore[scope.colors[scope.color]].hide();
				scope.color += 1;
				MAF.application.loadView('view-PlaygroundView');
			}, 1000);
		}

	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is selected as currentview
	 * Place here - Remembered states are restored to their elements
	 */
	selectView: function() {
		console.log('[CountdownView] selectView');
	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - The focus on the view is placed
	 * Place here - If you want an other focus, do so here
	 */
	focusView: function() {
		console.log('[CountdownView] focusView');
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The application deselects the view as it's current
	 * Place here - Cancel listeners that are no longer necessary
	 */
	unselectView: function() {
		console.log('[CountdownView] unselectView');
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The view is hidden from the user
	 * Place here - Cancel listeners that are no longer necessary
	 */
	hideView: function() {
		console.log('[CountdownView] hideView');
	},
	
	/**
	 * Called - Once, when application is destroyed
	 * Do here - Removes all elements on the view
	 * Place here - If the application leaves memory leaks and/or pollution warnings in your console remove them here.
	 */
	destroyView: function() {
		console.log('[CountdownView] destroyView');
	}
});