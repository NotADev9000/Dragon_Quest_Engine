//=============================================================================
// Dragon Quest Engine - Window Status
// DQE_Window_Status.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The simple status window - V0.1
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
Imported.DQEng_Window_Status = true;

var DQEng = DQEng || {};
DQEng.Window_Status = DQEng.Window_Status || {};

//-----------------------------------------------------------------------------
// Window_Status
//-----------------------------------------------------------------------------

Window_Status.prototype = Object.create(Window_Base.prototype);

Window_Status.prototype.initialize = function (x, y, width) {
    let height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Status.prototype.standardPadding = function () {
    return 9;
};

Window_Status.prototype.extraPadding = function () {
    return 15;
};

Window_Status.prototype.windowHeight = function () {
    return 249;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Status.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Status.prototype.drawName = function () {
    let actorName = this._actor.name();
    let actorLv = this._actor.level;
    let text = `${actorName} Lv.${actorLv}`;

    this.drawText(text, 0, this.extraPadding(), this.contentsWidth(), 'center');
};

Window_Status.prototype.drawTitle = function () {
    let actorTitle = this._actor.nickname();
    let titleWidth = this.contents.measureTextWidth(actorTitle);
    let lineLength = (this.contentsWidth() - titleWidth)/2;
    let y = 51;
    this.drawHorzLine(0, y + 9, lineLength - 3);
    this.drawText(actorTitle, 0, y, this.contentsWidth(), 'center');
    this.drawHorzLine(titleWidth + lineLength, y + 9, lineLength);
};

Window_Status.prototype.drawExperience = function () {
    let actorExp = this._actor.currentExp();
    let nextLvExp = this._actor.nextRequiredExp();
    let y = 87;
    let textWidth = this.contentsWidth() - this.extraPadding();
    this.drawText('Experience:', this.extraPadding(), y, 0);
    y += 36;
    this.drawText(actorExp, 0, y, textWidth, 'right');
    y += 36;
    this.drawText('Exp. to Next Level:', this.extraPadding(), y, 0);
    y += 36;
    this.drawText(nextLvExp, 0, y, textWidth, 'right');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Status.prototype.refresh = function () {
    if (this._actor) {
        this.contents.clear();
        this.drawName();
        this.drawTitle();
        this.drawExperience();
    }
};
