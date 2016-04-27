Dugout_Audio = function(app) {

    var APPLAUSE_PATH = 'Sounds/applause.mp3',
        COUNTDOWN_PATH = 'Sounds/countdown.mp3',
        DEATH_PATH = 'Sounds/death.mp3',
        APPLAUSE_SOUND = 0,
        COUNTDOWN_SOUND = 1,
        DEATH_SOUND = 2;

    this.APPLAUSE_SOUND = APPLAUSE_SOUND;
    this.COUNTDOWN_SOUND = COUNTDOWN_SOUND;
    this.DEATH_SOUND = DEATH_SOUND;
    this.playSound = playSound;

    MAF.mediaplayer.init();

    (function (event) {
        log(">>>>>>>>>>>>>>>>>>>>>>>");
        log(event.payload);
        log("<<<<<<<<<<<<<<<<<<<<<<<");
    }).subscribeTo(MAF.mediaplayer, 'onStateChange');

    function playSound(sound) {
        switch (sound) {
            case APPLAUSE_SOUND:
                play(APPLAUSE_PATH);
                break;
            case COUNTDOWN_SOUND:
                play(COUNTDOWN_PATH);
                break;
            case DEATH_SOUND:
                play(DEATH_PATH);
                break;
        }
    }

    function play(path) {
        var playlist = new MAF.media.Playlist();
        playlist.addEntryByURL(widget.getUrl(path));
        console.log("######################## PLAYING #########################");
        MAF.mediaplayer.playlist.set(playlist);
        MAF.mediaplayer.playlist.start();
    }

};