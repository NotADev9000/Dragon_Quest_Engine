//=============================================================================
// Dragon Quest Engine - Menu Status
// DQE_Window_MenuStatus.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The status window for each actor - V0.1
*
*
* @help
* This window is displayed when the menu is opened. 
* One window is displayed for each actor.
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

Window_MenuStatus.prototype.initialize = function(x, y, actor, titleAlign = 'center', maxStat = false) {
    const width = this.windowWidth();
    const height = this.windowHeight();
    this._actor = actor;
    this._actorIndex = -1;
    this._titleAlign = titleAlign;
    this._maxStat = maxStat; // should the maximum of the stat be displayed
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

Window_MenuStatus.prototype.windowWidth = function () {
    return 288;
};

Window_MenuStatus.prototype.windowHeight = function () {
    return 192;
};

Window_MenuStatus.prototype.setCategory = function (category, force = false) {
    if ((this._actorIndex !== category) || force) {
        this._actorIndex = category;
        this._actor = $gameParty.allMembers()[this._actorIndex];
        this.refresh();
    }
};

/**
 * Draws actor name limited to 10 characters
 */
Window_MenuStatus.prototype.drawActorName = function (actor, x, y, width) {
    width = width || this.windowWidth() - (this.standardPadding() * 2) - (this.extraPadding() * 2);
    this.changeTextColor(this.hpColor(this._actor));
    this.drawText(actor.name().slice(0, 10), x, y, width, this._titleAlign);
};

/**
 * Draws the stat inside the status window
 * e.g. HP:   120
 * 
 * @param {String} statProperty the name of the stat e.g. HP
 * @param {Number} statValue the value of the stat e.g. 120
 * @param {Number} statMaxValue the maximum value of the stat
 * @param {Number} x x position of stat block
 * @param {Number} y y position of stat block
 * @param {Number} statWidth width of stat text (just the value)
 */
Window_MenuStatus.prototype.drawStatBlock = function (statProperty, statValue, statMaxValue, x, y) {
    if (this._maxStat && statMaxValue) statValue += `/${statMaxValue}`;
    this.changeTextColor(this.hpColor(this._actor));
    this.drawText(statProperty, x, y);
    this.drawActorStat(statValue, x, y, this.contentsWidth() - (this.extraPadding() * 2), 'right');
};

Window_MenuStatus.prototype.drawStateBlock = function (state, x, y) {
    this.changeTextColor(this.textColor(state.meta.color));
    this.drawText(state.name.toUpperCase(), x, y);
};

Window_MenuStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        const state = this._actor.mostImportantStateDisplay();
        const ep = this.extraPadding();
        this.drawActorName(this._actor, this.extraPadding(), this.extraPadding());
        this.drawHorzLine(0, 51);
        this.drawStatBlock(TextManager.hpA, this._actor.hp, this._actor.mhp, ep, 66);
        this.drawStatBlock(TextManager.mpA, this._actor.mp, this._actor.mmp, ep, 102);
        if (state) {
            this.drawStateBlock(state, ep, 138);
        } else {
            this.drawStatBlock(TextManager.levelA, this._actor.level, undefined, ep, 138);
        }
    }
};
