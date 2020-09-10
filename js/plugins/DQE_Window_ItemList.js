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
        console.log(this._data);
    }
};

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

Window_ItemList.prototype.makeItemList = function () {
    this._data = $gameParty.allItems().filter(function (item) {
        return this.includes(item);
    }, this);
};

Window_ItemList.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
};