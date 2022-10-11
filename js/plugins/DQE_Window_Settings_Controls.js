//=============================================================================
// Dragon Quest Engine - Window Settings - Controls
// DQE_Window_Settings_Controls.js                                                             
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
Imported.DQEng_Window_Settings_Controls = true;

var DQEng = DQEng || {};
DQEng.Window_Settings_Controls = DQEng.Window_Settings_Controls || {};

//-----------------------------------------------------------------------------
// Window_Settings_Controls
//-----------------------------------------------------------------------------

function Window_Settings_Controls() {
    this.initialize.apply(this, arguments);
}

Window_Settings_Controls.prototype = Object.create(Window_Settings.prototype);
Window_Settings_Controls.prototype.constructor = Window_Settings_Controls;

Window_Settings_Controls.prototype.initialize = function (x, y, width, mode) {
    this._mode = mode; // 0 = keyboard, 1 = gamepad
    Window_Settings.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Settings_Controls.prototype.makeCommandList = function () {
    this.addCommand('Change Configuration', 'config');
    if (this._mode === 1) this.addCommand('Icon Type', 'iconType', Window_Settings.COMMAND_TYPE_ICON);
    this.addCommand('Reset to Default', 'reset');
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Settings_Controls.prototype.statusText = function (index) {
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    value = this.iconText(value);
    return `< ${value} >`;
};

Window_Settings_Controls.prototype.iconText = function (value) {
    switch (value) {
        case Input.ICON_XBOX:
            return Input.GAMEPAD_NAME_XBOX;
        case Input.ICON_PLAYSTATION:
            return Input.GAMEPAD_NAME_PLAYSTATION;
        case Input.ICON_SWITCH:
            return Input.GAMEPAD_NAME_SWITCH;
        default:
            return Input.GAMEPAD_NAME_GENERIC;
    }
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_Settings_Controls.prototype.processOk = function () {
    let index = this.index();
    this._cmdType[index] ? this.cursorRight() : Window_Selectable.prototype.processOk.call(this);
};

Window_Settings_Controls.prototype.cursorRight = function () {
    let index = this.index();
    if (this._cmdType[index]) {
        let symbol = this.commandSymbol(index);
        let value = this.getConfigValue(symbol);
        value >= 4 ? value = 1 : value ++;
        this.changeValue(symbol, value);
    }
};

Window_Settings_Controls.prototype.cursorLeft = function () {
    let index = this.index();
    if (this._cmdType[index]) {
        let symbol = this.commandSymbol(index);
        let value = this.getConfigValue(symbol);
        value <= 1 ? value = 4 : value--;
        this.changeValue(symbol, value);
    }
};

Window_Settings_Controls.prototype.changeValue = function (symbol, value) {
    Window_Settings.prototype.changeValue.call(this, symbol, value);
    let scene = SceneManager._scene;
    scene.refreshControlsWindow.call(scene);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Settings_Controls.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let textWidth = this.contentsWidth() - this.textPadding();
    this.drawText(this.commandName(index), rect.x, rect.y);
    if (this._cmdType[index]) this.drawText(this.statusText(index), rect.x, rect.y, textWidth, 'right');
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_Settings_Controls.prototype.updateHelp = function () {
    const index = this.index();
    let text = '';
    switch (index) {
        case 1:
            text = this._mode === 0 ? 'Reset the controls back to the default settings.' : 
                                      'Change the icons displayed in menus.<BR>This choice does not affect the actual controls.';
            break;
        case 2:
            text = 'Reset the controls back to a default setting.<BR>You can choose from various gamepad styles.';
            break;
        default:
            text = this._mode === 0 ? 'Change the controls for the keyboard.<BR>Use the mouse buttons if you get stuck.' : 
                                      'Change the controls for the connected gamepad.<BR>Use the mouse buttons if you get stuck.';
            break;
    }
    this.setHelpWindowItem(text);
};

Window_Settings_Controls.prototype.updateSingleHelp = function () {
    this.updateHelp();
};
