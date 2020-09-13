//=============================================================================
// Dragon Quest Engine - Window Item List
// DQE_Window_ItemList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying items - V0.1
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
Imported.DQEng_Window_ItemList = true;

var DQEng = DQEng || {};
DQEng.Window_ItemList = DQEng.Window_ItemList || {};

//-----------------------------------------------------------------------------
// Window_ItemList
//-----------------------------------------------------------------------------

function Window_ItemList() {
    this.initialize.apply(this, arguments);
}

Window_ItemList.prototype = Object.create(Window_Pagination.prototype);
Window_ItemList.prototype.constructor = Window_ItemList;

Window_ItemList.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};

Window_ItemList.prototype.lineGap = function () {
    return 15;
};

Window_ItemList.prototype.maxCols = function () {
    return 1;
};

Window_ItemList.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
    }
};

/**
 * returns true if the current category is an Actor
 * Actor categories are stored as integers
 */
Window_ItemList.prototype.isCategoryActor = function () {
    return Number.isInteger(this._category)
};

/**
 * checks if an item is in the selected category
 */
Window_ItemList.prototype.includes = function (item) {
    switch (this._category) {
        case 'Items':
            return DataManager.isItem(item) && item.itypeId === 1;
        case 'Equipment':
            return DataManager.isWeapon(item) || DataManager.isArmor(item);
        case 'Important':
            return DataManager.isItem(item) && item.itypeId === 2;
        default:
            return false;
    }
};

/**
 * Creates the item list to be displayed in the window
 * Retrieves items from party or actor inventory
 */
Window_ItemList.prototype.makeItemList = function () {
    if (this.isCategoryActor()) {
        this._data = $gameParty.members()[this._category].items();
    } else {
        this._data = $gameParty.allItems().filter(function (item) {
            return this.includes(item);
        }, this);
    }
};

/**
 * Draws item to window
 * Number of items is only drawn when viewing party inventory
 */
Window_ItemList.prototype.drawItem = function (index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRectForText(index);
        this.drawText(item.name, rect.x, rect.y, 432);
        if (!this.isCategoryActor()) {
            this.drawText($gameParty.numItems(item), rect.x, rect.y, rect.width, 'right');
        }
    }
};

/**
 * extraPadding is added to properly adjust commands
 */
Window_ItemList.prototype.itemRect = function (index) {
    var rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.x += this.extraPadding();
    rect.y += this.extraPadding();
    rect.width -= this.extraPadding() * 2;
    return rect;
};

Window_ItemList.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
    Window_Pagination.prototype.refresh.call(this);
    this.drawAllItems();
};