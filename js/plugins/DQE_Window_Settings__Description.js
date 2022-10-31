//=============================================================================
// Dragon Quest Engine - Window Settings - Window
// DQE_Window_Settings__Description.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc An extension of the settings window that includes a description for each item - V0.1
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
Imported.DQEng_Window_Settings__Description = true;

var DQEng = DQEng || {};
DQEng.Window_Settings__Description = DQEng.Window_Settings__Description || {};

//-----------------------------------------------------------------------------
// Window_Settings__Description
//-----------------------------------------------------------------------------

function Window_Settings__Description() {
    this.initialize.apply(this, arguments);
}

Window_Settings__Description.prototype = Object.create(Window_Settings.prototype);
Window_Settings__Description.prototype.constructor = Window_Settings__Description;

Window_Settings__Description.prototype.initialize = function (x, y, width) {
    this.makeDescriptions();
    Window_Settings.prototype.initialize.call(this, x, y, width);
    this._dividerStartY = this.dividerStartY();
    this._descriptionStartY = this.descriptionStartY();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Settings__Description.prototype.standardPadding = function () {
    return 9;
};

Window_Settings__Description.prototype.extraPadding = function () {
    return 15;
};

Window_Settings__Description.prototype.extraBlockHeight = function () {
    return 126;
};

/**
 * starting y co-ord of the divider
 */
Window_Settings__Description.prototype.dividerStartY = function () {
    return this.contentsHeight() - this.extraBlockHeight();
};

/**
 * starting y co-ord of the description
 */
Window_Settings__Description.prototype.descriptionStartY = function () {
    return this.dividerStartY() + this.extraPadding() + 3;
};

Window_Settings__Description.prototype.fittingHeight = function (numLines) {
    return Window_Base.prototype.fittingHeightExtraBlock.call(this, numLines);
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Settings__Description.prototype.makeDescriptions = function () {
    this._descriptions = [];
    console.warn(`function: makeDescriptions hasn't been overridden!`);
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_Settings__Description.prototype.select = function (index) {
    Window_Settings.prototype.select.call(this, index);
    this.refresh();
};

Window_Settings__Description.prototype.valueChanged = function () {
    this.refresh();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Settings__Description.prototype.drawDivider = function () {
    this.drawHorzLine(0, this._dividerStartY);
};

Window_Settings__Description.prototype.drawDescription = function () {
    // draw first description if window is deselected
    const descIndex = this.index() > 0 ? this.index() : 0;
    this.drawTextEx(this._descriptions[descIndex], this.extraPadding(), this._descriptionStartY);
};

Window_Settings__Description.prototype.itemRect = function (index) {
    let rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.x += this.extraPadding();
    rect.y += this.extraPadding();
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Settings__Description.prototype.refresh = function () {
    Window_Settings.prototype.refresh.call(this);
    this.drawDivider();
    this.drawDescription();
};
