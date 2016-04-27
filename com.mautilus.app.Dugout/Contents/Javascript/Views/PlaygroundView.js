/**
 * Playground view
 * 
 * @class PlaygroundView
 * @extends MAF.system.FullscreenView
 */
var PlaygroundView = new MAF.Class({
	ClassName: 'PlaygroundView',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		console.log('[PlaygroundView] initialize');
		this.parent();
		this.textName = {};
	},

	/**
	 * Called - once, when view is created
	 * Do here - Initializes the basic objects on the view
	 * Place here - Register your global listeners and variables
	 */
	initView: function() {
		console.log('[PlaygroundView] initView');
	},
	
	/**
	 * Called - Once, when view is created
	 * Do here - View is loaded in the DOM tree
	 * Place here - Create and append most -if not all- of your elements here
	 */
	createView: function () {
		console.log('[PlaygroundView] createView');

		// make dark overlay
		this.scoreBackground = new MAF.element.Core();
		this.scoreBackground.element.addClass('scoreBackground');
		this.scoreBackground.appendTo(this);
		this.scoreBackground.show();

		// dark left
		this.leftBackground = new MAF.element.Core();
		this.leftBackground.element.addClass('leftBackground');
		this.leftBackground.appendTo(this);
		this.leftBackground.show();

		// dark right
		this.rightBackground = new MAF.element.Core();
		this.rightBackground.element.addClass('rightBackground');
		this.rightBackground.appendTo(this);
		this.rightBackground.show();

		// dark bottom
		this.bottomBackground = new MAF.element.Core();
		this.bottomBackground.element.addClass('bottomBackground');
		this.bottomBackground.appendTo(this);
		this.bottomBackground.show();

		// define worms object
		this.wormsScore = {};

		// initialize each worms color
		for (var index in dugout.CONST_COLORS_NAMES) {
			// assign color
			var color = dugout.CONST_COLORS_NAMES[index];

			this.wormsScore[color] = new MAF.element.Image({
				autoShow: false,
				hideWhileLoading: true,
				src: 'Images/worm_' + color + '_small.png',
			});

			this.wormsScore[color].appendTo(this);
			// add basic class
			this.wormsScore[color].element.addClass('imgScore');
		}

		var canvases = dugout.getVisibleCanvases();

		// get and show play play canvases
		for (var i in canvases) {
			if (0 == i) {
				canvases[i].element.addClass('canvasFirst');
			}
			canvases[i].appendTo(this);
			canvases[i].show();
		}

	},

	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is visible to the user from here on
	 * Place here - Update your elements contents if it is dynamic and place listeners that are canceled in the hideView
	 */
	updateView: function () {
		console.log('[PlaygroundView] updateView');

		this.showScores();

	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is selected as currentview
	 * Place here - Remembered states are restored to their elements
	 */
	selectView: function() {
		console.log('[PlaygroundView] selectView');
	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - The focus on the view is placed
	 * Place here - If you want an other focus, do so here
	 */
	focusView: function() {
		console.log('[PlaygroundView] focusView');
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The application deselects the view as it's current
	 * Place here - Cancel listeners that are no longer necessary
	 */
	unselectView: function() {
		console.log('[PlaygroundView] unselectView');
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The view is hidden from the user
	 * Place here - Cancel listeners that are no longer necessary
	 */
	hideView: function() {
		console.log('[PlaygroundView] hideView');
	},
	
	/**
	 * Called - Once, when application is destroyed
	 * Do here - Removes all elements on the view
	 * Place here - If the application leaves memory leaks and/or pollution warnings in your console remove them here.
	 */
	destroyView: function() {
		console.log('[PlaygroundView] destroyView');
	},

	/**
	 * Show scores
	 */
	showScores: function() {

		// show worms score
		this.showWormScore(1, 'red', 'Ondra', 10);
		this.showWormScore(2, 'green', 'Martin', 12);
		this.showWormScore(3, 'yellow', 'Petr', 8);
		this.showWormScore(4, 'blue', 'Radim', 15);

		this.updateScore(1, 'red', 'Ondra', 10);
	},

	updateScore: function(position, color, name, score) {

		this.textName[color].setText(name + ' ' + score);

	},

	/**
	 * Show worms score
	 * @param {Integer} - position
	 * @param {String} - color
	 * @param {String} - name
	 * @param {Integer} - score
	 */
	showWormScore: function(position, color, name, score) {

		// assign css style to worm
		this.wormsScore[color].element.addClass('position' + position);

		// show worm
		this.wormsScore[color].show();

		// show name and score
		this.textName[color] = new MAF.element.Text({
			totalLines: 1,
			data: name + ' ' + score
		});

		this.textName[color].element.addClass('ingameText');
		this.textName[color].element.addClass('name');
		this.textName[color].element.addClass('position' + position);
		this.textName[color].appendTo(this);
		this.textName[color].show();

	},

});