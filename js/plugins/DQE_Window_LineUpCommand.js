//=============================================================================
// Dragon Quest Engine - Window Line-Up Command
// DQE_Window_LineUpCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Window for selecting line-up type - V0.1
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
Imported.DQEng_Window_LineUpCommand = true;

var DQEng = DQEng || {};
DQEng.Window_LineUpCommand = DQEng.Window_LineUpCommand || {};

//-----------------------------------------------------------------------------
// Window_LineUpCommand
//-----------------------------------------------------------------------------

function Window_LineUpCommand() {
    this.initialize.apply(this, arguments);
}

Window_LineUpCommand.prototype = Object.create(Window_Command.prototype);
Window_LineUpCommand.prototype.constructor = Window_LineUpCommand;

Window_LineUpCommand.prototype.initialize = function (x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_LineUpCommand.prototype.windowWidth = function () {
    return 306;
};

Window_LineUpCommand.prototype.standardPadding = function () {
    return 24;
};

Window_LineUpCommand.prototype.lineGap = function () {
    return 15;
};

Window_LineUpCommand.prototype.numVisibleRows = function () {
    return 2;
};

Window_LineUpCommand.prototype.makeCommandList = function () {
    this.addCommand('Individual', 'Individual');
    this.addCommand('Group', 'Group');
};
