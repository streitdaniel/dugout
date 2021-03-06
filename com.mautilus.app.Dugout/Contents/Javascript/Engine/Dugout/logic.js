Dugout_Logic = function(app) {

    var SPEED_UP_BONUS = 0,
        SPEED_DOWN_BONUS = 1,
        TURNIN_BONUS = 2,
        COIN_BONUS = 3,
        HEAL_BONUS = 4,
        BONUS_TIMEOUT = 7500,
        bonusesState = 0,
        lastBonusesState = 0,
        bonuses = [],
        bonusTimeout;

    this.renderBonuses = renderBonuses;
    this.detectDeaths = detectDeaths;
    this.detectBonuses = detectBonuses;
    this.startAddingBonuses = startAddingBonuses;
    this.stopAddingBonuses = stopAddingBonuses;
    this.getBonuses = getBonuses;

    function renderBonuses() {
        if (lastBonusesState === bonusesState) {
            return false;
        }
        else {
            lastBonusesState = bonusesState;
            return true;
        }
    }
    
    function detectDeaths(players) {
        var predictedX, predictedY, player, key;
        for (key in players) {
            player = players[key];
            if (player.dead) { continue; }
            predictedX = player.position.x + Math.sin(player.direction) * player.speed;
            predictedY = player.position.y - Math.cos(player.direction) * player.speed;
            if (predictedX < 1) predictedX = 1;
            if (predictedX > 1779) predictedX = 1779;
            if (predictedY < 1) predictedY = 1;
            if (predictedY > 889) predictedY = 899;
            if (app.isSlimeAt(predictedX, predictedY)) {
                if (player.heals > 0) {
                    app.adjustPlayersAbility(key, "heals", -1);
                }
                else {
                    app.killPlayer(key);
                }
            }
        }
    }
    
    function detectBonuses(players) {
        var x, y, player, key, distance, distanceX, distanceY, i, bonus, bonusesLength = bonuses.length;
        for (key in players) {
            player = players[key];
            x = player.position.x;
            y = player.position.y;
            for (i = 0; i < bonusesLength; i++) {
                bonus = bonuses[i];
                distanceX = x - bonus.position.x;
                distanceY = y - bonus.position.y;
                distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if (distance < 37) {
                    collectBonus(key, i);
                }
            }
        }
    }

    function collectBonus(playerKey, bonusIndex) {
        var bonus = bonuses[bonusIndex];
        bonuses.splice(bonusIndex, 1);
        bonusesState++;
        switch (bonus.type) {
            case SPEED_UP_BONUS:
                app.adjustPlayersAbility(playerKey, "speed", 1);
                setTimeout(function() {
                    app.adjustPlayersAbility(playerKey, "speed", -1);
                }, BONUS_TIMEOUT);
                break;
            case SPEED_DOWN_BONUS:
                app.adjustPlayersAbility(playerKey, "speed", -1, true);
                setTimeout(function() {
                    app.adjustPlayersAbility(playerKey, "speed", 1, true);
                }, BONUS_TIMEOUT);
                break;
            case TURNIN_BONUS:
                app.adjustPlayersAbility(playerKey, "turning_speed", 2);
                setTimeout(function() {
                    app.adjustPlayersAbility(playerKey, "turning_speed", -2);
                }, BONUS_TIMEOUT);
                break;
            case COIN_BONUS:
                app.adjustPlayersAbility(playerKey, "score", 300);
                break;
            case HEAL_BONUS:
                app.adjustPlayersAbility(playerKey, "heals", 1);
                break;
        }
    }

    function addBonus() {
        var timeout = Math.random() * 5 + 10;
        bonusTimeout = setTimeout(function() {
            bonuses.push({
                position: {
                    x: Math.random() * 1576 + 100,
                    y: Math.random() * 700 + 100
                },
                type: Math.floor(Math.random() * 5)
            });
            bonusesState++;
            addBonus();
        }, timeout * 1000);
    }

    function startAddingBonuses() {
        addBonus();
    }

    function stopAddingBonuses() {
        clearTimeout(bonusTimeout);
    }

    function getBonuses() {
        return bonuses;
    }

};