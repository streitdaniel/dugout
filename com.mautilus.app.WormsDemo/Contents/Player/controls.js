(function() {
    var left = false,
        right = false,
        room = new MAF.Room(),
        vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.oVibrate || navigator.msVibrate || function() {};

    window.addEventListener('unload', function (event) {
        room.destroy();
        room = null;
    }, false);

    document.getElementById("turn-l").addEventListener("touchstart", function() {
        left = true;
        vibrate(100);
    });
    document.getElementById("turn-l").addEventListener("touchend", function() {
        left = false;
    });
    document.getElementById("turn-r").addEventListener("touchstart", function() {
        right = true;
        vibrate(100);
    });
    document.getElementById("turn-r").addEventListener("touchend", function() {
        right = false;
    });

    setInterval(function () {
        if (left && !right) {
            room.send({ e: 'turn', d: 'left' });
        }
        else if (right && !left) {
            room.send({ e: 'turn', d: 'right' });
        }
    }, 1000 / 30);

})();