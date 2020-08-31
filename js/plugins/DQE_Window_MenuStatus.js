//=============================================================================
// Dragon Quest Engine - Menu Status
// DQE_Window_MenuStatus.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The main menu command list - V0.1
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
Imported.DQEng_Window_MenuStatus = true;

var DQEng = DQEng || {};
DQEng.Window_MenuStatus = DQEng.Window_MenuStatus || {};

//-----------------------------------------------------------------------------
// Window_MenuStatus
//-----------------------------------------------------------------------------

function Window_MenuStatus() {
    this.initialize.apply(this, arguments);
}

Window_MenuStatus.prototype = Object.create(Window_Base.prototype);
Window_MenuStatus.prototype.constructor = Window_MenuStatus;

Window_MenuStatus.prototype.initialize = function(x, y, actor) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    this._actor = actor;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

/**
 * Padding is 9 so horizontal rule covers the window
 */
Window_MenuStatus.prototype.standardPadding = function () {
    return 9;
};

/**
 * Extra padding added to correctly position text.
 * The horizontal line ignores this padding
 */
Window_MenuStatus.prototype.extraPadding = function () {
    return 15;
};

Window_MenuStatus.prototype.lineHeight = function () {
    return 21;
};

Window_MenuStatus.prototype.windowWidth = function () {
    return 288;
};

Window_MenuStatus.prototype.windowHeight = function () {
    return 192;
};

Window_MenuStatus.prototype.refresh = function () {
    this.contents.clear();
    this.drawName(this.extraPadding(), this.extraPadding());
    this.drawHorzLine(0, 51);
    this.drawStatBlock(TextManager.hpA, this._actor.hp, this.extraPadding(), 66, 72);
    this.drawStatBlock(TextManager.mpA, this._actor.mp,this.extraPadding(), 102, 72);
    this.drawStatBlock(TextManager.levelA, this._actor.level,this.extraPadding(), 138, 72);
};

Window_MenuStatus.prototype.drawName = function (x, y) {
    this.drawActorName(this._actor, x, y);
};

/**
 * Draws a horizontal line across the window
 */
Window_MenuStatus.prototype.drawHorzLine = function (x, y) {
    this.contents.fillRect(x, y, this.contentsWidth(), 3, this.normalColor());
};

/**
 * Draws the stat inside the status window
 * e.g. HP:   120
 * 
 * @param {String} statProperty the name of the stat e.g. HP
 * @param {Number} statValue the value of the stat e.g. 120
 * @param {Number} x x position of stat block
 * @param {Number} y y position of stat block
 * @param {Number} statWidth width of stat text (just the value)
 */
Window_MenuStatus.prototype.drawStatBlock = function (statProperty, statValue, x, y, statWidth) {
    this.drawText(statProperty, x, y);
    this.drawActorStat(statValue, this.contentsWidth() - statWidth - this.extraPadding(), y, statWidth, 'right');
};
