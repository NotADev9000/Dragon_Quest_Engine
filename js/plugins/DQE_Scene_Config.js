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
    this.createControlsWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Config.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_SettingsControls(48, 48, 1344);
    // this._commandWindow.setHandler('config', this.commandConfig.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Config.prototype.createControlsWindow = function () {
    let y = this._commandWindow.y + this._commandWindow.height;
    this._controlsWindow = new Window_Controls(48, y, 1344);
    this.addWindow(this._controlsWindow);
};

//////////////////////////////
// Functions - selection callbacks
//////////////////////////////

Scene_Config.prototype.refreshControlsWindow = function () {
    this._controlsWindow.refresh();
};
