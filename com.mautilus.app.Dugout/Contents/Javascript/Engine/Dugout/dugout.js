Dugout = function() {
    var CONST_BASE_SPEED = 2,
        CONST_COLORS = ['#ed008c', '#8cc63e', '#fcb040', '#008ad2'],
        audio = new Dugout_Audio(this),
        graphics = new Dugout_Graphics(this),
        logic = new Dugout_Logic(this),
        players = {},
        room,
        qrCodeURL;

    this.run = run;
    this.getQRCode = getQRCode;
    this.getPlayers = getPlayers;
    this.getBonuses = getBonuses;
    this.renderBonuses = renderBonuses;
    this.setNewPosition = setNewPosition;

    function run() {
        room = new MAF.PrivateRoom(new Date().getTime() + 'dugout_game');
        (function (event) {
            var payload = event.payload;
            switch (event.type) {
                case 'onConnected':
                    log('room connected');
                    // If connected but room not joined make sure to join it automaticly
                    if (!room.joined) room.join();
                    return;
                case 'onDisconnected':
                    onDisconnected();
                    log('connection lost waiting for reconnect and automaticly rejoin');
                    return;
                case 'onCreated':
                    // Create an url to the client application and pass the hash as querystring
                    onCreated(payload);
                    log('room created', payload.hash);
                    return;
                case 'onDestroyed':
                    onDestroyed(); // Reset clients
                    log('room destroyed', payload.hash);
                    return;
                case 'onJoined':
                    // If user is not the app then log the user
                    if (payload.user !== room.user) {
                        onJoined(payload);
                        log('user joined', payload.user);
                    }
                    return;
                case 'onHasLeft':
                    // If user is not the app then log the user
                    if (payload.user !== room.user)
                        onHasLeft(payload);
                        log('user has left', payload.user);
                    return;
                case 'onData':
                    onData(payload.data);
                    break;
                default:
                    log(event.type, payload);
                    break;
            }
        }).subscribeTo(room, ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);

        // If Room socket is connected create and join room
        if (room.connected) room.join();
        console.log("CONNECTED ---------------------------------");
    }

    function onDisconnected() {

    }

    function onCreated(payload) {
        qrCodeURL = widget.getUrl('Client/index.html?hash=' + payload.hash);
    }

    function onDestroyed() {

    }

    function onJoined(payload) {
        addPlayer(payload.user);
    }

    function onHasLeft(payload) {
        removePlayer(payload.user);
    }

    function onData(data) {

    }

    function addPlayer(user) {
        players[user] = {
            color: CONST_COLORS[players.length],
            position: {
                x: 0,
                y: 0
            },
            direction: 0,
            speed: CONST_BASE_SPEED,
            dead: false
        };
    }

    function removePlayer() {
        var i, key;
        delete players[user];
        i = 0;
        for (key in players) {
            players[key].color = CONST_COLORS[i];
            i++;
        }
    }

    function getQRCode() {
        return qrCodeURL;
    }

    function getPlayers() {
        return players;
    }

    function getBonuses() {

    }

    function setNewPosition(p) {
        var key;
        for (key in p) {
            players[key].position = p[key].newPosition;
        }
    }

    function renderBonuses() {
        return logic.renderBonuses();
    }

};