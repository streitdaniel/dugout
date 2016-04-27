Dugout = function() {
    var CONST_BASE_SPEED = 2,
        CONST_TURNING_SPEED = 3,
        CONST_COLORS = ['#ed008c', '#8cc63e', '#fcb040', '#008ad2'],
        audio = new Dugout_Audio(this),
        graphics = new Dugout_Graphics(this),
        logic = new Dugout_Logic(this),
        players = {},
        playersLength = 0,
        allPlayersReady = false,
        room,
        qrCodeURL;

    this.run = run;
    this.getQRCode = getQRCode;
    this.getPlayers = getPlayers;
    this.renderBonuses = renderBonuses;
    this.setNewPosition = setNewPosition;
    this.getVisibleCanvases = getVisibleCanvases;
    this.detectCollisions = detectCollisions;
    this.killPlayer = killPlayer;
    this.adjustPlayersAbility = adjustPlayersAbility;
    this.isSlimeAt = isSlimeAt;
    this.addScore = addScore;
    this.CONST_COLORS_NAMES = ['blue', 'green', 'red', 'yellow'];

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
                    onData(payload.user, payload.data);
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

    function onData(userKey, data) {
        switch (data.event) {
            case 'cl_join':
                clJoin(userKey, data);
                break;
            case 'cl_ready':
                clReady(userKey, data);
                break;
            case 'cl_start_game':
                clStartGame(userKey);
                break;
            case 'cl_turn_left':
                clTurn(userKey, true);
                break;
            case 'cl_turn_right':
                clTurn(userKey, false);
                break;
            case 'cl_exit':
                clExit(userKey);
                break;
        }
    }

    function sendMessage(event, key, data) {
        if (key.toString() === key) {
            key = [key];
        }
        room.send({ event: event, clients: key, attrs: data });
    }

    function addPlayer(user) {
        players[user] = {
            name: "Player " + (playersLength + 1),
            color: CONST_COLORS[players.length],
            position: {
                x: 0,
                y: 0
            },
            direction: 0,
            speed: CONST_BASE_SPEED,
            turning_speed: CONST_TURNING_SPEED,
            dead: false,
            ready: false
        };
        playersLength++;
    }

    function removePlayer(user) {
        var i, key;
        delete players[user];
        i = 0;
        for (key in players) {
            players[key].color = CONST_COLORS[i];
            i++;
        }
        playersLength--;
    }

    function getQRCode() {
        return qrCodeURL;
    }

    function getPlayers() {
        return players;
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

    function getVisibleCanvases() {
        return graphics.getVisibleCanvases();
    }

    function detectCollisions() {
        logic.detectDeaths(players);
        logic.detectBonuses(players);
    }

    function killPlayer(key) {
        players[key].dead = true;
        sendMessage('tv_death', key);
    }

    function adjustPlayersAbility(key, ability, diff, others) {
        var k;
        if (!others) {
            players[key][ability] += diff;
        }
        else {
            for (k in players) {
                if (k === key) { continue; }
                players[k][ability] += diff;
            }
        }
    }

    function isSlimeAt(x, y) {
        return graphics.isSlimeAt(x, y);
    }

    function addScore() {
        var key;
        for (key in players) {
            if (!players[key].dead) {
                players[key].score += 1;
            }
        }
    }
    
    function clJoin(key) {
        var notReady = [], k;
        if (playersLength < 4) {
            addPlayer(key);
            if (allPlayersReady) {
                allPlayersReady = false;
                for (k in players) {
                    if (players[k].ready) {
                        notReady.push(k);
                    }
                }
                sendMessage('tv_not_all_ready', notReady, {});
            }
            sendMessage("tv_accepted", key, { color: players[key].color, name: players[key].name });
        }
        else {
            sendMessage("tv_rejected", key, { error: { code: 429, message: "Too many players" } });
        }
    }

    function clReady(key, data) {
        var k, allReady = true;
        if (data && data.attrs && data.attrs.name && data.attrs.name.length > 0) {
            players[key].name = data.attrs.name;
        }
        players[key].ready = true;
        for (k in players) {
            if (!players[k].ready) {
                allReady = false;
                break;
            }
        }
        if (allReady) {
            everyoneReady();
        }
    }

    function clStartGame(key) {
        startTheGame();
    }

    function clTurn(key, left) {
        if (left) {
            players[key].direction -= players[key].turning_speed * Math.PI / 180;
        }
        else {
            players[key].direction += players[key].turning_speed * Math.PI / 180;
        }
    }

    function clExit(key) {
        removePlayer(key);
    }

    function everyoneReady() {
        sendMessage('tv_all_ready', [], { num_players: playersLength });
        allPlayersReady = true;
    }

    function startTheGame() {
        countdown();
        setTimeout(function() {
            startDigging();
        }, 4000);
    }

    function countdown() {

    }

    function startDigging() {
        var key, playing = [];
        for (key in players) {
            playing.push(key);
        }
        sendMessage('tv_show_controls', playing, {});
    }

    function restartGame() {
        var key, playing = [];
        for (key in players) {
            playing.push(key);
        }
        sendMessage('tv_continue', playing, {});
    }

};