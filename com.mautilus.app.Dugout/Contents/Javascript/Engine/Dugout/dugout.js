Dugout = function() {
    var CONST_BASE_SPEED = 8,
        CONST_TURNING_SPEED = 3,
        CONST_COLORS = ['#ed008c', '#8cc63e', '#fcb040', '#008ad2'],
        audio = new Dugout_Audio(this),
        graphics = new Dugout_Graphics(this),
        logic = new Dugout_Logic(this),
        players = {},
        playersLength = 0,
        playersAlive = 0,
        allPlayersReady = false,
        room,
        qrCodeURL;

    this.run = run;
    this.audio = audio;
    this.getQRCode = getQRCode;
    this.getPlayers = getPlayers;
    this.getBonuses = getBonuses;
    this.getOrderedPlayers = getOrderedPlayers;
    this.renderBonuses = renderBonuses;
    this.setNewPosition = setNewPosition;
    this.getVisibleCanvases = getVisibleCanvases;
    this.detectCollisions = detectCollisions;
    this.killPlayer = killPlayer;
    this.adjustPlayersAbility = adjustPlayersAbility;
    this.isSlimeAt = isSlimeAt;
    this.addScore = addScore;
    this.startDigging = startDigging;
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
                    if (typeof payload.data == "string") {
                        payload.data = JSON.parse(payload.data);
                    }
                    onData(payload.user, payload.data);
                    break;
                default:
                    log(event.type, payload);
                    break;
            }
        }).subscribeTo(room, ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);

        // If Room socket is connected create and join room
        if (room.connected) room.join();
    }

    function onDisconnected() {

    }

    function onCreated(payload) {
        qrCodeURL = widget.getUrl('Client/index.html?hash=' + payload.hash);
    }

    function onDestroyed() {

    }

    function onJoined(payload) {
        clJoin(payload.user);
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

    function sendEvent(event) {
        MAF.messages.store("dugout:" + event, event);
    }

    function addPlayer(user) {
        players[user] = {
            name: "Player " + (playersLength + 1),
            color: CONST_COLORS[playersLength],
            position: {
                x: 0,
                y: 0
            },
            direction: 0,
            speed: CONST_BASE_SPEED,
            turning_speed: CONST_TURNING_SPEED,
            dead: false,
            ready: false,
            score: 0,
            heals: 0
        };
        playersLength++;
        sendEvent("refresh_players");
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
        sendEvent("refresh_players");
        if (playersLength == 0) {
            endGame();
        }
    }

    function getQRCode() {
        return qrCodeURL;
    }

    function getPlayers() {
        return players;
    }

    function getOrderedPlayers() {
        var key, max1, max2, max3, max4, max1v = -1, max2v = -1, max3v = -1, max4v, orderedPlayers = [];
        for (key in players) {
            max4 = key;
            max4v = players[key].score;
            if (max4v > max3v) {
                max4v = max3v;
                max4 = max3;
                max3 = key;
                max3v = players[key].value;
            }
            if (max3v > max2v) {
                max3v = max2v;
                max3 = max2;
                max2 = key;
                max2v = players[key].value;
            }
            if (max2v > max1v) {
                max2v = max1v;
                max2 = max1;
                max1 = key;
                max1v = players[key].value;
            }
        }
        if (players[max1]) { orderedPlayers.push(players[max1]); }
        if (players[max2]) { orderedPlayers.push(players[max2]); }
        if (players[max3]) { orderedPlayers.push(players[max3]); }
        if (players[max4]) { orderedPlayers.push(players[max4]); }
        return orderedPlayers;
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
        audio.playSound(audio.DEATH_SOUND);
        sendMessage('tv_death', key);
        playersAlive--;
        if (playersAlive < 2) {
            endGame();
        }
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
        sendEvent("refresh_players");
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
        sendEvent("refresh_players");
        for (k in players) {
            if (!players[k].ready) {
                allReady = false;
                break;
            }
        }
        if (playersLength === 4 && allReady) {
            startTheGame();
        }
        else if (allReady) {
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
        var key, playing = [];
        for (key in players) {
            playing.push(key);
        }
        sendMessage('tv_all_ready', playing, { num_players: playersLength });
        allPlayersReady = true;
    }

    function startTheGame() {
        countdown();
        randomlyPositionPlayers();
        graphics.renderFrame();
    }

    function countdown() {
        sendEvent("countdown");
    }

    function startDigging() {
        var key, playing = [];
        for (key in players) {
            playing.push(key);
        }
        playersAlive = playersLength;
        sendMessage('tv_show_controls', playing, {});
        graphics.startRendering();
        logic.startAddingBonuses();
    }

    function restartGame() {
        var key, playing = [];
        for (key in players) {
            players[key].ready = false;
            players[key].speed = CONST_BASE_SPEED;
            players[key].turning_speed = CONST_TURNING_SPEED;
            players[key].dead = false;
            players[key].score = 0;
            playing.push(key);
        }
        sendMessage('tv_continue', playing, {});
    }

    function endGame() {
        logic.stopAddingBonuses();
        graphics.stopRendering();
        sendEvent("end_game");
    }

    function randomlyPositionPlayers() {
        var i, k, keys = [], keysLength, x, y, direction;
        for (k in players) {
            keys.push(k);
        }
        shuffle(keys);
        keysLength = keys.length;
        for (i = 0; i < keysLength; i++) {
            x = Math.random() * 755;
            y = Math.random() * 350;
            direction = Math.random() * Math.PI / 2;
            if (i == 0) {
                y += 50;
                x += 67;
                direction += Math.PI / 2;
            }
            else if (i == 1) {
                x += 890;
                y += 50;
                direction += Math.PI;
            }
            else if (i == 2) {
                y += 450;
                x += 67;
            }
            else if (i == 3) {
                x += 890;
                y += 450;
                direction += 3 * Math.PI / 2;
            }
            players[keys[i]].position.x = x;
            players[keys[i]].position.y = y;
            players[keys[i]].direction = direction;
        }
    }

    function getBonuses() {
        return logic.getBonuses();
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

};