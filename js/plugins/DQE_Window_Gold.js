//=============================================================================
// Dragon Quest Engine - Window Gold
// DQE_Window_Gold.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc similar to default window but with different size/padding - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_Gold = DQEng.Window_Gold || {};

//-----------------------------------------------------------------------------
// Window_Gold
//-----------------------------------------------------------------------------

DQEng.Window_Gold.initialize = Window_Gold.prototype.initialize;
Window_Gold.prototype.initialize = function (x, y) {
    this._hasMedal = !!$gameParty.medalTotal();     // has player collected any medals
    DQEng.Window_Gold.initialize.call(this, x, y);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Gold.prototype.windowWidth = function () {
    return 306;
};

Window_Gold.prototype.windowHeight = function () {
    return this._hasMedal ? 105 : 69;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Gold.prototype.value = function (currency = 0) {
    switch (currency) {
        case 1:
            return $gameParty.medalCurrent();
        default:
            return $gameParty.gold();
    }
};

Window_Gold.prototype.currencyUnit = function (currency = 0) {
    switch (currency) {
        case 1:
            return TextManager.medalUnit;
        default:
            return TextManager.currencyUnit;
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Gold.prototype.refresh = function () {
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), 0, 0, this.contents.width);
    if (this._hasMedal) {
        this.drawCurrencyValue(this.value(1), this.currencyUnit(1), 0, this.itemHeight(), this.contents.width);
    }
};