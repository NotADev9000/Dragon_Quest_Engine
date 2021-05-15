//=============================================================================
// Dragon Quest Engine - Window Sort
// DQE_Window_Sort.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying how items are sorted in the bag - V0.1
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
Imported.DQEng_Window_Sort = true;

var DQEng = DQEng || {};
DQEng.Window_Sort = DQEng.Window_Sort || {};

//-----------------------------------------------------------------------------
// Window_Sort
//-----------------------------------------------------------------------------

function Window_Sort() {
    this.initialize.apply(this, arguments);
}

Window_Sort.prototype = Object.create(Window_Base.prototype);
Window_Sort.prototype.constructor = Window_Sort;

Window_Sort.prototype.initialize = function (x, y, width) {
    const height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Sort.prototype.windowHeight = function () {
    return 123;
};

Window_Sort.prototype.standardPadding = function () {
    return 9;
};

Window_Sort.prototype.extraPadding = function () {
    return 15;
};

Window_Sort.prototype.textWidth = function () {
    return this.width - (this.standardPadding() + this.extraPadding()) * 2;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Sort.prototype.drawTitle = function () {
    const ep = this.extraPadding();
    let icon = this.getHandlerIcon('sort');
    icon = `\\i[${icon}]`;
    const text = `Sort`;
    this.drawTextEx(icon, ep, ep);
    this.drawText(text, ep, ep, this.textWidth(), 'center');
};

Window_Sort.prototype.drawType = function () {
    const ep = this.extraPadding();
    const y = 69;
    let text = 'Order Obtained';
    switch ($gameParty.sortMethod()) {
        case Game_Party.SORT_BY_ALPHABETICAL:
            text = 'Alphabetical';
            break;
        case Game_Party.SORT_BY_TYPE:
            text = 'Type';
            break;
    }
    this.drawText(text, ep, y, this.textWidth(), 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Sort.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitle();
    this.drawHorzLine(0, 51);
    this.drawType();
};
