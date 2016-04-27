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
		this.onBroadcast.subscribeTo(MAF.messages, MAF.messages.eventType, this);
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

		// get and show play canvases
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
		dugout.startDigging();
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

		for (var index in dugout.CONST_COLORS_NAMES) {
			if (this.textName[dugout.CONST_COLORS_NAMES[index]]) {
				this.textName[dugout.CONST_COLORS_NAMES[index]].element.removeClass('position1');
				this.textName[dugout.CONST_COLORS_NAMES[index]].element.removeClass('position2');
				this.textName[dugout.CONST_COLORS_NAMES[index]].element.removeClass('position3');
				this.textName[dugout.CONST_COLORS_NAMES[index]].element.removeClass('position4');
				this.textName[dugout.CONST_COLORS_NAMES[index]].hide();
				this.wormsScore[[dugout.CONST_COLORS_NAMES[index]]].element.removeClass('position1');
				this.wormsScore[[dugout.CONST_COLORS_NAMES[index]]].element.removeClass('position2');
				this.wormsScore[[dugout.CONST_COLORS_NAMES[index]]].element.removeClass('position3');
				this.wormsScore[[dugout.CONST_COLORS_NAMES[index]]].element.removeClass('position4');
				this.wormsScore[[dugout.CONST_COLORS_NAMES[index]]].hide();
			}

		}

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

		var players = dugout.getOrderedPlayers(), lt = {
			'#ed008c': 'red',
			'#8cc63e': 'green',
			'#fcb040': 'yellow',
			'#008ad2': 'blue'
		};

		for (var i in players) {

			// show worms and name
			this.showWormScore((parseInt(i, 10) + 1), lt[players[i].color], players[i].name, players[i].score);

		}

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
		console.log(color);
		// assign css style to worm
		this.wormsScore[color].element.addClass('position' + position);

		// show worm
		this.wormsScore[color].show();

		// show name and score
		if (!this.textName[color]) {
			this.textName[color] = new MAF.element.Text({
				totalLines: 1,
			});
		}

		this.textName[color].setText(name + ' ' + score);
		this.textName[color].element.addClass('ingameText');
		this.textName[color].element.addClass('name');
		this.textName[color].element.addClass('position' + position);
		this.textName[color].appendTo(this);
		this.textName[color].show();

	},

	onBroadcast: function (event) {
		var key = event.payload.key, playersLength, players, i, player, lt = {
			'#ed008c': 'red',
			'#8cc63e': 'green',
			'#fcb040': 'yellow',
			'#008ad2': 'blue'
		};

		if (key === 'dugout:refresh_players') {
			players = dugout.getOrderedPlayers();
			playersLength = players.length;
			for (i = 0; i < playersLength; i++) {
				player = players[i];
				this.updateScore(i + 1, lt[player.color], player.name, Math.round(player.score / 10));
			}
		}
		else if (key === 'dugout:end_game') {
			MAF.application.loadView('view-PodiumView');
		}
	}

});