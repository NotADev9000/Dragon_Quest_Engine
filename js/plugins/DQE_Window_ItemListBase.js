//=============================================================================
// Dragon Quest Engine - Window Item List Base
// DQE_Window_ItemListBase.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass window for displaying items/skills - V0.1
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
Imported.DQEng_Window_ItemListBase = true;

var DQEng = DQEng || {};
DQEng.Window_ItemListBase = DQEng.Window_ItemListBase || {};

//-----------------------------------------------------------------------------
// Window_ItemListBase
//-----------------------------------------------------------------------------

function Window_ItemListBase() {
    this.initialize.apply(this, arguments);
}

Window_ItemListBase.prototype = Object.create(Window_Pagination.prototype);
Window_ItemListBase.prototype.constructor = Window_ItemListBase;

Window_ItemListBase.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._category = null;
    this._data = [];
};

Window_ItemListBase.prototype.lineGap = function () {
    return 15;
};

Window_ItemListBase.prototype.maxCols = function () {
    return 1;
};

Window_ItemListBase.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
    }
};

/**
 * returns true if the current category is an Actor
 * Actor categories are stored as integers
 */
Window_ItemListBase.prototype.isCategoryActor = function () {
    return Number.isInteger(this._category);
};

Window_ItemListBase.prototype.item = function () {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_ItemListBase.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

Window_ItemListBase.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.item());
};

Window_ItemListBase.prototype.refresh = function (resetLastSelected = true) {
    this.makeItemList();
    this.createContents();
    Window_Pagination.prototype.refresh.call(this, resetLastSelected);
    this.drawAllItems();
};
