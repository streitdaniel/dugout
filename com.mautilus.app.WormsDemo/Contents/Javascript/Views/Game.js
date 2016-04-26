var Game = new MAF.Class({
    ClassName: 'Game',

    Extends: MAF.system.FullscreenView,

    initialize: function() {
        var view = this;
        view.parent();
        view.room = new MAF.PrivateRoom(view.ClassName);
    },

    createView: function() {
        var view = this,
            room = view.room,
            players = {},
            canvas,
            ctx,
            canvas2,
            ctx2,
            qrCode,
            getAnimationFrame,
            wormImg;

        wormImg = new Image();
        wormImg.src = "Images/cervik_in_1.png";

        canvas = new MAF.element.Core({
            element: Canvas,
            styles: {
                position: "absolute",
                width: (view.width > view.height)? view.height - 30 : view.width - 30,
                height: (view.width > view.height)? view.height - 30 : view.width - 30,
                top: (view.width > view.height)? 15 : (view.height - view.width) / 2,
                left: (view.width > view.height)? (view.width - view.height) / 2 : 15,
                border: "3px solid #d2d2d2",
                backgroundColor: "#000000"
            }
        }).appendTo(view);
        ctx = canvas.element.getContext('2d');
        if (ctx) {
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 5;
        }

        canvas2 = new MAF.element.Core({
            element: Canvas,
            styles: {
                position: "absolute",
                width: (view.width > view.height)? view.height - 30 : view.width - 30,
                height: (view.width > view.height)? view.height - 30 : view.width - 30,
                top: (view.width > view.height)? 15 : (view.height - view.width) / 2,
                left: (view.width > view.height)? (view.width - view.height) / 2 : 15,
            }
        }).appendTo(view);
        ctx2 = canvas2.element.getContext('2d');

        qrCode = new MAF.element.Image({
            styles: {
                position: "absolute",
                top: 15,
                left: 15,
                width: 300
            }
        }).appendTo(view);

        new MAF.control.TextButton({
            label: $_('CLOSE'),
            styles: {
                position: "absolute",
                top: 385,
                left: 15,
                width: 300,
                height: 40
            },
            textStyles: {
                anchorStyle: 'center'
            },
            events: {
                onSelect: function () {
                    MAF.application.exit();
                }
            }
        }).appendTo(view);

        new MAF.control.TextButton({
            label: $_('RESET'),
            styles: {
                position: 'absolute',
                top: 330,
                left: 15,
                width: 300,
                height: 40
            },
            textStyles: {
                anchorStyle: 'center'
            },
            events: {
                onSelect: function () {
                    reset();
                }
            }
        }).appendTo(view);

        getAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame;

        function control(player, direction) {
            if (direction === 'left') { players[player].direction -= 4 * Math.PI / 180 }
            else if (direction === 'right') { players[player].direction += 4 * Math.PI / 180 }
        }

        function animateFrame() {
            var key, player;
            getAnimationFrame(animateFrame);
            for (key in players) {
                player = players[key];
                ctx.strokeStyle = player.color;
                ctx.beginPath();
                ctx.moveTo(player.position.x, player.position.y);
                movePlayer(key);
                drawPlayer(key);
                ctx.lineTo(player.position.x, player.position.y);
                ctx.stroke();
            }
        }

        function movePlayer(key) {
            var x = players[key].position.x,
                y = players[key].position.y,
                direction = players[key].direction,
                speed = players[key].speed;
            x += Math.sin(direction) * speed;
            y -= Math.cos(direction) * speed;
            if (x > canvas.width) x = canvas.width - 1;
            if (x < 1) x = 1;
            if (y > canvas.height) y = canvas.height - 1;
            if (y < 1) y = 1;
            players[key].position.x = x;
            players[key].position.y = y;
        }

        function drawPlayer(key) {
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            ctx2.translate(players[key].position.x, players[key].position.y);
            ctx2.rotate(players[key].direction);
            ctx2.drawImage(wormImg, -7,- 17, 14, 34);
            ctx2.rotate( - players[key].direction);
            ctx2.translate(- players[key].position.x, - players[key].position.y);
        }

        function generateColor() {
            var r = Math.round(Math.random() * 128 + 64),
                g = Math.round(Math.random() * 128 + 64),
                b = Math.round(Math.random() * 128 + 64);
            return "#" + r.toString(16).replace("0x","") + g.toString(16).replace("0x","") + b.toString(16).replace("0x","");
        }

        function reset() {
            var key;
            for (key in players) {
                players[key].position = {
                    x: canvas.width / 2,
                    y: canvas.height / 2
                };
                players.direction = Math.random() * 2 * Math.PI;
            }
            canvas.width = canvas.width;
        }

        getAnimationFrame(animateFrame);

        (function (event) {
            var payload = event.payload;
            switch (event.type) {
                case 'onConnected':
                    log('room connected');
                    // If connected but room not joined make sure to join it automaticly
                    if (!room.joined) room.join();
                    return;
                case 'onDisconnected':
                    players = {}; // Reset clients
                    log('connection lost waiting for reconnect and automaticly rejoin');
                    return;
                case 'onCreated':
                    // Create an url to the client application and pass the hash as querystring
                    var url = widget.getUrl('Player/controls.html?hash=' + payload.hash);
                    qrCode.setSource(QRCode.get(url));
                    log('room created', payload.hash, url);
                    return;
                case 'onDestroyed':
                    players = {}; // Reset clients
                    log('room destroyed', payload.hash);
                    return;
                case 'onJoined':
                    // If user is not the app then log the user
                    if (payload.user !== room.user) {
                        log('user joined', payload.user);
                        players[payload.user] = {
                            color: generateColor(),
                            position: {
                                x: canvas.width / 2,
                                y: canvas.height / 2
                            },
                            direction: Math.random() * 2 * Math.PI,
                            speed: 1
                        };
                    }
                    return;
                case 'onHasLeft':
                    // If user is not the app then log the user
                    if (payload.user !== room.user)
                        log('user has left', payload.user);
                    return;
                case 'onData':
                    var data = payload.data;
                    if (data.e === 'turn')
                        return control(payload.user, data.d);
                    break;
                default:
                    log(event.type, payload);
                    break;
            }
        }).subscribeTo(room, ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);

        // If Room socket is connected create and join room
        if (room.connected) room.join();

    },

    destroyView: function() {
        var view = this;
        if (view.room) {
            view.room.leave(); // Leave room, will trigger an onLeaved of the app user
            view.room.destroy(); // Destroy the room
            delete view.room; // Unreference from view for GC
        }
    }

});