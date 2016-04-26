include('Javascript/Views/Game.js');

Theme.set({
    BaseGlow: {
        styles: {
            color: 'white',
            backgroundColor: 'grey'
        }
    },
    BaseFocus: {
        styles: {
            backgroundColor: '#5f429c'
        }
    }
});

MAF.application.init({
    views: [
        { id: 'view-Game', viewClass: Game }
    ],
    defaultViewId: 'view-Game'
});