//=============================================================================
// Dragon Quest Engine - Window Battle Skill Help
// DQE_Window_BattleSkillHelp.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying the skill description/cost - V0.1
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
Imported.DQEng_Window_BattleSkillHelp = true;

var DQEng = DQEng || {};
DQEng.Window_BattleSkillHelp = DQEng.Window_BattleSkillHelp || {};

//-----------------------------------------------------------------------------
// Window_BattleSkillHelp
//-----------------------------------------------------------------------------

function Window_BattleSkillHelp() {
    this.initialize.apply(this, arguments);
}

Window_BattleSkillHelp.prototype = Object.create(Window_Help.prototype);
Window_BattleSkillHelp.prototype.constructor = Window_BattleSkillHelp;

Window_BattleSkillHelp.prototype.initialize = function (x, y, width, numLines = 3) {
    Window_Help.prototype.initialize.call(this, x, y, width, numLines);
    this._mpCost = '';
    this._mpTotal = '';
};

Window_BattleSkillHelp.prototype.fittingHeight = function (numLines) {
    return Window_Base.prototype.fittingHeightTitleBlock.call(this, numLines);
};

Window_BattleSkillHelp.prototype.titleBlockHeight = function () {
    return 48;
};

Window_BattleSkillHelp.prototype.standardPadding = function () {
    return 9;
};

Window_BattleSkillHelp.prototype.extraPadding = function () {
    return 15;
};

Window_Help.prototype.setText = function (desc, cost, total) {
    if (this._text !== desc || this._mpCost !== cost || this._mpTotal != total) {
        this._text = desc;
        this._mpCost = cost;
        this._mpTotal = total;
        this.refresh();
    }
};

Window_BattleSkillHelp.prototype.setItem = function (skill, actor) {
    var desc = skill ? skill.description : '';
    var cost = skill ? skill.mpCost.toString() : '';
    var total = actor ? actor.mp.toString() : '';

    this.setText(desc, cost, total);
};

/**
 * Draws the bottom section of the window to display MP cost
 */
Window_BattleSkillHelp.prototype.drawTitleBlock = function () {
    var blockY = this.height - this.titleBlockHeight() - (this.padding + this.extraPadding()) + 6;
    var mpCost = this._mpCost.padStart(3, ' ');
    var text = `${mpCost}/${this._mpTotal}`;
    var textWidth = this.width - (this.standardPadding() + this.extraPadding()) * 2;

    this.drawHorzLine(0, blockY);
    blockY += 15;
    this.drawText(text, this.extraPadding(), blockY, textWidth, 'center');
};

Window_BattleSkillHelp.prototype.refresh = function () {
    this.contents.clear();
    var pos = this.extraPadding();
    this.drawTextEx(this._text, pos, pos);
    this.drawTitleBlock();
};
