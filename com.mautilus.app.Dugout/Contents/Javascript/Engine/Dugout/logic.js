Dugout_Logic = function(app) {

    var bonusesState = 0,
        lastBonusesState = 0;

    this.renderBonuses = renderBonuses;

    function renderBonuses() {
        if (lastBonusesState === bonusesState) {
            return false;
        }
        else {
            lastBonusesState = bonusesState;
            return true;
        }
    }

};