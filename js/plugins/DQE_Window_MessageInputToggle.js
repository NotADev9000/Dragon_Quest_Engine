//=============================================================================
// Dragon Quest Engine - Window Message Input Toggle
// DQE_Window_MessageInputToggle.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Message window where the input can be toggled - V0.1
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
DQEng.Window_MessageInputToggle = DQEng.Window_MessageInputToggle || {};

//-----------------------------------------------------------------------------
// Window_MessageInputToggle
//-----------------------------------------------------------------------------

function Window_MessageInputToggle() {
    this.initialize.apply(this, arguments);
}

Window_MessageInputToggle.prototype = Object.create(Window_Message.prototype);
Window_MessageInputToggle.prototype.constructor = Window_MessageInputToggle;

Window_MessageInputToggle.prototype.initialize = function () {
    Window_Message.prototype.initialize.call(this);
    this._input = false;
};

Window_MessageInputToggle.prototype.setInput = function (input) {
    this._input = input;
};

Window_MessageInputToggle.prototype.terminateMessage = function () {
    $gameMessage.clear();
};

Window_MessageInputToggle.prototype.onEndOfText = function () {
    if (!this.startInput()) {
        if (this._input && !this._pauseSkip) {
            this.startPause();
        } else {
            this.terminateMessage();
        }
    }
    this._textState = null;
};