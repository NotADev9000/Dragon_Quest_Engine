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

Window_BattleHelp.prototype.initialize = function (x, y, width, numLines, titleBlock = true) {
    this._titleBlock = titleBlock;
    Window_Help.prototype.initialize.call(this, x, y, width, numLines);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_BattleHelp.prototype.fittingHeight = function (numLines) {
    return Window_Base.prototype.fittingHeightTitleBlock.call(this, numLines);
};

Window_BattleHelp.prototype.titleBlockHeight = function () {
    return this._titleBlock ? 48 : 0;
};

Window_BattleHelp.prototype.standardPadding = function () {
    return 9;
};

Window_BattleHelp.prototype.extraPadding = function () {
    return 15;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_BattleHelp.prototype.drawTitleBlock = function () {
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_BattleHelp.prototype.refresh = function () {
    this.contents.clear();
    const pos = this.extraPadding();
    this.drawTextEx(this._text, pos, pos);
    this.drawTitleBlock();
};
