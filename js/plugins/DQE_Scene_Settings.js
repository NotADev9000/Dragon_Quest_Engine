//=============================================================================
// Dragon Quest Engine - Scene Settings
// DQE_Scene_Settings.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the settings menu - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Settings = true;

var DQEng = DQEng || {};
DQEng.Scene_Settings = DQEng.Scene_Settings || {};

//-----------------------------------------------------------------------------
// Scene_Settings
//-----------------------------------------------------------------------------

function Scene_Settings() {
    this.initialize.apply(this, arguments);
}

Scene_Settings.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Settings.prototype.constructor = Scene_Settings;

Scene_Settings.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._windowsCreated = false; // have all windows in scene been created?
};

Scene_Settings.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createAudioWindow();
    this.createTextWindow();
    this.createWindowWindow();
    // set windows created
    this._windowsCreated = true;
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Settings.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledCommand(48, 48, 354, 'Settings', ['Audio', 'Text', 'Window', 'Controls'], Scene_Settings.prototype.changeWindows);
    this._commandWindow.setHandler('Audio', this.commandAudio.bind(this));
    this._commandWindow.setHandler('Text', this.commandText.bind(this));
    this._commandWindow.setHandler('Window', this.commandWindow.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Settings.prototype.createAudioWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    let y = this._commandWindow.y;
    this._audioWindow = new Window_SettingsAudio(x, y, 840);
    this._audioWindow.setHandler('cancel', this.onAudioCancel.bind(this));
    this._audioWindow.deselect();
    this._audioWindow.deactivate();
    this.addWindow(this._audioWindow);
};

Scene_Settings.prototype.createTextWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    let y = this._commandWindow.y;
    this._textWindow = new Window_SettingsText(x, y, 840);
    this._textWindow.setHandler('cancel', this.onTextCancel.bind(this));
    this._textWindow.hide();
    this._textWindow.deselect();
    this._textWindow.deactivate();
    this.addWindow(this._textWindow);
};

Scene_Settings.prototype.createWindowWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    let y = this._commandWindow.y;
    this._windowWindow = new Window_SettingsWindow(x, y, 840);
    this._windowWindow.setHandler('cancel', this.onWindowCancel.bind(this));
    this._windowWindow.hide();
    this._windowWindow.deselect();
    this._windowWindow.deactivate();
    this.addWindow(this._windowWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Settings.prototype.commandAudio = function () {
    this._commandWindow.showBackgroundDimmer();
    this._audioWindow.select(0);
    this._audioWindow.activate();
};

Scene_Settings.prototype.commandText = function () {
    this._commandWindow.showBackgroundDimmer();
    this._textWindow.select(0);
    this._textWindow.activate();
};

Scene_Settings.prototype.commandWindow = function () {
    this._commandWindow.showBackgroundDimmer();
    this._windowWindow.select(0);
    this._windowWindow.activate();
};

Scene_Settings.prototype.onAudioCancel = function () {
    this._audioWindow.deselect();
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};

Scene_Settings.prototype.onTextCancel = function () {
    this._textWindow.deselect();
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};

Scene_Settings.prototype.onWindowCancel = function () {
    this._windowWindow.deselect();
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};

//////////////////////////////
// Functions - selection callbacks
//////////////////////////////

/**
 * @param {String} symbol the command windows current selection
 */
Scene_Settings.prototype.changeWindows = function (symbol) {
    if (this._windowsCreated) {
        switch (symbol) {
            case 'Audio':
                this._audioWindow.show();
                this._textWindow.hide();
                this._windowWindow.hide();
                break;
            case 'Text':
                this._textWindow.show();
                this._audioWindow.hide();
                this._windowWindow.hide();
                break;
            case 'Window':
                this._windowWindow.show();
                this._audioWindow.hide();
                this._textWindow.hide();
                break;
            case 'Controls':
                this._audioWindow.hide();
                this._textWindow.hide();
                this._windowWindow.hide();
                break;
        }
    }
};
