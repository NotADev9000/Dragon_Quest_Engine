//=============================================================================
// Dragon Quest Engine - Window Misc - Battle Music
// DQE_Window_Misc_Music.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing the music in game - V0.1
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
DQEng.Window_Misc_Music = DQEng.Window_Misc_Music || {};

//-----------------------------------------------------------------------------
// Window_Misc_Music
//-----------------------------------------------------------------------------

function Window_Misc_Music() {
    this.initialize.apply(this, arguments);
}

Window_Misc_Music.prototype = Object.create(Window_Settings__Description.prototype);
Window_Misc_Music.prototype.constructor = Window_Misc_Music;

Window_Misc_Music.prototype.initialize = function (x, y, width) {
    this.resetId();
    this._minValue = 1;
    this._maxValue = 11;
    Window_Settings__Description.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Misc_Music.prototype.makeCommandList = function () {
    this.addCommand('Standard Battle', 'standardBattle');
};

Window_Misc_Music.prototype.makeDescriptions = function () {
    this._descriptions = [
        `Change the standard battle music.<BR>Does not change bosses or certain events.`,   // STANDARD BATTLE
    ];
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Misc_Music.prototype.resetId = function () {
    this._id = $gameSystem.battleBgmId();
};

Window_Misc_Music.prototype.statusText = function () {
    let value = 'DQ' + this._id;
    return `< ${value} >`;
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_Misc_Music.prototype.cursorRight = function () {
    this.cursorChange(1);
};

Window_Misc_Music.prototype.cursorLeft = function () {
    this.cursorChange(-1);
};

Window_Misc_Music.prototype.cursorChange = function (change) {
    let value = this._id;

    value += change;
    if (value > this._maxValue) {
        value = this._minValue;
    } else if (value < this._minValue) {
        value = this._maxValue;
    }
    this.changeValue(value);
};

Window_Misc_Music.prototype.changeValue = function (value) {
    $gameSystem.changeDefaultBattleBgm(value);
    this.resetId();
    this.redrawItem(0);
};
