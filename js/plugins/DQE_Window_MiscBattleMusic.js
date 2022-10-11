//=============================================================================
// Dragon Quest Engine - Window Misc - Battle Music
// DQE_Window_MiscBattleMusic.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing the battle music - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_MiscBattleMusic = DQEng.Window_MiscBattleMusic || {};

//-----------------------------------------------------------------------------
// Window_MiscBattleMusic
//-----------------------------------------------------------------------------

function Window_MiscBattleMusic() {
    this.initialize.apply(this, arguments);
}

Window_MiscBattleMusic.prototype = Object.create(Window_Settings_Window.prototype);
Window_MiscBattleMusic.prototype.constructor = Window_MiscBattleMusic;

Window_MiscBattleMusic.prototype.initialize = function (x, y, width) {
    this.resetId();
    Window_Settings_Window.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_MiscBattleMusic.prototype.makeCommandList = function () {
    this.addCommand('Standard Battle', 'standardBattle');
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_MiscBattleMusic.prototype.resetId = function () {
    this._id = $gameSystem.battleBgmId();
};

Window_MiscBattleMusic.prototype.statusText = function () {
    let value = 'DQ' + this._id;
    return `< ${value} >`;
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_MiscBattleMusic.prototype.cursorRight = function () {
    let value = this._id;
    value >= 11 ? value = 1 : value++;
    this.changeValue(value);
};

Window_MiscBattleMusic.prototype.cursorLeft = function () {
    let value = this._id;
    value <= 1 ? value = 11 : value--;
    this.changeValue(value);
};

Window_MiscBattleMusic.prototype.changeValue = function (value) {
    $gameSystem.changeDefaultBattleBgm(value);
    this.resetId();
    this.redrawItem(0);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_MiscBattleMusic.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let textWidth = this.contentsWidth() - this.textPadding() - (this.extraPadding() * 2);
    this.drawText(this.commandName(index), rect.x, rect.y);
    this.drawText(this.statusText(index), rect.x, rect.y, textWidth, 'right');
};

Window_MiscBattleMusic.prototype.drawDescription = function () {
    // horizontal rule
    let ep = this.extraPadding();
    let y = this.contentsHeight() - this.titleBlockHeight();
    this.drawHorzLine(0, y);
    y += 3 + ep;
    // description text
    let text = 'Change the standard battle music.<BR>Does not change bosses or certain events.';
    this.drawTextEx(text, ep, y);
};
