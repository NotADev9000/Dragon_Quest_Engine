//=============================================================================
// Dragon Quest Engine - Window Shop Actor Stats
// DQE_Window_ShopActorStats.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for the shop's actor stat list - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_ShopActorStats = DQEng.Window_ShopActorStats || {};

//-----------------------------------------------------------------------------
// Window_ShopActorStats
//-----------------------------------------------------------------------------

function Window_ShopActorStats() {
    this.initialize.apply(this, arguments);
}

Window_ShopActorStats.prototype = Object.create(Window_Base.prototype);
Window_ShopActorStats.prototype.constructor = Window_ShopActorStats;

Window_ShopActorStats.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._index = 0;
    this._stats = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ShopActorStats.prototype.standardPadding = function () {
    return 9;
};

Window_ShopActorStats.prototype.extraPadding = function () {
    return 15;
};

Window_ShopActorStats.prototype.titleBlockHeight = function () {
    return 54;
};

Window_ShopActorStats.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

//////////////////////////////
// Functions - data
//////////////////////////////

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ShopActorStats.prototype.refresh = function () {
    if (this._stats) {
        this.contents.clear();
        this.drawStats();
    }
};
