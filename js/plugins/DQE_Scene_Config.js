//=============================================================================
// Dragon Quest Engine - Scene Config
// DQE_Scene_Config.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the control config menus - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Config = true;

var DQEng = DQEng || {};
DQEng.Scene_Config = DQEng.Scene_Config || {};

//-----------------------------------------------------------------------------
// Scene_Config
//-----------------------------------------------------------------------------

function Scene_Config() {
    this.initialize.apply(this, arguments);
}

Scene_Config.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Config.prototype.constructor = Scene_Config;

Scene_Config.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Config.prototype.createPressWindow = function () {
    let width = 504;
    let height = 105;
    let x = this._commandWindow.x + (this._commandWindow.width / 2) - (width / 2);
    let y = this._commandWindow.y + (this._commandWindow.height / 2) - (height / 2);
    this._pressWindow = new Window_ControlsPress(x, y, width, height);
    this._pressWindow.hide();
    this.addWindow(this._pressWindow);
};

Scene_Config.prototype.createHelpWindow = function () {
    let y = this._controlsWindow.y + this._controlsWindow.height;
    this._helpWindow = new Window_Help(48, y, 1344, 3);
    this.addWindow(this._helpWindow);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._controlsWindow.setHelpWindow(this._helpWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Config.prototype.commandConfig = function () {
    this._commandWindow.showBackgroundDimmer();
    this._controlsWindow.select(0);
    this._controlsWindow.activate();
};

Scene_Config.prototype.onControlsOk = function () {
    let index = this._controlsWindow.index();
    this._controlsWindow.clearIcon(index);
    this._controlsWindow.deactivate();
    this._pressWindow.show();
    this._editMode = 1;
    this._buttonDelay = 12;
};

Scene_Config.prototype.onControlsCancel = function () {
    this._controlsWindow.deselect();
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Scene_Config.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._editMode === 1 && this._buttonDelay-- <= 0) this.checkButtonPress();             // wait for gamepad button
    if (this._editMode === 2 && this._buttonDelay-- <= 0) this.buttonChangeUpdateWindows();    // activate control window
};

/**
 * Called when _commandWindow changes the icon type
 */
Scene_Config.prototype.refreshControlsWindow = function () {
    this._controlsWindow.refresh();
};

Scene_Config.prototype.buttonChangeUpdateWindows = function () {
    // hide press window
    this._controlsWindow.activate();
    this._editMode = 0;
};

Scene_Config.prototype.terminate = function () {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};
