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

Window_CustomCommand.prototype.initialize = function (x, y, width, commands = []) {
    this._width = width;
    this._commands = commands;
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

Window_CustomCommand.prototype.lineGap = function () {
    return 15;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_CustomCommand.prototype.makeCommandList = function () {
    this._commands.forEach(command => this.addCommand(command, command));
};
