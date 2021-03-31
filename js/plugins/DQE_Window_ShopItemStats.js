//=============================================================================
// Dragon Quest Engine - Window Shop Item Stats
// DQE_Window_ShopItemStats.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for the shop's item stat list - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_ShopItemStats = DQEng.Window_ShopItemStats || {};

//-----------------------------------------------------------------------------
// Window_ShopItemStats
//-----------------------------------------------------------------------------

function Window_ShopItemStats() {
    this.initialize.apply(this, arguments);
}

Window_ShopItemStats.prototype = Object.create(Window_Base.prototype);
Window_ShopItemStats.prototype.constructor = Window_ShopItemStats;

Window_ShopItemStats.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._stats = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ShopItemStats.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

Window_ShopItemStats.prototype.numberOfItems = function () {
    return 8;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ShopItemStats.prototype.setItem = function (item) {
    // this._item = JsonEx.makeDeepCopy(item);
    this._stats = this.makeItemStats(item);
    this.refresh();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ShopItemStats.prototype.drawStats = function () {
    const stats = this._stats;
    const noItems = Math.min(this.numberOfItems(), stats.length);
    let y = 0;
    let name, value, percent, sign, text;
    for (let i = 0; i < noItems; i++) {
        percent = '%';
        switch (stats[i].code) {
            case Game_BattlerBase.TRAIT_PARAM:
                name = TextManager.param(stats[i].dataId);
                value = stats[i].value;
                percent = '';
                break;
            case Game_BattlerBase.TRAIT_XPARAM:
                name = TextManager.xparam(stats[i].dataId);
                value = stats[i].value * 100;
                break;
            case Game_BattlerBase.TRAIT_SPARAM:
                name = TextManager.sparamAbbr(stats[i].dataId);
                value = ((1 - stats[i].value) * 100).toFixed(0);
                break;
            case Game_BattlerBase.TRAIT_STATE_RATE:
                name = $dataStates[stats[i].dataId].meta.resistName;
                value = ((1 - stats[i].value) * 100).toFixed(0);
                break;
        }
        sign = value < 0 ? '' : '+';
        // stat name
        this.changeTextColor(this.itemColor());
        this.drawText(name, 0, y);
        this.resetTextColor();
        // stat value
        text = `${sign}${value}${percent}`;
        this.drawText(text, 0, y, this.contentsWidth(), 'right');
        y += this.itemHeight();
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ShopItemStats.prototype.refresh = function () {
    if (this._stats) {
        this.contents.clear();
        this.drawStats();
    }
};
