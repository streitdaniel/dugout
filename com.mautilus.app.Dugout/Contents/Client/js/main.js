// JavaScript Document
// file: main.js

Element.prototype.hasClass = function(className) {
	return (this.className.indexOf(className) >= 0) ? true : false;
};
Element.prototype.addClass = function(className) {
	this.className = this.className.replace(className, '') + ' ' + className;
};
Element.prototype.removeClass = function(className) {
	this.className = this.className.replace(className, '');
};

/**
 * Detect Touch Screen
 * @returns {Boolean}
 */
function isTouchDevice() {
	return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}



/**
* App
* Singleton
*/
var App = new (function(){
	// private variable
	var privatVar = null;
	
	// public variable
	this.client = {};   // network client
	this.scenes = [];   // list of scenes
	this.COLORS_ID = {"red": 1, "green": 2, "yellow": 3, "blue": 4};
	this.playerColorId = 0;  // 1 - red, 2 - green, 3 - yellow, 4 - blue, 0 - no-color
	
	this.activeView = {};
	
	/**
	 * To initialize App
	 */
	this.init = function() {
		connectingView.init();
		loginView.init();
		startView.init();
		controlsView.init();
		deathView.init();
		scoreView.init();
		continueView.init();
		
		connectingView.show();
	};
	
	/**
	 * To set color by setting class to viewport
	 * @param {String|Number} color
	 */
	this.setColorBg = function(color) {
		var colorId = color;
		if(typeof color === 'string') {
			colorId = this.COLORS_ID[color];
		}
		
		var el = document.getElementById('viewport');
		el.className = el.className.replace(/color-\d/gi, "");
		el.addClass('color-'+colorId);
	};
	
	/**
	 * To set player colorId
	 * @param {String|Number} color
	 */
	this.setColorId = function(color) {
		var colorId = color;
		if(typeof color === 'string') {
			colorId = this.COLORS_ID[color];
		}
		this.playerColorId = colorId;
		
		this.setColorBg(colorId);
	};
	
	/**
	 * To remove color
	 */
	this.removeColor = function() {
		el.className = el.className.replace(/color-\d/gi, "");
	};
})();

/**
* Client
* Singleton
*/
var Client = new (function(){
	// public variable
	
	// public methods
	/**
	 * To initialize Client
	 */
	this.init = function() {
		this.room = new MAF.Room();
		
		// onConnected
		room.addEventListener('connected', function (event) {
			console.log('[Room] i has connected', event.user);
		});
		
		// onDisconnected
		room.addEventListener('disconnected', function (event) {
			console.log('[Room] onDisconnected', event.user);
			var d = event.data;
		});
		
		// onCreated
		room.addEventListener('created', function (event) {
			console.log('[Room] onCreated', event.user);
		});
		
		// onDestroyed
		room.addEventListener('destroyed', function (event) {
			console.log('[Room] onDestroyed', event.user);
		});
		
		// onError
		room.addEventListener('error', function (event) {
			console.log('[Room] onError', event.user);
		});
		
		// onJoined
		room.addEventListener('joined', function (event) {
			console.log('[Room] user joined', event.user);
		});
		
		// onHasLeft
		room.addEventListener('hasLeft', function (event) {
			console.log('[Room] user left', event.user);
		});
		
		// onData
		room.addEventListener('data', function (event) {
			Client.processData(event);
		});
		
		window.addEventListener('unload', function (event) {
			this.room.destroy();
			this.room = null;
		}, false);
	};
	
	/**
	 * To send message to room
	 * @param {String} message
	 */
	this.send = function(message) {
		this.room.send(message);
	};
	
	/**
	 * To process the received data
	 * @param {Object} event
	 * @param {String} event.hash - The room hash
	 * @param {String} event.user - The user id that joined the room
	 * @param {String} event.data - data
	 */
	this.processData = function(event) {
		var data = event.data;
		data.clients = data.clients || [];
		data.attrs = data.attrs || {};
		// data = {event: ‘nazev_udalosti‘,  clients: [], attrs: {}}
		
		if(data.clients === [] || data.clients.indexOf(App.room.user) > -1) {
			// ok
		} else {
			// not for me
			return false;
		}
		
		switch(data.event) {
			case 'tv_accepted':
				if(App.activeView !== loginView) {
					App.activeView.hide();
				}
				
				App.setColorId(data.attrs.color);
				loginView.setName(data.attrs.name);
				loginView.show();
				break;
			case 'tv_rejected':
				console.log('tv_rejected TODO');
				break;
			case 'tv_all_ready':
				if(App.activeView !== startView) {
					App.activeView.hide();
				}
				// data.attrs.num_players 
				startView.show('allready');
				break;
			case 'tv_not_all_ready': 
				if(App.activeView !== startView) {
					App.activeView.hide();
				}
				startView.show('notAllready');
				break;
			case 'tv_show_controls':
				if(App.activeView !== controlsView) {
					App.activeView.hide();
				}
				controlsView.show();
				break;
			case 'tv_death': 
				if(App.activeView !== deathView) {
					App.activeView.hide();
				}
				deathView.show();
				break;
			case 'tv_score':
				if(App.activeView !== scoreView) {
					App.activeView.hide();
				}
				scoreView.show();
				break;
			case 'tv_continue':
				if(App.activeView !== continueView) {
					App.activeView.hide();
				}
				continueView.show();
				break;
			case 'dbg_message': 
				console.log('[Client] dbg_message: ' + data.attrs.message);
				break;
			default:
				console.log('Error unknown event :(');
				break;
		}
	};
	
})();

/**
* Class View
*/
var View = (function() {
	
	// constructor
	var View = function(id) {
		this.id = id;
	};
	
	View.prototype = {
		constructor: View,  // keep contruct
		/**
		 * To init
		 */
		init: function() {
			this.el = document.getElementById(this.id) || null;
		},
		
		/**
		 * To show view
		 * @virtual
		 */
		show: function() {
			App.activeView = this;
			this.el.style.display = 'block';
		},
		/**
		 * To render view
		 * @virtual
		 */
		render: function() {
			//this.el.style.display = 'block';
		},
		/**
		 * To hide view
		 * @virtual
		 */
		hide: function() {
			this.el.style.display = 'none';
		}
	};
	return View;
})();

/******************************************************************************
 * VIEW instances
 ******************************************************************************/
/**
 * connectingView. Instance of View
 */
var connectingView = function(){
	
	var view = new View('connecting');
	return view;
}();

/**
 * loginView. Instance of View
 */
var loginView = function(){
	
	var view = new View('login');
	/**
	 * To set player name
	 * @param {String} name - player name
	 */
	view.setName = function(name) {
		var input = document.getElementById('input-login');
		input.value = name;
	};
	return view;
}();

/**
 * startView. Instance of View
 */
var startView = function(){
	
	var view = new View('start');

	/**
	 * To init
	 */
	view.init = function() {
		this.el = document.getElementById(this.id) || null;

		// click on start button
		this.btnStart = document.getElementById('btn-start');
		this.btnStart.addEventListener('click', function() { App.clickedStart(); })
	}
	
	return view;
}();

/**
 * controlsView. Instance of View
 */
var controlsView = function(){
	
	var view = new View('controls');
	return view;
}();

/**
 * connectingView. Instance of View
 */
var deathView = function(){
	
	var view = new View('death');
	return view;

}();

/**
 * scoreView. Instance of View
 */
var scoreView = function(){
	
	var view = new View('score');
	return view;
}();

/**
 * continueView. Instance of View
 */
var continueView = function(){
	
	var view = new View('continue');
	return view;
}();


/**
 * testView. Instance of View
 */
var testView = function(){
	
	var view = new View();
	view.id = 'test';
	view.render = function() {
		console.log('[connectingView] render');
	};
	view.hide = function() {
		console.log('[connectingView] hide');
	};
	
	return view;
}();
