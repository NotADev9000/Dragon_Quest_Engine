//=============================================================================
// Dragon Quest Engine - Window Skill Points
// DQE_Window_SkillPoints.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying how many skill points an actor has - V0.1
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
Imported.DQEng_Window_SkillPoints = true;

var DQEng = DQEng || {};
DQEng.Window_SkillPoints = DQEng.Window_SkillPoints || {};

//-----------------------------------------------------------------------------
// Window_SkillPoints
//-----------------------------------------------------------------------------

function Window_SkillPoints() {
    this.initialize.apply(this, arguments);
}

Window_SkillPoints.prototype = Object.create(Window_Base.prototype);
Window_SkillPoints.prototype.constructor = Window_SkillPoints;

Window_SkillPoints.prototype.initialize = function (x, y, width) {
    Window_Base.prototype.initialize.call(this, x, y, width, this.windowHeight());
    this._category = -1;
    this._actor = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SkillPoints.prototype.windowHeight = function () {
    return 123;
};

Window_SkillPoints.prototype.standardPadding = function () {
    return 9;
};

Window_SkillPoints.prototype.extraPadding = function () {
    return 15;
};

Window_SkillPoints.prototype.textWidth = function () {
    return this.width - (this.standardPadding() + this.extraPadding()) * 2;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_SkillPoints.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SkillPoints.prototype.drawTitle = function () {
    const ep = this.extraPadding();
    this.drawText('Skill Points', ep, ep, this.textWidth(), 'center');
};

Window_SkillPoints.prototype.drawPoints = function () {
    const points = this._actor.skillPoints();
    this.drawText(points, this.extraPadding(), 69, this.textWidth(), 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SkillPoints.prototype.refresh = function () {
    this.createContents();
    this.drawTitle();
    this.drawHorzLine(0, 51);
    if (this._actor) this.drawPoints();
};
