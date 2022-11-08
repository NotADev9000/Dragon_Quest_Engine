//=============================================================================
// Dragon Quest Engine - Window Everyone Info
// DQE_Window_EveryoneInfo.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying general gameplay info - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_EveryoneInfo = DQEng.Window_EveryoneInfo || {};

//-----------------------------------------------------------------------------
// Window_EveryoneInfo
//-----------------------------------------------------------------------------

function Window_EveryoneInfo() {
    this.initialize.apply(this, arguments);
}

Window_EveryoneInfo.prototype = Object.create(Window_Base.prototype);
Window_EveryoneInfo.prototype.constructor = Window_EveryoneInfo;

Window_EveryoneInfo.prototype.initialize = function (x, y, width) {
    const height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_EveryoneInfo.prototype.standardPadding = function () {
    return 9;
};

Window_EveryoneInfo.prototype.extraPadding = function () {
    return 15;
};

Window_EveryoneInfo.prototype.windowHeight = function () {
    return 303;
};

Window_EveryoneInfo.prototype.itemWidth = function () {
    return this.contentsWidth() - this.extraPadding();
};

Window_EveryoneInfo.prototype.ruleHeight = function () {
    return this.lineGap() + 3;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_EveryoneInfo.prototype.drawAll = function () {
    const iw = this.itemWidth();
    const ih = this.itemHeight();
    const rh = this.ruleHeight();
    const ep = this.extraPadding();
    let y = ep;
    // playtime
    let value = $gameSystem.playtimeText();
    this.drawText('Total Play Time:', ep, y);
    this.drawText(value, 0, y, iw, 'right');
    y += ih;
    // horizontal rule
    this.drawHorzLine(0, y);
    y += rh;
    // gold
    value = $gameParty.gold();
    this.drawText('Gold Coins Carried:', ep, y);
    this.drawText(value, 0, y, iw, 'right');
    y += ih;
    value = $gameParty.bankGold();
    this.drawText('Gold Coins in Bank:', ep, y);
    this.drawText(value, 0, y, iw, 'right');
    y += ih;
    // horizontal rule
    this.drawHorzLine(0, y);
    y += rh;
    // mini medals
    value = $gameParty.medalCurrent();
    this.drawText('Mini Medals Carried:', ep, y);
    this.drawText(value, 0, y, iw, 'right');
    y += ih;
    value = $gameParty.medalTotal();
    this.drawText('Total Mini Medals Collected:', ep, y);
    this.drawText(value, 0, y, iw, 'right');
    y += ih;
    // horizontal rule
    this.drawHorzLine(0, y);
    y += rh;
    // restore point
    value = $gameParty.restorePoint().mapName;
    this.drawText('Respawn Point:', ep, y);
    this.drawText(value, 0, y, iw, 'right');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_EveryoneInfo.prototype.refresh = function () {
    this.contents.clear();
    this.drawAll();
};