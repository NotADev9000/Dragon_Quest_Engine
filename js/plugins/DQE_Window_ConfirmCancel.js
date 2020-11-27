//=============================================================================
// Dragon Quest Engine - Confirm/Cancel
// DQE_Window_ConfirmCancel.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A simple command window with confirm/cancel - V0.1
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
Imported.DQEng_Window_ConfirmCancel = true;

var DQEng = DQEng || {};
DQEng.Window_ConfirmCancel = DQEng.Window_ConfirmCancel || {};

//-----------------------------------------------------------------------------
// Window_ConfirmCancel
//-----------------------------------------------------------------------------

function Window_ConfirmCancel() {
    this.initialize.apply(this, arguments);
}

Window_ConfirmCancel.prototype = Object.create(Window_Command.prototype);
Window_ConfirmCancel.prototype.constructor = Window_ConfirmCancel;

Window_ConfirmCancel.prototype.initialize = function (x, y, windowWidth) {
    this._width = windowWidth;
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_ConfirmCancel.prototype.windowWidth = function () {
    return this._width;
};

Window_ConfirmCancel.prototype.makeCommandList = function () {
    this.addCommand('Confirm', 'Confirm');
    this.addCommand('Cancel', 'Cancel');
};
