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

Window_MiscBattleMusic.prototype = Object.create(Window_Settings__Description.prototype);
Window_MiscBattleMusic.prototype.constructor = Window_MiscBattleMusic;

Window_MiscBattleMusic.prototype.initialize = function (x, y, width) {
    this.resetId();
    this._minValue = 1;
    this._maxValue = 11;
    Window_Settings__Description.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_MiscBattleMusic.prototype.makeCommandList = function () {
    this.addCommand('Standard Battle', 'standardBattle');
};

Window_MiscBattleMusic.prototype.makeDescriptions = function () {
    this._descriptions = [
        `Change the standard battle music.<BR>Does not change bosses or certain events.`,   // STANDARD BATTLE
    ];
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
    this.cursorChange(1);
};

Window_MiscBattleMusic.prototype.cursorLeft = function () {
    this.cursorChange(-1);
};

Window_MiscBattleMusic.prototype.cursorChange = function (change) {
    let value = this._id;

    value += change;
    if (value > this._maxValue) {
        value = this._minValue;
    } else if (value < this._minValue) {
        value = this._maxValue;
    }
    this.changeValue(value);
};

Window_MiscBattleMusic.prototype.changeValue = function (value) {
    $gameSystem.changeDefaultBattleBgm(value);
    this.resetId();
    this.redrawItem(0);
};
