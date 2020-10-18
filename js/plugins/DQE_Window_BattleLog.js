//=============================================================================
// Dragon Quest Engine - Window Battle Log
// DQE_Window_BattleLog.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying battle progress - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_BattleLog = true;

var DQEng = DQEng || {};
DQEng.Window_BattleLog = DQEng.Window_BattleLog || {};

//-----------------------------------------------------------------------------
// Window_BattleLog
//-----------------------------------------------------------------------------

Window_BattleLog.prototype.initialize = function () {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this._lines = [];
    this._methods = [];
    this._waitCount = 0;
    this._waitMode = '';
    this._baseLineStack = [];
    this._spriteset = null;
    this.updatePlacement();
    this.refresh();
};

Window_BattleLog.prototype.lineHeight = function () {
    return Window_BattleMessage.prototype.lineHeight.call(this);;
};

Window_BattleLog.prototype.lineGap = function () {
    return Window_BattleMessage.prototype.lineGap.call(this);;
};

Window_BattleLog.prototype.windowWidth = function () {
    return Window_BattleMessage.prototype.windowWidth.call(this);
};

Window_BattleLog.prototype.standardPadding = function () {
    return Window_BattleMessage.prototype.standardPadding.call(this);
};

Window_BattleLog.prototype.maxLines = function () {
    return Window_BattleMessage.prototype.numVisibleRows.call(this);
};

Window_BattleLog.prototype.updatePlacement = function () {
    this.x = $gameSystem.makeDivisibleBy((Graphics.boxWidth - this.windowWidth()) / 2);
    return Window_BattleMessage.prototype.updatePlacement.call(this);
};

Window_BattleLog.prototype.drawLineText = function (index) {
    var rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};

Window_BattleLog.prototype.refresh = function () {
    this.contents.clear();
    for (var i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};
