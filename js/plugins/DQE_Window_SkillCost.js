//=============================================================================
// Dragon Quest Engine - Window Skill Cost
// DQE_Window_SkillCost.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying a skills MP cost in the magic menu - V0.1
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
Imported.DQEng_Window_SkillCost = true;

var DQEng = DQEng || {};
DQEng.Window_SkillCost = DQEng.Window_SkillCost || {};

//-----------------------------------------------------------------------------
// Window_SkillCost
//-----------------------------------------------------------------------------

function Window_SkillCost() {
    this.initialize.apply(this, arguments);
}

Window_SkillCost.prototype = Object.create(Window_Base.prototype);
Window_SkillCost.prototype.constructor = Window_SkillCost;

Window_SkillCost.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._mpCost = '';
    this._mpTotal = '';
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SkillCost.prototype.windowWidth = function () {
    return 444;
};

Window_SkillCost.prototype.windowHeight = function () {
    return 123;
};

Window_SkillCost.prototype.standardPadding = function () {
    return 9;
};

Window_SkillCost.prototype.extraPadding = function () {
    return 15;
};

Window_SkillCost.prototype.textWidth = function () {
    return this.windowWidth() - (this.standardPadding() + this.extraPadding()) * 2;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_SkillCost.prototype.setText = function (cost, total) {
    if (this._mpCost !== cost || this._mpTotal != total) {
        this._mpCost = cost;
        this._mpTotal = total;
        this.refresh();
    }
};

Window_SkillCost.prototype.setItem = function (skill, actorMP) {
    let cost = skill ? skill.mpCost.toString() : '';
    let total = actorMP ? actorMP.toString() : '';

    this.setText(cost, total);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SkillCost.prototype.drawTitle = function () {
    var pos = this.extraPadding();
    this.drawText('MP Cost', pos, pos, this.textWidth(), 'center');
};

Window_SkillCost.prototype.drawCost = function () {
    let text = `${this._mpCost}/${this._mpTotal}`;
    let y = 69;
    this.drawText(text, this.extraPadding(), y, this.textWidth(), 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SkillCost.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitle();
    this.drawHorzLine(0, 51);
    this.drawCost();
};
