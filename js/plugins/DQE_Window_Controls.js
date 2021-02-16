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

Window_Controls.prototype.initialize = function (x, y, width) {
    let height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
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

Window_Controls.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
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

Window_Controls.prototype.drawItem = function (index) {
    let rect = this.itemRectForText(index);
    let iconX = rect.x + (rect.width - Window_Base._iconWidth);
    let handle = Input.handlers[index];
    let text = handle[1];
    let icon = this.getGamepadIcon(handle[2]);
    icon = `\\i[${icon}]`;

    this.drawText(text, rect.x, rect.y);
    this.drawTextEx(icon, iconX, rect.y);
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
// Functions - refresh
//////////////////////////////

Window_Controls.prototype.refresh = function () {
    if (this.contents) {
        this.contents.clear();
        this.drawGrids();
        this.drawAllItems();
    }
};
