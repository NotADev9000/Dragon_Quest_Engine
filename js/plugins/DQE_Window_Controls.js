//=============================================================================
// Dragon Quest Engine - Window Controls
// DQE_Window_Controls.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for changing the controls for game actions - V0.1
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
Imported.DQEng_Window_Controls = true;

var DQEng = DQEng || {};
DQEng.Window_Controls = DQEng.Window_Controls || {};

//-----------------------------------------------------------------------------
// Window_Controls
//-----------------------------------------------------------------------------

function Window_Controls() {
    this.initialize.apply(this, arguments);
}

Window_Controls.prototype = Object.create(Window_Selectable.prototype);
Window_Controls.prototype.constructor = Window_Controls;

Window_Controls.prototype.initialize = function (x, y, width, mode) {
    let height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._mode = mode; // 0 = keyboard, 1 = gamepad
    this.refresh();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Controls.prototype.standardPadding = function () {
    return 9;
};

Window_Controls.prototype.extraPadding = function () {
    return 15;
};

Window_Controls.prototype.lineGap = function () {
    return 33;
};

Window_Controls.prototype.spacing = function () {
    return 144;
};

Window_Controls.prototype.itemWidth = function () {
    return 519;
};

Window_Controls.prototype.maxCols = function () {
    return 2;
};

Window_Controls.prototype.windowHeight = function () {
    return this.fittingHeight(this.maxRows());
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Controls.prototype.maxItems = function () {
    return Input.handlers.length;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Controls.prototype.drawGrids = function () {
    let lineThickness = 3;
    let ih = this.itemHeight();

    let x = (this.width/2) - lineThickness;
    this.drawVertLine(x, 0);

    let y = ih - lineThickness;
    let numLines = this.maxRows() - 1;
    for (let i = 0; i < numLines; i++) {
        this.drawHorzLine(0, y);
        y += ih;
    }
};

Window_Controls.prototype.drawItem = function (index, drawIcons = true) {
    let rect = this.itemRectForText(index);
    let iconX = rect.x + (rect.width - Window_Base._iconWidth);
    let handle = Input.handlers[index];
    let text = handle[1];
    this.drawText(text, rect.x, rect.y);

    if (drawIcons) {
        let icon = this._mode ? this.getGamepadIcon(handle[2]) : this.getKeyIcon(handle[3]);
        icon = `\\i[${icon}]`;
        this.drawTextEx(icon, iconX, rect.y);
    }
};

/**
 * adjusts rect y and height to account for the icon
 * 
 * @param {number} index of item to clear
 */
Window_Controls.prototype.clearItem = function (index) {
    let rect = this.itemRect(index);
    rect.y -= this.calcIconCentre();
    rect.height = Window_Base._iconHeight;
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

Window_Controls.prototype.clearIcon = function (index) {
    this.clearItem(index);
    this.drawItem(index, false);
};

Window_Controls.prototype.itemRect = function (index) {
    let ep = this.extraPadding();
    let iw = this.itemWidth();
    let ih = this.itemHeight();
    let spc = this.spacing();
    let maxCols = this.maxCols();
    let bottomRow = index === this.bottomRow();
    let rect = new Rectangle();
    rect.width = iw;
    rect.height = bottomRow ? this.lineHeight() : ih;
    rect.x = ep + ((index % maxCols) * (iw + spc));
    rect.y = ep + (Math.floor(index / maxCols) * ih);
    return rect;
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_Controls.prototype.updateHelp = function () {
    const index = this.index();
    let text = '';
    switch (index) {
        case 1:
            text = 'Cancel/Go back/Close menu';
            break;
        case 2:
            text = 'Move cursor up/Move character up';
            break;
        case 3:
            text = 'Move cursor down/Move character down';
            break;
        case 4:
            text = 'Move cursor left/Move character left';
            break;
        case 5:
            text = 'Move cursor right/Move character right';
            break;
        case 6:
            text = 'Open the main menu';
            break;
        case 7:
            text = 'Open various help menus';
            break;
        case 8:
            text = 'Sort items by category';
            break;
        case 9:
            text = 'Filter items out of player inventory and into the bag';
            break;
        case 10:
            text = 'Go to previous category in menu';
            break;
        case 11:
            text = 'Go to next category in menu';
            break;
        case 12:
            text = 'Go to previous party member in menu';
            break;
        case 13:
            text = 'Go to next party member in menu';
            break;
        default:
            text = 'Confirm/Talk'
            break;
    }
    this.setHelpWindowItem(text);
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Controls.prototype.refresh = function () {
    if (this.contents) {
        this.contents.clear();
        this.drawGrids();
        this.drawAllItems();
    }
};
