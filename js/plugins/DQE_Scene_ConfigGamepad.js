//=============================================================================
// Dragon Quest Engine - Scene Config - Gamepad
// DQE_Scene_ConfigGamepad.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the gamepad config menus - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_ConfigGamepad = true;

var DQEng = DQEng || {};
DQEng.Scene_ConfigGamepad = DQEng.Scene_ConfigGamepad || {};

//-----------------------------------------------------------------------------
// Scene_ConfigGamepad
//-----------------------------------------------------------------------------

function Scene_ConfigGamepad() {
    this.initialize.apply(this, arguments);
}

Scene_ConfigGamepad.prototype = Object.create(Scene_Config.prototype);
Scene_ConfigGamepad.prototype.constructor = Scene_ConfigGamepad;

Scene_ConfigGamepad.prototype.create = function () {
    Scene_Config.prototype.create.call(this);
    this.createCommandWindow();
    this.createPressWindow();
    this.createControlsWindow();
    this.createResetWindow();
    this.createHelpWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_ConfigGamepad.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_Settings_Controls(48, 48, 1344, 1);
    this._commandWindow.setHandler('config', this.commandConfig.bind(this));
    this._commandWindow.setHandler('reset', this.commandReset.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_ConfigGamepad.prototype.createControlsWindow = function () {
    let y = this._commandWindow.y + this._commandWindow.height;
    this._controlsWindow = new Window_Controls(48, y, 1344, 1);
    this._controlsWindow.setHandler('ok', this.onControlsOk.bind(this));
    this._controlsWindow.setHandler('cancel', this.onControlsCancel.bind(this));
    this.addWindow(this._controlsWindow);
};

Scene_ConfigGamepad.prototype.createResetWindow = function () {
    this._resetWindow = new Window_TitledCommand(48, 48, 431, 'Controller Style',
        [Input.GAMEPAD_NAME_GENERIC,
        Input.GAMEPAD_NAME_XBOX,
        Input.GAMEPAD_NAME_PLAYSTATION,
        Input.GAMEPAD_NAME_NINTENDO]);
    this._resetWindow.setHandler('ok', this.onResetOk.bind(this));
    this._resetWindow.setHandler('cancel', this.onResetCancel.bind(this));
    this._resetWindow.deactivate();
    this._resetWindow.hide();
    this.addWindow(this._resetWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_ConfigGamepad.prototype.commandReset = function () {
    this._commandWindow.showBackgroundDimmer();
    this._controlsWindow.showBackgroundDimmer();
    this._helpWindow.showBackgroundDimmer();
    this._resetWindow.select(0);
    this._resetWindow.show();
    this._resetWindow.activate();
};

Scene_ConfigGamepad.prototype.onResetOk = function () {
    let index = this._resetWindow.index();
    ConfigManager.iconType = index + 1;
    Input.resetGamepadMapper(index === 3);
    Input.clear();
    Input.update();
    this._commandWindow.refresh();
    this._controlsWindow.refresh();
    this.onResetCancel();
};

Scene_ConfigGamepad.prototype.onResetCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._controlsWindow.hideBackgroundDimmer();
    this._helpWindow.hideBackgroundDimmer();
    this._resetWindow.hide();
    this._commandWindow.activate();
};

//////////////////////////////
// Functions - data
//////////////////////////////

/**
 * Checks for gamepad button pressed
 * (and Esc key for canceling)
 */
Scene_ConfigGamepad.prototype.checkButtonPress = function () {
    if (Input.isTriggered('escape')) {
        this.cancelButtonChange();
        return;
    }
    let button = Input.getPressedGamepadButton();
    if (button >= 0 && button <= 15) this.applyButtonChange(button);
};

/**
 * @param {number} button ID of pressed gamepad button
 */
Scene_ConfigGamepad.prototype.applyButtonChange = function (button) {
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

Scene_ConfigGamepad.prototype.cancelButtonChange = function () {
    let index = this._controlsWindow.index();
    this._controlsWindow.redrawItem(index);
    this._pressWindow.hide();
    this.buttonChangeUpdateWindows();
};
