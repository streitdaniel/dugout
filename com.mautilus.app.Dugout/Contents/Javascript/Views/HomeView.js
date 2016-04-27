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

		this.emptySlotMessage = 'Waiting for player...';
		this.onBroadcast.subscribeTo(MAF.messages, MAF.messages.eventType, this);
	},

	/**
	 * Called - Once, when view is created
	 * Do here - View is loaded in the DOM tree
	 * Place here - Create and append most -if not all- of your elements here
	 */
	createView: function () {
		console.log('[HomeView] createView');

		var view = this,
			logo, qrCode;

		logo = new MAF.element.Image({
			autoShow: true,
			hideWhileLoading: true,
			src: '/Images/splash_logo_male.png'
		});
		logo.element.addClass('HomeView-logo');

		qrCode = new MAF.element.Image({
			styles: {
				top: 100,
				left: 1530,
				width: 275
			}
		}).setSource(QRCode.get(dugout.getQRCode()));
		qrCode.appendTo(this);

		logo.appendTo(this);
		this.drawTable();
	},

	drawTable: function () {
		var i,
			playersWrapper,
			row, wormImg, name,
			colors;

		colors = ['red', 'green', 'yellow', 'blue'];

		playersWrapper = new MAF.element.Container();
		playersWrapper.element.addClass('homeView-playersWrapper');

		for (i = 0; i < 4; i++) {
			row = new MAF.element.Container().appendTo(playersWrapper);
			row.element.addClass('homeView-playersWrapper-row row' + (i + 1));

			wormImg = new MAF.element.Image().appendTo(row);
			wormImg.element.addClass('worm ' + colors[i]);

			name = new MAF.element.Text({
				data: this.emptySlotMessage
			});
			name.appendTo(row);

			this.playersTable.push({
				name: name
			});
		}
		playersWrapper.appendTo(this);
	},

	updateTable: function () {
		var players, i,	rowString, playerState,
			row, name, numberOfConnectedPlayers;

		players = dugout.getPlayers();
		numberOfConnectedPlayers = players.length;

		for (i = 0; i < 4; i++) {
			if (i < numberOfConnectedPlayers) {
				rowString = players[i].name;
				playerState = players[i].ready === true ? 'ready' : 'connected'

			} else {
				rowString = this.emptySlotMessage;
				playerState = null;
			}

			name = this.playersTable[i].name;
			name.element.removeClass('connected');
			name.element.removeClass('ready');
			name.setText(rowString);

			if(playerState) {
				name.element.addClass(playerState);
			}

			name.appendTo(row);
		}
	},

	onStartGame: function () {
		MAF.application.loadView('view-CountdownView');
	},

	onBroadcast: function (event) {
		console.log('[HomeView] Broadcast recieved');
		var key = event.payload.key;

		if (key === 'dugout:countdown') {
			this.onStartGame();

		} else if (key === 'dugout:refresh_players') {
			console.log('updating players table...');
			this.updateTable();
		}
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