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
	
	this.init = function() {
		console.log("App init");
	};
})();


/**
* Class View
*/
var View = (function() {
	
	// constructor
	var View = function(id) {
		this.el = document.getElementById(id) || null;
	};
	
	View.prototype = {
		constructor: View,  // keep contruct
		/**
		 * To render view
		 * @virtual
		 */
		render: function() {
		},
		/**
		 * To hide view
		 * @virtual
		 */
		hide: function() {
			this.el.
		}
	};
	return View;
})();

/**
 * connectingView. Instance of View
 */
var connectingView = function(){
	
	var connectingView = new View('connecting');
	connectingView.render = function() {
		console.log('[connectingView] render');
	};
	connectingView.hide = function() {
		console.log('[connectingView] hide');
		
	};
	
	return connectingView;
}();
