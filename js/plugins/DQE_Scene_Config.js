//=============================================================================
// Dragon Quest Engine - Scene Config
// DQE_Scene_Config.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the controls config menu - V0.1
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

Scene_Config.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createPressWindow();
    this.createControlsWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Config.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_SettingsControls(48, 48, 1344);
    this._commandWindow.setHandler('config', this.commandConfig.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Config.prototype.createPressWindow = function () {
    let width = 504;
    let height = 105;
    let x = this._commandWindow.x + (this._commandWindow.width / 2) - (width / 2);
    let y = this._commandWindow.y + (this._commandWindow.height / 2) - (height / 2);
    this._pressWindow = new Window_ControlsPress(x, y, width, height);
    this._pressWindow.hide();
    this.addWindow(this._pressWindow);
};

Scene_Config.prototype.createControlsWindow = function () {
    let y = this._commandWindow.y + this._commandWindow.height;
    this._controlsWindow = new Window_Controls(48, y, 1344);
    this._controlsWindow.setHandler('ok', this.onControlsOk.bind(this));
    this._controlsWindow.setHandler('cancel', this.onControlsCancel.bind(this));
    this.addWindow(this._controlsWindow);
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
// Functions - data
//////////////////////////////

/**
 * Checks for gamepad button pressed
 * (and Esc key for canceling)
 */
Scene_Config.prototype.checkButtonPress = function () {
    if (Input.isTriggered('escape')) {
        this.cancelButtonChange();
        return;
    }
    let button = Input.getPressedGamepadButton();
    if (button >= 0 && button <= 15) this.applyButtonChange(button);
};

/**
 * 
 * @param {number} button ID of pressed gamepad button
 */
Scene_Config.prototype.applyButtonChange = function (button) {
    let index = this._controlsWindow.index();
    let handle = Input.handlers[index];
    let handleId = handle[0]; // handle ID e.g. 'ok'
    // remove former button from mapper
    let formerButton = Input.gamepadMapper[handle[2]];
    let removeAt = formerButton.indexOf(handleId);
    if (removeAt > -1) formerButton.splice(removeAt, 1);
    // add new button to mapper
    let newButton = Input.gamepadMapper[button];
    newButton.push(handleId);
    // add new button to Input.handlers array
    handle[2] = button;
    // refresh input
    Input.update();
    Input.clear();
    this._controlsWindow.redrawItem(index);
    this._pressWindow.hide();
    // reset button delay
    this._editMode = 2;
    this._buttonDelay = 12;
};

Scene_Config.prototype.cancelButtonChange = function () {
    let index = this._controlsWindow.index();
    this._controlsWindow.redrawItem(index);
    this._pressWindow.hide();
    this.buttonChangeUpdateWindows();
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
