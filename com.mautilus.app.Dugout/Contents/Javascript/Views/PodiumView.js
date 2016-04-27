/**
 * Podium view
 * 
 * @class PodiumView
 * @extends MAF.system.FullscreenView
 */
var PodiumView = new MAF.Class({
	ClassName: 'PodiumView',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		console.log('[PodiumView] initialize');
		this.parent();
	},

	/**
	 * Called - once, when view is created
	 * Do here - Initializes the basic objects on the view
	 * Place here - Register your global listeners and variables
	 */
	initView: function() {
		console.log('[PodiumView] initView');
		// load images
	},
	
	/**
	 * Called - Once, when view is created
	 * Do here - View is loaded in the DOM tree
	 * Place here - Create and append most -if not all- of your elements here
	 */
	createView: function () {
		console.log('[PodiumView] createView');

		// define worms object
		this.worms = {};

		// initialize each worms color
		for (var index in dugout.CONST_COLORS_NAMES) {
			// assign color
			var color = dugout.CONST_COLORS_NAMES[index];

			this.worms[color] = new MAF.element.Image({
				autoShow: false,
				hideWhileLoading: true,
				src: '/Images/worm_' + color + '_win.png'
			});

			this.worms[color].appendTo(this);
			// add basic class
			this.worms[color].element.addClass('imgPodium');
		}

	},

	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is visible to the user from here on
	 * Place here - Update your elements contents if it is dynamic and place listeners that are canceled in the hideView
	 */
	updateView: function () {
		console.log('[PodiumView] updateView');

		var players = dugout.getOrderedPlayers();
		var lt = {
				'#ed008c': 'red',
				'#8cc63e': 'green',
				'#fcb040': 'yellow',
				'#008ad2': 'blue'
			};

		for (var i in players) {

			// show the winner
			if (0 == i) {
				this.showWinner(players[i].name);
			}

			// show worm on podium
			this.showWorm(parseInt(i, 10) + 1, lt[players[i].color], players[i].name, players[i].score);

		}

		this.showCounter(10);
		
		setTimeout(function() {
			MAF.application.loadView('view-HomeView');
		}, 10000);

	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is selected as currentview
	 * Place here - Remembered states are restored to their elements
	 */
	selectView: function() {
		console.log('[PodiumView] selectView');
	},
	
	/**
	 * Called - Everytime the user visits the view
	 * Do here - The focus on the view is placed
	 * Place here - If you want an other focus, do so here
	 */
	focusView: function() {
		console.log('[PodiumView] focusView');
		dugout.audio.playSound(dugout.audio.APPLAUSE_SOUND);
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The application deselects the view as it's current
	 * Place here - Cancel listeners that are no longer necessary
	 */
	unselectView: function() {
		console.log('[PodiumView] unselectView');
	},
	
	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The view is hidden from the user
	 * Place here - Cancel listeners that are no longer necessary
	 */
	hideView: function() {
		console.log('[PodiumView] hideView');
	},
	
	/**
	 * Called - Once, when application is destroyed
	 * Do here - Removes all elements on the view
	 * Place here - If the application leaves memory leaks and/or pollution warnings in your console remove them here.
	 */
	destroyView: function() {
		console.log('[PodiumView] destroyView');
	},

	/**
	 * Show worm on the podium
	 * @param {Integer} - position
	 * @param {String} - color
	 * @param {String} - name
	 * @param {Integer} - score
	 */
	showWorm: function(position, color, name, score) {

		// assign css style to worm
		this.worms[color].element.addClass('position' + position);
		// show worm
		this.worms[color].show();

		// show name
		this.textName = new MAF.element.Text({
			totalLines: 1,
			data: name
		});
		this.textName.element.addClass('podiumText');
		this.textName.element.addClass('name');
		this.textName.element.addClass('position' + position);
		this.textName.appendTo(this);
		this.textName.show();

		// show score
		this.textScore = new MAF.element.Text({
			totalLines: 1,
			data: Math.round(score / 10)
		});
		this.textScore.element.addClass('podiumText');
		this.textScore.element.addClass('score');
		this.textScore.element.addClass('position' + position);
		this.textScore.appendTo(this);
		this.textScore.show();

	},

	/**
	 * Show the winner
	 * @param {String} - name
	 */
	showWinner: function(name) {
		this.textWinner = new MAF.element.Text({
			totalLines: 1,
		});
		this.textWinner.element.addClass('winner');
		this.textWinner.setText($_('the_winner_is') + ': ' + name);
		this.textWinner.appendTo(this);
		this.textWinner.show();
	},

	showCounter: function(time) {

		if (!this.inited) {
			this.textCounter = new MAF.element.Text({
				totalLines: 1,
				data: time
			});
			this.textCounter.element.addClass('counter');
			this.textCounter.appendTo(this);
			this.textCounter.show();

			this.inited = true;
		}

		this.textCounter.setText(time);

		var scope = this;
		setTimeout(function() {
			scope.showCounter(time - 1);
		}, 1000)

	}
	
});