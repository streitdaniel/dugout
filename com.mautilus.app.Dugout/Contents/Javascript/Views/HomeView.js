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
		};

		this.onBroadcast.subscribeTo(MAF.messages, MAF.messages.eventType);
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
		var players,
			i,
			playersWrapper, rowString, playerState,
			row, wormImg, name,
			colors, emptySlotMessage, numberOfConnectedPlayers;

		emptySlotMessage = 'Waiting for player...';

		//players = dugout.getPlayers();
		players = [{
			name: "Player 1",
			color: "#ed008c",
			position: {
				x: 0,
				y: 0
			},
			direction: 0,
			speed: 2,
			turning_speed: 3,
			dead: false,
			ready: false,
			score: 0
		},
			{
				name: "Player 3",
				color: "#ed008c",
				position: {
					x: 0,
					y: 0
				},
				direction: 0,
				speed: 2,
				turning_speed: 3,
				dead: false,
				ready: false,
				score: 0
			}, {
				name: "Player 4",
				color: "#ed008c",
				position: {
					x: 0,
					y: 0
				},
				direction: 0,
				speed: 2,
				turning_speed: 3,
				dead: false,
				ready: false,
				score: 0
			}];
		numberOfConnectedPlayers = players.length;

		console.log(players);

		colors = ['red', 'green', 'yellow', 'blue'];

		playersWrapper = new MAF.element.Container();
		playersWrapper.element.addClass('homeView-playersWrapper');

		for (i = 0; i < 4; i++) {
			row = new MAF.element.Container().appendTo(playersWrapper);
			row.element.addClass('homeView-playersWrapper-row row' + (i + 1));

			wormImg = new MAF.element.Image().appendTo(row);
			wormImg.element.addClass('worm ' + colors[i]);

			name = new MAF.element.Text({});
			name.element.addClass(playerState);
			if (i < numberOfConnectedPlayers) {
				rowString = players[i].name;
				playerState = players[i].ready === true ? 'ready' : 'connected'

			} else {
				rowString = emptySlotMessage;
			}
			name.setText(rowString);
			
			if(playerState) {
				name.element.addClass(playerState);
			}
			name.appendTo(row);

			this.playersTable.push({
				state: this.PLAYER_STATE.EMPTY,
				name: name
			});
		}
		playersWrapper.appendTo(this);
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

	onBroadcast: function (event) {
		console.log('[HomeView] Broadcast recieved');
		var key = event.payload.key;

		if (key === 'dugout:countdown') {
			// this.onStartGame();
			MAF.application.loadView('view-CountdownView');

		} else if (key === 'dugout:refresh_players') {
			console.log('TODO: refresh players table');
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

		MAF.messages.store('dugout:refresh_players', '');
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