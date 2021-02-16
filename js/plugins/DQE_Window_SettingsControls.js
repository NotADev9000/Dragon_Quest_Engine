//=============================================================================
// Dragon Quest Engine - Window Settings - Controls
// DQE_Window_SettingsControls.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A command window for accessing control config changes - V0.1
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
Imported.DQEng_Window_SettingsControls = true;

var DQEng = DQEng || {};
DQEng.Window_SettingsControls = DQEng.Window_SettingsControls || {};

//-----------------------------------------------------------------------------
// Window_SettingsControls
//-----------------------------------------------------------------------------

function Window_SettingsControls() {
    this.initialize.apply(this, arguments);
}

Window_SettingsControls.prototype = Object.create(Window_Settings.prototype);
Window_SettingsControls.prototype.constructor = Window_SettingsControls;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_SettingsControls.prototype.makeCommandList = function () {
    this.addCommand('Change Configuration', 'config');
    this.addCommand('Icon Type', 'iconType', Window_Settings.COMMAND_TYPE_ICON);
    this.addCommand('Reset to Default', 'reset');
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_SettingsControls.prototype.statusText = function (index) {
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    value = this.iconText(value);
    return `< ${value} >`;
};

Window_SettingsControls.prototype.iconText = function (value) {
    switch (value) {
        case Input.ICON_XBOX:
            return 'Xbox';
        case Input.ICON_PLAYSTATION:
            return 'PlayStation';
        case Input.ICON_SWITCH:
            return 'Switch';
        default:
            return 'Generic';
    }
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_SettingsControls.prototype.processOk = function () {
    let index = this.index();
    this._cmdType[index] ? this.cursorRight() : Window_Selectable.prototype.processOk.call(this);
};

Window_SettingsControls.prototype.cursorRight = function () {
    let index = this.index();
    if (this._cmdType[index]) {
        let symbol = this.commandSymbol(index);
        let value = this.getConfigValue(symbol);
        value >= 4 ? value = 1 : value ++;
        this.changeValue(symbol, value);
    }
};

Window_SettingsControls.prototype.cursorLeft = function () {
    let index = this.index();
    if (this._cmdType[index]) {
        let symbol = this.commandSymbol(index);
        let value = this.getConfigValue(symbol);
        value <= 1 ? value = 4 : value--;
        this.changeValue(symbol, value);
    }
};

Window_SettingsControls.prototype.changeValue = function (symbol, value) {
    Window_Settings.prototype.changeValue.call(this, symbol, value);
    let scene = SceneManager._scene;
    scene.refreshControlsWindow.call(scene);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SettingsControls.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let textWidth = this.contentsWidth() - this.textPadding();
    this.drawText(this.commandName(index), rect.x, rect.y);
    if (this._cmdType[index]) this.drawText(this.statusText(index), rect.x, rect.y, textWidth, 'right');
};
