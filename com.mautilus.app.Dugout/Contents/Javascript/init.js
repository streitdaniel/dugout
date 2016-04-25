// Include your views
include('Javascript/Views/SplashscreenView.js');
include('Javascript/Views/HomeView.js');
include('Javascript/Views/CountdownView.js');
include('Javascript/Views/PlaygroundView.js');
include('Javascript/Views/PodiumView.js');

//Include your theme
include('Javascript/Core/theme.js');

// Initialize application with view config
MAF.application.init({
	views: [
		{ id: 'view-SplashscreenView', viewClass: SplashscreenView },
		{ id: 'view-HomeView', viewClass: HomeView },
		{ id: 'view-CountdownView', viewClass: CountdownView },
		{ id: 'view-PlaygroundView', viewClass: PlaygroundView },
		{ id: 'view-PodiumView', viewClass: PodiumView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-SplashscreenView',
	settingsViewId: 'view-About'
});