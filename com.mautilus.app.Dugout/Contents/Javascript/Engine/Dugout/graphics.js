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
        RED_WORM_DEAD = 9,
        GREEN_WORM_DEAD = 10,
        YELLOW_WORM_DEAD = 11,
        BLUE_WORM_DEAD = 12,
        WORM_WIDTH = 27,
        WORM_HEIGHT = 68,
        BONUS_WIDTH = 74,
        BONUS_HEIGHT = 74,
        DEATH_WIDTH = 68,
        DEATH_HEIGHT = 94,
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
            wormImg = getSpritePosition(getObjectByPlayerColor(player));
            wormContext.translate(player.position.x, player.position.y);
            wormContext.rotate(player.direction);
            wormContext.drawImage(spriteCanvas.element, wormImg.x, wormImg.y, wormImg.width, wormImg.height, -WORM_WIDTH / 2, -WORM_HEIGHT / 2, WORM_WIDTH, WORM_HEIGHT);
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
            bonusContext.drawImage(spriteCanvas.element, bonusImg.x, bonusImg.y, bonusImg.width, bonusImg.height, bonus.position.x - BONUS_WIDTH / 2, bonus.position.y - BONUS_HEIGHT / 2, BONUS_WIDTH, BONUS_HEIGHT);
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
        var canvasStyles = { position: 'absolute', top: 0, left: 0, width: 1776, height: 1000 };
        pathCanvas = new MAF.element.Core({ element: Canvas, styles: canvasStyles });
        pathContext = pathCanvas.element.getContext('2d');
        slimeCanvas = new MAF.element.Core({ element: Canvas, styles: canvasStyles });
        slimeContext = slimeCanvas.element.getContext('2d');
        wormCanvas = new MAF.element.Core({ element: Canvas, styles: canvasStyles });
        wormContext = wormCanvas.element.getContext('2d');
        bonusCanvas = new MAF.element.Core({ element: Canvas, styles: canvasStyles });
        bonusContext = bonusCanvas.element.getContext('2d');
        spriteCanvas = new MAF.element.Core({ element: Canvas, styles: {} });
        spriteCanvas.width = 750;
        spriteCanvas.height = 94;
        spriteContext = spriteCanvas.element.getContext('2d');
        prepareGraphics();
    }

    function prepareGraphics() {
        var i, toLoad = [RED_WORM, GREEN_WORM, YELLOW_WORM, BLUE_WORM, SPEED_UP, SPEED_DOWN, TURN_IN, COIN, HEAL, RED_WORM_DEAD, GREEN_WORM_DEAD, YELLOW_WORM_DEAD, BLUE_WORM_DEAD];
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

    function getObjectByPlayerColor(player) {
        switch(player.color) {
            case '#ed008c':
                return (player.dead)? RED_WORM_DEAD : RED_WORM;
            case '#8cc63e':
                return (player.dead)? GREEN_WORM_DEAD : GREEN_WORM;
            case '#fcb040':
                return (player.dead)? YELLOW_WORM_DEAD : YELLOW_WORM;
            case '#008ad2':
                return (player.dead)? BLUE_WORM_DEAD : BLUE_WORM;
        }
    }

    function getSpritePosition(object) {
        switch(object) {
            case RED_WORM:
                return { x: 0, y: 0, width: WORM_WIDTH, height: WORM_HEIGHT };
            case GREEN_WORM:
                return { x: 27, y: 0, width: WORM_WIDTH, height: WORM_HEIGHT };
            case YELLOW_WORM:
                return { x: 54, y: 0, width: WORM_WIDTH, height: WORM_HEIGHT };
            case BLUE_WORM:
                return { x: 81, y: 0, width: WORM_WIDTH, height: WORM_HEIGHT };
            case SPEED_UP:
                return { x: 380, y: 0, width: BONUS_WIDTH, height: BONUS_HEIGHT };
            case SPEED_DOWN:
                return { x: 454, y: 0, width: BONUS_WIDTH, height: BONUS_HEIGHT };
            case TURN_IN:
                return { x: 528, y: 0, width: BONUS_WIDTH, height: BONUS_HEIGHT };
            case COIN:
                return { x: 602, y: 0, width: BONUS_WIDTH, height: BONUS_HEIGHT };
            case HEAL:
                return { x: 676, y: 0, width: BONUS_WIDTH, height: BONUS_HEIGHT };
            case RED_WORM_DEAD:
                return { x: 108, y: 0, width: DEATH_WIDTH, height: DEATH_HEIGHT };
            case GREEN_WORM_DEAD:
                return { x: 176, y: 0, width: DEATH_WIDTH, height: DEATH_HEIGHT };
            case YELLOW_WORM_DEAD:
                return { x: 244, y: 0, width: DEATH_WIDTH, height: DEATH_HEIGHT };
            case BLUE_WORM_DEAD:
                return { x: 312, y: 0, width: DEATH_WIDTH, height: DEATH_HEIGHT };
        }
    }

    function getImagePath(object) {
        switch(object) {
            case RED_WORM:
                return "Images/ingame/cervik_in_1.png";
            case GREEN_WORM:
                return "Images/ingame/cervik_in_2.png";
            case YELLOW_WORM:
                return "Images/ingame/cervik_in_3.png";
            case BLUE_WORM:
                return "Images/ingame/cervik_in_4.png";
            case SPEED_UP:
                return "Images/ingame/bonus_speedup.png";
            case SPEED_DOWN:
                return "Images/ingame/bonus_speeddown.png";
            case TURN_IN:
                return "Images/ingame/bonus_better.png";
            case COIN:
                return "Images/ingame/bonus_score.png";
            case HEAL:
                return "Images/ingame/bonus_lekarna.png";
            case RED_WORM_DEAD:
                return "Images/ingame/hrobecek_1.png";
            case GREEN_WORM_DEAD:
                return "Images/ingame/hrobecek_2.png";
            case YELLOW_WORM_DEAD:
                return "Images/ingame/hrobecek_3.png";
            case BLUE_WORM_DEAD:
                return "Images/ingame/hrobecek_4.png";
        }
    }

};