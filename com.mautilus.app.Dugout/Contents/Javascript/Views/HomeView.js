/**
 * Home view
 *
 * @class HomeView
 * @extends MAF.system.FullscreenView
 */
var HomeView = new MAF.Class({
	ClassName: 'HomeView',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		console.log('[HomeView] initialize');
		this.parent();
	},

	/**
	 * Called - once, when view is created
	 * Do here - Initializes the basic objects on the view
	 * Place here - Register your global listeners and variables
	 */
	initView: function () {
		console.log('[HomeView] initView');

		this.playersTable = [];
		this.PLAYER_STATE = {
			EMPTY: 0,
			CONNECTED: 1,
			READY: 2
		}
	},

	/**
	 * Called - Once, when view is created
	 * Do here - View is loaded in the DOM tree
	 * Place here - Create and append most -if not all- of your elements here
	 */
	createView: function () {
		console.log('[HomeView] createView');

		var view = this,
			wrapper, logo, qrCode;

		wrapper = new MAF.element.Container();
		wrapper.element.addClass('homeView-wrapper');

		logo = new MAF.element.Image({
			autoShow: true,
			hideWhileLoading: true,
			src: '/Images/splash_logo_male.png'
		});
		logo.element.addClass('HomeView-wrapper-logo');

		qrCode = new MAF.element.Image({
			styles: {
				top: 100,
				left: 1530,
				width: 275
			}
		}).setSource(QRCode.get('192.168.11.101:8080'));
		qrCode.appendTo(wrapper);

		logo.appendTo(wrapper);
		wrapper.appendTo(this);

		// inits players table
		(function () {
			var i,
				playersWrapper,
				row, wormImg, name,
				colors;

			colors = ['red', 'green', 'yellow', 'blue'];

			playersWrapper = new MAF.element.Container();
			playersWrapper.element.addClass('homeView-wrapper-playersWrapper');

			for (i = 0; i < 4; i++) {
				row = new MAF.element.Container().appendTo(playersWrapper);
				row.element.addClass('homeView-wrapper-playersWrapper-row row' + (i + 1));

				wormImg = new MAF.element.Image().appendTo(row);
				wormImg.element.addClass('worm ' + colors[i]);

				name = new MAF.element.Text({
					data: 'Waiting for Player' + (i + 1) + '...'
				}).appendTo(row);

				view.playersTable.push({
					state: view.PLAYER_STATE.EMPTY,
					name: name
				});
			}
			playersWrapper.appendTo(wrapper);
		})();
	},

	afterPlayerConnected: function () {
		var freeSlotIndex = this.getFirstFreeSlotIndex(),
			player, name;

		if (freeSlotIndex === -1) {
			// Room is full
			console.log('Sorry! Room is full :(');
			return;
		}

		player = this.playersTable[freeSlotIndex];
		name = player.name;

		// set player's state to connected
		name.setText('Player' + (freeSlotIndex + 1));
		name.element.addClass('connected');
		player.state = this.PLAYER_STATE.CONNECTED;
	},

	afterPlayerReady: function (playerIndex) {
		// set player's state to ready
		var player = this.playersTable[playerIndex],
			freeSlotIndex;

		player.name.element.removeClass('connected');
		player.name.element.addClass('ready');
		player.state = this.PLAYER_STATE.READY;

		freeSlotIndex = this.getFirstFreeSlotIndex();

		if (this.isEverybodyReady()) {
			this.afterAllReady();
		}
	},

	afterPlayerDisconnected: function (playerIndex) {
		var player = this.playersTable[playerIndex];

		player.name.element.removeClass('connected');
		player.name.element.removeClass('ready');
		player.name.setText('Waiting for Player' + (playerIndex + 1) + '...');
		player.state = this.PLAYER_STATE.EMPTY;
	},

	afterAllReady: function () {
		console.log('all players are ready!');
		this.onStartGame();
	},

	getFirstFreeSlotIndex: function () {
		var i;

		for (i = 0; i < 4; i++) {
			if (this.playersTable[i].state === this.PLAYER_STATE.EMPTY) {
				return i;
			}
		}

		// Room is full
		return -1;
	},

	isEverybodyReady: function () {
		var i;

		for (i = 0; i < 4; i++) {
			if (this.playersTable[i].state !== this.PLAYER_STATE.READY) {
				return false;
			}
		}

		return true;
	},

	onStartGame: function () {
		MAF.application.loadView('view-CountdownView');
	},

	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is visible to the user from here on
	 * Place here - Update your elements contents if it is dynamic and place listeners that are canceled in the hideView
	 */
	updateView: function () {
		console.log('[HomeView] updateView');
	},

	/**
	 * Called - Everytime the user visits the view
	 * Do here - View is selected as currentview
	 * Place here - Remembered states are restored to their elements
	 */
	selectView: function () {
		console.log('[HomeView] selectView');
	},

	/**
	 * Called - Everytime the user visits the view
	 * Do here - The focus on the view is placed
	 * Place here - If you want an other focus, do so here
	 */
	focusView: function () {
		console.log('[HomeView] focusView');
	},

	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The application deselects the view as it's current
	 * Place here - Cancel listeners that are no longer necessary
	 */
	unselectView: function () {
		console.log('[HomeView] unselectView');
	},

	/**
	 * Called - Everytime the user leaves the view
	 * Do here - The view is hidden from the user
	 * Place here - Cancel listeners that are no longer necessary
	 */
	hideView: function () {
		console.log('[HomeView] hideView');
	},

	/**
	 * Called - Once, when application is destroyed
	 * Do here - Removes all elements on the view
	 * Place here - If the application leaves memory leaks and/or pollution warnings in your console remove them here.
	 */
	destroyView: function () {
		console.log('[HomeView] destroyView');
	}
});