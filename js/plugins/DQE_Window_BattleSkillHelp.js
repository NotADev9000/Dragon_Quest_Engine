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

Window_BattleSkillHelp.prototype = Object.create(Window_BattleHelp.prototype);
Window_BattleSkillHelp.prototype.constructor = Window_BattleSkillHelp;

Window_BattleSkillHelp.prototype.initialize = function (x, y, width, numLines = 4) {
    Window_BattleHelp.prototype.initialize.call(this, x, y, width, numLines);
    this._mpCost = '';
    this._mpTotal = '';
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_BattleSkillHelp.prototype.extraBlockHeight = function () {
    return 48;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_BattleSkillHelp.prototype.setText = function (desc, cost, total) {
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

//////////////////////////////
// Functions - draw items
//////////////////////////////

/**
 * Draws the bottom section of the window to display MP cost
 */
Window_BattleSkillHelp.prototype.drawExtraBlock = function () {
    var blockY = this.height - this.extraBlockHeight() - (this.padding + this.extraPadding()) + 6;
    var mpCost = this._mpCost.padStart(3, ' ');
    var text = `${mpCost}/${this._mpTotal}`;
    var textWidth = this.width - (this.standardPadding() + this.extraPadding()) * 2;

    this.drawHorzLine(0, blockY);
    blockY += 15;
    this.drawText(text, this.extraPadding(), blockY, textWidth, 'center');
};
