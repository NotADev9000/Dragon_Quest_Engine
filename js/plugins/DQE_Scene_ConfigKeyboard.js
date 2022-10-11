//=============================================================================
// Dragon Quest Engine - Scene Config - Keyboard
// DQE_Scene_ConfigKeyboard.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the keyboard config menus - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_ConfigKeyboard = true;

var DQEng = DQEng || {};
DQEng.Scene_ConfigKeyboard = DQEng.Scene_ConfigKeyboard || {};

//-----------------------------------------------------------------------------
// Scene_ConfigKeyboard
//-----------------------------------------------------------------------------

function Scene_ConfigKeyboard() {
    this.initialize.apply(this, arguments);
}

Scene_ConfigKeyboard.prototype = Object.create(Scene_Config.prototype);
Scene_ConfigKeyboard.prototype.constructor = Scene_ConfigKeyboard;

Scene_ConfigKeyboard.prototype.create = function () {
    Scene_Config.prototype.create.call(this);
    this.createCommandWindow();
    this.createPressWindow();
    this.createControlsWindow();
    this.createHelpWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_ConfigKeyboard.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_Settings_Controls(48, 48, 1344, 0);
    this._commandWindow.setHandler('config', this.commandConfig.bind(this));
    this._commandWindow.setHandler('reset', this.commandReset.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_ConfigKeyboard.prototype.createControlsWindow = function () {
    let y = this._commandWindow.y + this._commandWindow.height;
    this._controlsWindow = new Window_Controls(48, y, 1344, 0);
    this._controlsWindow.setHandler('ok', this.onControlsOk.bind(this));
    this._controlsWindow.setHandler('cancel', this.onControlsCancel.bind(this));
    this.addWindow(this._controlsWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_ConfigKeyboard.prototype.commandReset = function () {
    Input.resetKeyMapper();
    Input.clear();
    Input.update();
    this._commandWindow.refresh();
    this._controlsWindow.refresh();
    this._commandWindow.activate();
};

//////////////////////////////
// Functions - data
//////////////////////////////

/**
 * Checks for key pressed
 * (and Esc key for canceling)
 */
Scene_ConfigKeyboard.prototype.checkButtonPress = function () {
    Input._checkKey = true;
    if (Input.isTriggered('escape')) {
        this.cancelButtonChange();
        return;
    }
    let button = Input.keyDown;
    if (button !== null && Input.keyMapper[button] !== undefined) this.applyButtonChange(button);
};

/**
 * @param {number} button ID of pressed gamepad button
 */
Scene_ConfigKeyboard.prototype.applyButtonChange = function (button) {
    let index = this._controlsWindow.index();
    let handle = Input.handlers[index];
    let handleId = handle[0]; // handle ID e.g. 'ok'
    // remove former button from mapper
    let formerButton = Input.keyMapper[handle[3]];
    let removeAt = formerButton.indexOf(handleId);
    if (removeAt > -1) formerButton.splice(removeAt, 1);
    // add new button to mapper
    let newButton = Input.keyMapper[button];
    newButton.push(handleId);
    // add new button to Input.handlers array
    handle[3] = button;
    // refresh input
    Input.update();
    Input.clear();
    this._controlsWindow.redrawItem(index);
    this._pressWindow.hide();
    // reset button delay
    this._editMode = 2;
    this._buttonDelay = 12;
    Input.resetChecks();
};

Scene_ConfigKeyboard.prototype.cancelButtonChange = function () {
    let index = this._controlsWindow.index();
    Input.resetChecks();
    this._controlsWindow.redrawItem(index);
    this._pressWindow.hide();
    this.buttonChangeUpdateWindows();
};
