Dugout_Graphics = function(app) {

    var RED_WORM = 0,
        GREEN_WORM = 1,
        YELLOW_WORM = 2,
        BLUE_WORM = 3,
        SPEED_UP = 4,
        SPEED_DOWN = 5,
        TURN_IN = 6,
        COIN = 7,
        HEAL = 8,
        DEATH_WORM = 9,
        rendering = false,
        canvasWidth = 1776,
        canvasHeight = 1000,
        pathCanvas,
        pathContext,
        slimeCanvas,
        slimeContext,
        wormCanvas,
        wormContext,
        bonusCanvas,
        bonusContext,
        spriteCanvas,
        spriteContext,
        loadedImages,
        imagesToLoad,
        getAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;

    prepareGraphics();
    prepareCanvases();

    function startRendering() {
        rendering = true;
        getAnimationFrame(render);
    }

    function render() {
        if (rendering) {
            getAnimationFrame(render);
        }
        renderFrame();
    }

    function renderFrame() {
        var players = app.getPlayers();
        players = prepareNewPosition(players);
        renderPath(players);
        renderSlime(players);
        renderWorms(players);
        if (app.renderBonuses()) {
            renderBonuses(app.getBonuses());
        }
        app.setNewPosition(players);
    }
    
    function renderPath(players) {
        var key, player;
        for (key in players) {
            player = players[key];
            pathContext.beginPath();
            pathContext.moveTo(player.position.x, player.position.y);
            pathContext.lineTo(player.newPosition.x, player.newPosition.y);
            pathContext.stroke();
        }
    }
    
    function renderSlime(players) {
        var key, player;
        for (key in players) {
            player = players[key];
            slimeContext.strokeStyle.color = player.color;
            slimeContext.beginPath();
            slimeContext.moveTo(player.position.x, player.position.y);
            slimeContext.lineTo(player.newPosition.x, player.newPosition.y);
            slimeContext.stroke();
        }
    }
    
    function renderWorms(players) {
        var key, player, wormImg;
        wormContext.clearRect(0, 0, canvasWidth, canvasHeight);
        for (key in players) {
            player = players[key];
            wormImg = getSpritePosition(getObjectByPlayerColor());
            wormContext.translate(player.position.x, player.position.y);
            wormContext.rotate(player.direction);
            wormContext.drawImage(spriteCanvas.element, wormImg.x, wormImg.y, wormImg.width, wormImg.height, -10,- 25, 21, 51);
            wormContext.rotate( - player.direction);
            wormContext.translate(- player.position.x, - player.position.y);
        }
    }
    
    function renderBonuses(bonuses) {
        var i, bonus, bonusImg, bonusesLength = bonuses.length;
        bonusContext.clearRect(0, 0, canvasWidth, canvasHeight);
        for (i = 0; i < bonusesLength; i++) {
            bonus = bonuses[i];
            bonusImg = getSpritePosition(bonus.type);
            bonusContext.drawImage(spriteCanvas.element, bonusImg.x, bonusImg.y, bonusImg.width, bonusImg.height, bonus.position.x, bonus.position.y, 49, 49);
        }
    }
    
    function prepareNewPosition(players) {
        var key, player, x, y, direction, speed;
        for (key in players) {
            player = players[key];
            if (player.dead) { continue; }
            direction = player.direction;
            speed = player.speed;
            x = player.position.x;
            y = player.position.y;
            x += Math.sin(direction) * speed;
            y -= Math.cos(direction) * speed;
            if (x > canvasWidth) x = canvasWidth - 1;
            if (x < 1) x = 1;
            if (y > canvasHeight) y = canvasHeight - 1;
            if (y < 1) y = 1;
            players[key].newPosition = { x: x, y: y };
        }
        return players;
    }

    function prepareCanvases() {
        var canvasStyles = { position: 'absolute', top: 0, left: 0, width: canvasWidth, height: canvasHeight };
        pathCanvas = MAF.element.Core({ element: Canvas, styles: canvasStyles });
        pathContext = pathCanvas.element.getContext('2d');
        slimeCanvas = MAF.element.Core({ element: Canvas, styles: canvasStyles });
        slimeContext = slimeCanvas.element.getContext('2d');
        wormCanvas = MAF.element.Core({ element: Canvas, styles: canvasStyles });
        wormContext = wormCanvas.element.getContext('2d');
        bonusCanvas = MAF.element.Core({ element: Canvas, styles: canvasStyles });
        bonusContext = bonusCanvas.element.getContext('2d');
        spriteCanvas = MAF.element.Core({ element: Canvas, styles: canvasStyles });
        spriteContext = spriteCanvas.element.getContext('2d');
    }

    function prepareGraphics() {
        var i, toLoad = [RED_WORM, GREEN_WORM, YELLOW_WORM, BLUE_WORM, SPEED_UP, SPEED_DOWN, TURN_IN, COIN, HEAL, DEATH_WORM];
        loadedImages = 0;
        imagesToLoad = toLoad.length;
        for (i = 0; i < imagesToLoad; i++) {
            loadImage(toLoad[i]);
        }
    }

    function loadImage(object) {
        var img = new Image(),
            sp = getSpritePosition(object);
        img.onload = function() {
            spriteContext.drawImage(img, sp.x, sp.y, sp.width, sp.height);
            loadedImages++;
            if (loadedImages === imagesToLoad) {
                onImagesLoaded();
            }
        };
        img.source = getImagePath(object);
    }

    function onImagesLoaded() {
        // TODO
    }

    function getObjectByPlayerColor(color) {
        switch(color) {
            case '#ed008c':
                return RED_WORM;
            case '#8cc63e':
                return GREEN_WORM;
            case '#fcb040':
                return YELLOW_WORM;
            case '#008ad2':
                return BLUE_WORM;
        }
    }

    function getSpritePosition(object) {
        switch(object) {
            case RED_WORM:
                return { x: 0, y: 0, width: 0, height: 0 };
            case GREEN_WORM:
                return { x: 0, y: 0, width: 0, height: 0 };
            case YELLOW_WORM:
                return { x: 0, y: 0, width: 0, height: 0 };
            case BLUE_WORM:
                return { x: 0, y: 0, width: 0, height: 0 };
            case SPEED_UP:
                return { x: 0, y: 0, width: 0, height: 0 };
            case SPEED_DOWN:
                return { x: 0, y: 0, width: 0, height: 0 };
            case TURN_IN:
                return { x: 0, y: 0, width: 0, height: 0 };
            case COIN:
                return { x: 0, y: 0, width: 0, height: 0 };
            case HEAL:
                return { x: 0, y: 0, width: 0, height: 0 };
            case DEATH_WORM:
                return { x: 0, y: 0, width: 0, height: 0 };
        }
    }

    function getImagePath(object) {
        switch(object) {
            case RED_WORM:
                return "Images/.png";
            case GREEN_WORM:
                return "Images/.png";
            case YELLOW_WORM:
                return "Images/.png";
            case BLUE_WORM:
                return "Images/.png";
            case SPEED_UP:
                return "Images/.png";
            case SPEED_DOWN:
                return "Images/.png";
            case TURN_IN:
                return "Images/.png";
            case COIN:
                return "Images/.png";
            case HEAL:
                return "Images/.png";
            case DEATH_WORM:
                return "Images/.png";
        }
    }

};