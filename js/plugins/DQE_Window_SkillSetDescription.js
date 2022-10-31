//=============================================================================
// Dragon Quest Engine - Window Skill Set Description
// DQE_Window_SkillSetDescription.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Window displaying a description of the skills in a skillset;
*             this includes skills, stat boosts & effect boosts - V0.1
*
*
* @help
* MUST BE PLACED BELOW WINDOW_BATTLEHELP IN PLUGIN MANAGER
* 
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_SkillSetDescription = true;

var DQEng = DQEng || {};
DQEng.Window_SkillSetDescription = DQEng.Window_SkillSetDescription || {};

//-----------------------------------------------------------------------------
// Window_SkillSetDescription
//-----------------------------------------------------------------------------

function Window_SkillSetDescription() {
    this.initialize.apply(this, arguments);
}

Window_SkillSetDescription.prototype = Object.create(Window_BattleHelp.prototype); // inherits from battle help for visuals but window not used in battle
Window_SkillSetDescription.prototype.constructor = Window_SkillSetDescription;

Window_SkillSetDescription.prototype.initialize = function (x, y, width, numLines = 3) {
    Window_BattleHelp.prototype.initialize.call(this, x, y, width, numLines);
    this._description = '';
    this._mpCost = '';
    this._requirement = '';
    this._isSkill = false;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SkillSetDescription.prototype.extraBlockHeight = function () {
    return 54;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_SkillSetDescription.prototype.setItem = function (isSkill, mpCost, description, requirement = 'No requirements') {
    this._isSkill = isSkill;
    this._description = description;
    this._mpCost = mpCost;
    this._requirement = requirement;
    this.refresh();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

/**
 * Draws the MP cost and requirements section
 */
Window_SkillSetDescription.prototype.drawTitleBlock = function () {
    const ep = this.extraPadding();
    let y = ep;

    if (this._isSkill) {
        this.drawText(`MP Cost: ${this._mpCost}`, ep, y);
        this.drawText(this._requirement, 0, y, this.contentsWidth() - ep, 'right');
    } else {
        this.drawText(this._requirement, ep, y);
    }

    y += this.lineHeight() + ep;
    this.drawHorzLine(0, y);
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SkillSetDescription.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitleBlock();
    const ep = this.extraPadding();
    const y = this.extraBlockHeight() + ep;
    this.drawTextEx(this._description, ep, y);
};