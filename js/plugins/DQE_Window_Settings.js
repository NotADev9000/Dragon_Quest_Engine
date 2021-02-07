//=============================================================================
// Dragon Quest Engine - Window Settings
// DQE_Window_Settings.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The parent window for various settings windows - V0.1
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
Imported.DQEng_Window_Settings = true;

var DQEng = DQEng || {};
DQEng.Window_Settings = DQEng.Window_Settings || {};

//-----------------------------------------------------------------------------
// Window_Settings
//-----------------------------------------------------------------------------

function Window_Settings() {
    this.initialize.apply(this, arguments);
}

Window_Settings.prototype = Object.create(Window_Command.prototype);
Window_Settings.prototype.constructor = Window_Settings;

Window_Settings.prototype.initialize = function (x, y, width) {
    this._width = width;
    this._cmdType = [];
    Window_Command.prototype.initialize.call(this, x, y);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Settings.prototype.windowWidth = function () {
    return this._width;
};

Window_Settings.prototype.standardPadding = function () {
    return 24;
};

//////////////////////////////
// Functions - config data
//////////////////////////////

Window_Settings.prototype.getConfigValue = function (symbol) {
    return ConfigManager[symbol];
};

Window_Settings.prototype.setConfigValue = function (symbol, value) {
    ConfigManager[symbol] = value;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Settings.COMMAND_TYPE_VOLUME = 0;
Window_Settings.COMMAND_TYPE_BOOL_ONOFF = 1;
Window_Settings.COMMAND_TYPE_TEXT_SPEED = 2;
Window_Settings.COMMAND_TYPE_SCALE = 3;

Window_Settings.prototype.addCommand = function (name, symbol, type, enabled = true, ext = null) {
    this._list.push({ 
        name: name, 
        symbol: symbol, enabled: 
        enabled, 
        ext: ext 
    });
    this._cmdType.push(type);
};

Window_Settings.prototype.statusText = function (index) {
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    let type = this._cmdType[index];
    switch (type) {
        case Window_Settings.COMMAND_TYPE_VOLUME:
            value = this.volumeText(value).padStart(4, ' ');
            break;
        case Window_Settings.COMMAND_TYPE_BOOL_ONOFF:
            value = this.onOffText(value).padStart(3, ' ');
            break;
        case Window_Settings.COMMAND_TYPE_TEXT_SPEED:
            value = this.speedText(value).padStart(6, ' ');
            break;
        case Window_Settings.COMMAND_TYPE_SCALE:
            value = this.scaleText(value).padStart(2, ' ');
            break;
        default:
            console.error(`1: INVALID command type in ${this}`);
            return '???';
    }
    return `< ${value} >`;
};

Window_Settings.prototype.volumeText = function (value) {
    return value + '%';
};

Window_Settings.prototype.onOffText = function (value) {
    return value ? 'ON' : 'OFF';
};

Window_Settings.prototype.speedText = function (value) {
    switch (value) {
        case 1:
            return 'V Slow';
        case 2:
            return 'Slow';
        case 3:
            return 'Medium';
        case 4:
            return 'Fast';
        case 5:
            return 'V Fast';
        default:
            return '??????';
    }
};

Window_Settings.prototype.scaleText = function (value) {
    return 'x' + value;
};

Window_Settings.prototype.volumeOffset = function () {
    return 10;
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_Settings.prototype.cursorRight = function () {
    let index = this.index();
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    let type = this._cmdType[index];
    switch (type) {
        case Window_Settings.COMMAND_TYPE_VOLUME:
            value >= 100 ? value = 0 : value += this.volumeOffset();
            value = value.clamp(0, 100);
            break;
        case Window_Settings.COMMAND_TYPE_BOOL_ONOFF:
            value = value ? 0 : 1;
            break;
        case Window_Settings.COMMAND_TYPE_TEXT_SPEED:
        case Window_Settings.COMMAND_TYPE_SCALE:
            value >= 5 ? value = 1 : value++;
            value = value.clamp(1, 5);
            break;
        default:
            console.error(`2: INVALID command type in ${this}`);
            return '???';
    }
    this.changeValue(symbol, value);
};

Window_Settings.prototype.cursorLeft = function () {
    let index = this.index();
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    let type = this._cmdType[index];
    switch (type) {
        case Window_Settings.COMMAND_TYPE_VOLUME:
            value <= 0 ? value = 100 : value -= this.volumeOffset();
            value = value.clamp(0, 100);
            break;
        case Window_Settings.COMMAND_TYPE_BOOL_ONOFF:
            value = value ? 0 : 1;
            break;
        case Window_Settings.COMMAND_TYPE_TEXT_SPEED:
        case Window_Settings.COMMAND_TYPE_SCALE:
            value <= 1 ? value = 5 : value--;
            value = value.clamp(1, 5);
            break;
        default:
            console.error(`3: INVALID command type in ${this}`);
            return '???';
    }
    this.changeValue(symbol, value);
};

Window_Settings.prototype.changeValue = function (symbol, value) {
    let lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
        this.setConfigValue(symbol, value);
        this.redrawItem(this.findSymbol(symbol));
    }
    if (symbol === 'seVolume') this.playOkSound(); // play sfx when changing sound effect volume
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Settings.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let textWidth = this.contentsWidth() - this.textPadding();
    this.drawText(this.commandName(index), rect.x, rect.y);
    this.drawText(this.statusText(index), rect.x, rect.y, textWidth, 'right');
};
