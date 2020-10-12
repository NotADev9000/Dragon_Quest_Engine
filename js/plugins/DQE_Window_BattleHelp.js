//=============================================================================
// Dragon Quest Engine - Window Battle Help
// DQE_Window_BattleHelp.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The parent window for help windows in battle - V0.1
*
*
* @help
* Parent window inherited by skill/item help windows
* 
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_BattleHelp = true;

var DQEng = DQEng || {};
DQEng.Window_BattleHelp = DQEng.Window_BattleHelp || {};

//-----------------------------------------------------------------------------
// Window_BattleHelp
//-----------------------------------------------------------------------------

function Window_BattleHelp() {
    this.initialize.apply(this, arguments);
}

Window_BattleHelp.prototype = Object.create(Window_Help.prototype);
Window_BattleHelp.prototype.constructor = Window_BattleHelp;

Window_BattleHelp.prototype.fittingHeight = function (numLines) {
    return Window_Base.prototype.fittingHeightTitleBlock.call(this, numLines);
};

Window_BattleHelp.prototype.titleBlockHeight = function () {
    return 48;
};

Window_BattleHelp.prototype.standardPadding = function () {
    return 9;
};

Window_BattleHelp.prototype.extraPadding = function () {
    return 15;
};

Window_BattleHelp.prototype.drawTitleBlock = function () {
};

Window_BattleHelp.prototype.refresh = function () {
    this.contents.clear();
    var pos = this.extraPadding();
    this.drawTextEx(this._text, pos, pos);
    this.drawTitleBlock();
};
