//=============================================================================
// Dragon Quest Engine - Scene Menu Base
// DQE_Scene_MenuBase.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene base for menus - V0.1
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
Imported.DQEng_Scene_MenuBase = true;

var DQEng = DQEng || {};
DQEng.Scene_MenuBase = DQEng.Scene_MenuBase || {};

//-----------------------------------------------------------------------------
// Scene_MenuBase
//-----------------------------------------------------------------------------

Scene_MenuBase.prototype.initialize = function () {
    this._activeMessage = null;
    Scene_Base.prototype.initialize.call(this);
};

/**
 * Displays a message box while in the current scene
 * A callback method is run after the message is closed
 * 
 * @param {String} message the text to display in a message box
 * @param {String} callback the method to call after the message box is closed
 */
Scene_MenuBase.prototype.displayMessage = function (message, callback) {
    $gameMessage.add(message);
    this._activeMessage = callback;
}

/**
 * Runs callback function after a message has been closed
 */
Scene_MenuBase.prototype.manageMessageCallback = function () {
    if (this._activeMessage) {
        this._activeMessage.call(this);
        this._activeMessage = null;
    }
}

/**
 * If a message window has finished closing, manage the callbacks
 */
Scene_MenuBase.prototype.update = function () {
    if (this._activeMessage && !$gameMessage.isBusy() && 
        this._messageWindow && !this._messageWindow.isClosing()) {
        this.manageMessageCallback();
    }
    Scene_Base.prototype.update.call(this);
};