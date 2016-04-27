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
* Singleton
*/
var App = new (function(){
	// private variable
	var privatVar = null;
	
	// public variable
	this.client = {};   // network client
	this.scenes = [];   // list of scenes
	this.colors = [];
	this.playerId = 0;  // 1 - red, 2 - green, 3 - yellow, 4 - blue, 0 - no-color
	
	/**
	 * To initialize App
	 */
	this.init = function() {
		connectingView.init();
		loginView.init();
	};
	
	/**
	 * To set color by setting class to viewport
	 */
	this.setColor = function(number) {
		var el = document.getElementById('viewport');
		el.className = el.className.replace(/color-\d/gi, "");
		el.addClass('color-'+number);
	};
	
	/**
	 * To remove color
	 */
	this.removeColor = function() {
		el.className = el.className.replace(/color-\d/gi, "");
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
		 * To render view
		 * @virtual
		 */
		render: function() {
			this.el.style.display = 'block';
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
