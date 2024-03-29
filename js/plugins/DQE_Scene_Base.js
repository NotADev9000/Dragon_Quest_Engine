//=============================================================================
// Dragon Quest Engine - Scene Base
// DQE_Scene_Base.js                                                             
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
Imported.DQEng_Scene_Base = true;

var DQEng = DQEng || {};
DQEng.Scene_Base = DQEng.Scene_Base || {};

//-----------------------------------------------------------------------------
// Scene_Base
//-----------------------------------------------------------------------------

DQEng.Scene_Base.initialize = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function () {
    this._activeMessage = null;
    DQEng.Scene_Base.initialize.call(this);
};

/**
 * Displays a message box while in the current scene
 * A callback method is run after the message is closed
 * 
 * @param {String} message the text to display in a message box
 * @param {String} callback the method to call after the message box is closed
 */
Scene_Base.prototype.displayMessage = function (message, callback) {
    $gameMessage.add(message);
    this._activeMessage = callback;
};

/**
 * Runs callback function after a message has been closed
 */
Scene_Base.prototype.manageMessageCallback = function () {
    if (this._activeMessage) {
        let msg = this._activeMessage; // stored here so it can be checked if the active message changed
        this._activeMessage.call(this);
        if (msg === this._activeMessage) { // if != then another message with a callback has been requested
            this._activeMessage = null;
        }
    }
};

/**
 * If a message window has finished closing, manage the callbacks
 */
DQEng.Scene_Base.update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function () {
    if (this._activeMessage && !$gameMessage.isBusy() && 
        this._messageWindow && !this._messageWindow.isClosing()) {
        this.manageMessageCallback();
    }
    DQEng.Scene_Base.update.call(this);
};

/**
 * Changed so windows are no longer added to windowlayer()
 * as per: https://forums.rpgmakerweb.com/index.php?threads/debugging-graphics-and-why-you-should-stop-using-windowlayer.132126/
 */
Scene_Base.prototype.addWindow = function (window) {
    this.addChild(window);
};
