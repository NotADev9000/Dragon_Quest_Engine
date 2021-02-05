//=============================================================================
// Dragon Quest Engine - Window Settings - Window
// DQE_Window_SettingsWindow.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing window settings - V0.1
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
Imported.DQEng_Window_SettingsWindow = true;

var DQEng = DQEng || {};
DQEng.Window_SettingsWindow = DQEng.Window_SettingsWindow || {};

//-----------------------------------------------------------------------------
// Window_SettingsWindow
//-----------------------------------------------------------------------------

function Window_SettingsWindow() {
    this.initialize.apply(this, arguments);
}

Window_SettingsWindow.prototype = Object.create(Window_Settings.prototype);
Window_SettingsWindow.prototype.constructor = Window_SettingsWindow;

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SettingsWindow.prototype.standardPadding = function () {
    return 9;
};

Window_SettingsWindow.prototype.extraPadding = function () {
    return 15;
};

// height of the description block (including horizontal rule)
Window_SettingsWindow.prototype.titleBlockHeight = function () {
    return 126;
};

Window_SettingsWindow.prototype.fittingHeight = function (numLines) {
    return Window_Base.prototype.fittingHeightTitleBlock.call(this, numLines);
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_SettingsWindow.prototype.makeCommandList = function () {
    this.addCommand('Window Scale', 'windowScale', Window_Settings.COMMAND_TYPE_SCALE);
    this.addCommand('Fullscreen', 'fullscreen', Window_Settings.COMMAND_TYPE_BOOL_ONOFF);
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_SettingsWindow.prototype.select = function (index) {
    Window_Settings.prototype.select.call(this, index);
    this.refresh();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SettingsWindow.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let textWidth = this.contentsWidth() - this.textPadding() - (this.extraPadding()*2);
    this.drawText(this.commandName(index), rect.x, rect.y);
    this.drawText(this.statusText(index), rect.x, rect.y, textWidth, 'right');
};

Window_SettingsWindow.prototype.drawDescription = function () {
    // horizontal rule
    let ep = this.extraPadding();
    let y = this.contentsHeight() - this.titleBlockHeight();
    this.drawHorzLine(0, y);
    y += 3 + ep;
    // description text
    let symbol = this.currentSymbol();
    let text;
    switch (symbol) {
        case 'fullscreen':
            text = 'Toggle fullscreen.<BR>Can be done anytime by pressing F4 on your keyboard.';
            break;
        default:
            text = 'Change the size of the game window when fullscreen is OFF.<BR>x3 is the default value.';
            break;
    }
    this.drawTextEx(text, ep, y);
};

Window_SettingsWindow.prototype.itemRect = function (index) {
    let rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.x += this.extraPadding();
    rect.y += this.extraPadding();
    return rect;
};

Window_SettingsWindow.prototype.refresh = function () {
    Window_Settings.prototype.refresh.call(this);
    this.drawDescription();
};
