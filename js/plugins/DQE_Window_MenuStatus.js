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
    this.drawHPBlock(this.extraPadding(), 66, 72);
    this.drawMPBlock(this.extraPadding(), 102, 72);
};

Window_MenuStatus.prototype.drawName = function (x, y) {
    this.drawActorName(this._actor, x, y);
};

Window_MenuStatus.prototype.drawHorzLine = function (x, y) {
    this.contents.fillRect(x, y, this.contentsWidth(), 3, this.normalColor());
    this.contents.paintOpacity = 255;
};

Window_MenuStatus.prototype.drawHPBlock = function (x, y, curHpWidth) {
    this.drawText(TextManager.hpA, x, y);
    this.drawActorHp(this._actor, this.contentsWidth() - curHpWidth - this.extraPadding(), y, curHpWidth, 'right');
};

Window_MenuStatus.prototype.drawMPBlock = function (x, y, curMpWidth) {
    this.drawText(TextManager.mpA, x, y);
    this.drawActorMp(this._actor, this.contentsWidth() - curMpWidth - this.extraPadding(), y, curMpWidth, 'right');
};