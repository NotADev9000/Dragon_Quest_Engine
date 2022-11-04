//=============================================================================
// Dragon Quest Engine - Custom Command
// DQE_Window_CustomCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Window for selecting some commands passed as parameters on initialization - V0.1
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
Imported.DQEng_Window_CustomCommand = true;

var DQEng = DQEng || {};
DQEng.Window_CustomCommand = DQEng.Window_CustomCommand || {};

//-----------------------------------------------------------------------------
// Window_CustomCommand
//-----------------------------------------------------------------------------

function Window_CustomCommand() {
    this.initialize.apply(this, arguments);
}

Window_CustomCommand.prototype = Object.create(Window_Command.prototype);
Window_CustomCommand.prototype.constructor = Window_CustomCommand;

Window_CustomCommand.prototype.initialize = function (x, y, width, commands = [], animateOpen = false) {
    this._width = width;
    this._commands = commands;
    this._animateOpen = animateOpen;
    Window_Command.prototype.initialize.call(this, x, y);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_CustomCommand.prototype.windowWidth = function () {
    return this._width;
};

Window_CustomCommand.prototype.standardPadding = function () {
    return 24;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_CustomCommand.prototype.makeCommandList = function () {
    this._commands.forEach(command => this.addCommand(command, command));
};

Window_CustomCommand.prototype.open = function () {
    if (this._animateOpen) SoundManager.playChoice();
    Window_Command.prototype.open.call(this);
};

Window_CustomCommand.prototype.updateOpen = function () {
    if (this._opening) {
        this._animateOpen ? this.openness += 32: this.openness = 255;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};
