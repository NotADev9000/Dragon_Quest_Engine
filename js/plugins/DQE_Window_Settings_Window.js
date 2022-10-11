//=============================================================================
// Dragon Quest Engine - Window Settings - Window
// DQE_Window_Settings_Window.js                                                             
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
Imported.DQEng_Window_Settings_Window = true;

var DQEng = DQEng || {};
DQEng.Window_Settings_Window = DQEng.Window_Settings_Window || {};

//-----------------------------------------------------------------------------
// Window_Settings_Window
//-----------------------------------------------------------------------------

function Window_Settings_Window() {
    this.initialize.apply(this, arguments);
}

Window_Settings_Window.prototype = Object.create(Window_Settings.prototype);
Window_Settings_Window.prototype.constructor = Window_Settings_Window;

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Settings_Window.prototype.standardPadding = function () {
    return 9;
};

Window_Settings_Window.prototype.extraPadding = function () {
    return 15;
};

// height of the description block (including horizontal rule)
Window_Settings_Window.prototype.titleBlockHeight = function () {
    return 126;
};

Window_Settings_Window.prototype.fittingHeight = function (numLines) {
    return Window_Base.prototype.fittingHeightTitleBlock.call(this, numLines);
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Settings_Window.prototype.makeCommandList = function () {
    this.addCommand('Window Scale', 'windowScale', Window_Settings.COMMAND_TYPE_SCALE, !ConfigManager.fullscreen);
    this.addCommand('Fullscreen', 'fullscreen', Window_Settings.COMMAND_TYPE_BOOL_ONOFF);
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_Settings_Window.prototype.select = function (index) {
    Window_Settings.prototype.select.call(this, index);
    this.refresh();
};

Window_Settings_Window.prototype.cursorRight = function () {
    let index = this.index();
    if (this.isCommandEnabled(index)) {
        Window_Settings.prototype.cursorRight.call(this);
    }
};

Window_Settings_Window.prototype.cursorLeft = function () {
    let index = this.index();
    if (this.isCommandEnabled(index)) {
        Window_Settings.prototype.cursorLeft.call(this);
    }
};

Window_Settings_Window.prototype.changeValue = function (symbol, value) {
    let lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
        this.setConfigValue(symbol, value);
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Settings_Window.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let textWidth = this.contentsWidth() - this.textPadding() - (this.extraPadding()*2);
    if (!this.isCommandEnabled(index)) this.changeTextColor(this.disabledColor());
    this.drawText(this.commandName(index), rect.x, rect.y);
    this.drawText(this.statusText(index), rect.x, rect.y, textWidth, 'right');
    this.resetTextColor();
};

Window_Settings_Window.prototype.drawDescription = function () {
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

Window_Settings_Window.prototype.itemRect = function (index) {
    let rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.x += this.extraPadding();
    rect.y += this.extraPadding();
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Settings_Window.prototype.refresh = function () {
    Window_Settings.prototype.refresh.call(this);
    this.drawDescription();
};
