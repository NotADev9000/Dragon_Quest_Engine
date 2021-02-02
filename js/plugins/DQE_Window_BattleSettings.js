//=============================================================================
// Dragon Quest Engine - Window Battle Settings
// DQE_Window_BattleSettings.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing battle settings - V0.1
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
Imported.DQEng_Window_BattleSettings = true;

var DQEng = DQEng || {};
DQEng.Window_BattleSettings = DQEng.Window_BattleSettings || {};

//-----------------------------------------------------------------------------
// Window_BattleSettings
//-----------------------------------------------------------------------------

function Window_BattleSettings() {
    this.initialize.apply(this, arguments);
}

Window_BattleSettings.prototype = Object.create(Window_Command.prototype);
Window_BattleSettings.prototype.constructor = Window_BattleSettings;

Window_BattleSettings.prototype.initialize = function (x, y, width) {
    this._width = width;
    Window_Command.prototype.initialize.call(this, x, y);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_BattleSettings.prototype.windowWidth = function () {
    return this._width;
};

Window_BattleSettings.prototype.standardPadding = function () {
    return 24;
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_BattleSettings.prototype.makeCommandList = function () {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume');
    this.addCommand(TextManager.bgsVolume, 'bgsVolume');
    this.addCommand(TextManager.seVolume, 'seVolume');
    this.addCommand('Battle Text Speed', 'battleTextSpeed');
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_BattleSettings.prototype.statusText = function (index) {
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        value = this.volumeStatusText(value).padStart(4, ' ');
    } else {
        value = this.speedStatusText(value).padStart(6, ' ');
    }
    return `< ${value} >`;
};

Window_BattleSettings.prototype.isVolumeSymbol = function (symbol) {
    return symbol.contains('Volume');
};

Window_BattleSettings.prototype.volumeStatusText = function (value) {
    return value + '%';
};

Window_BattleSettings.prototype.speedStatusText = function (value) {
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

Window_BattleSettings.prototype.volumeOffset = function () {
    return 10;
};

Window_BattleSettings.prototype.getConfigValue = function (symbol) {
    return ConfigManager[symbol];
};

Window_BattleSettings.prototype.setConfigValue = function (symbol, value) {
    ConfigManager[symbol] = value;
    if (symbol === 'bgmVolume') ConfigManager.meVolume = value; // ME Volume = BGM Volume
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_BattleSettings.prototype.cursorRight = function () {
    let index = this.index();
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        value >= 100 ? value = 0 : value += this.volumeOffset();
        value = value.clamp(0, 100);
    } else {
        value >= 5 ? value = 1 : value++;
        value = value.clamp(1, 5);
    }
    this.changeValue(symbol, value);
};

Window_BattleSettings.prototype.cursorLeft = function () {
    let index = this.index();
    let symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        value <= 0 ? value = 100 : value -= this.volumeOffset();
        value = value.clamp(0, 100);
    } else {
        value <= 1 ? value = 5 : value--;
        value = value.clamp(1, 5);
    }
    this.changeValue(symbol, value);
};

Window_BattleSettings.prototype.changeValue = function (symbol, value) {
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

Window_BattleSettings.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let textWidth = this.contentsWidth() - this.textPadding();
    this.drawText(this.commandName(index), rect.x, rect.y);
    this.drawText(this.statusText(index), rect.x, rect.y, textWidth, 'right');
};
