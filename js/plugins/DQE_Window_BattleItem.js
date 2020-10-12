//=============================================================================
// Dragon Quest Engine - Window Battle Item
// DQE_Window_BattleItem.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window that displays skills to use in battle - V0.1
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
Imported.DQEng_Window_BattleItem = true;

var DQEng = DQEng || {};
DQEng.Window_BattleItem = DQEng.Window_BattleItem || {};

//-----------------------------------------------------------------------------
// Window_BattleItem
//-----------------------------------------------------------------------------

function Window_BattleItem() {
    this.initialize.apply(this, arguments);
}

Window_BattleItem.prototype = Object.create(Window_Pagination.prototype);
Window_BattleItem.prototype.constructor = Window_BattleItem;

Window_BattleItem.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._data = [];
    this.hide();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_BattleItem.prototype.standardPadding = function () {
    return 24;
};

Window_BattleItem.prototype.extraPadding = function () {
    return 0;
};

Window_BattleItem.prototype.lineGap = function () {
    return 15;
};

Window_BattleItem.prototype.pageBlockHeight = function () {
    return 0;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_BattleItem.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};

Window_BattleItem.prototype.setHelpWindowItem = function (item, actor) {
    if (this._helpWindow) {
        this._helpWindow.setItem(item, actor);
    }
};

Window_BattleItem.prototype.item = function () {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_BattleItem.prototype.makeItemList = function () {
    if (this._actor) {
        this._data = this._actor.items();
    } else {
        this._data = [];
    }
};

Window_BattleItem.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_BattleItem.prototype.drawPageBlock = function () {
    
};

Window_BattleItem.prototype.drawItem = function (index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRectForText(index);
        this.resetTextColor();
        this.drawText(item.name, rect.x, rect.y, rect.width);
    }
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_BattleItem.prototype.cursorDown = function () {
    Window_Pagination.prototype.cursorDown.call(this);
    this.refresh();
};

Window_BattleItem.prototype.cursorUp = function () {
    Window_Pagination.prototype.cursorUp.call(this);
    this.refresh();
};

//////////////////////////////
// Functions - updates to window
//////////////////////////////

Window_BattleItem.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.item(), this._actor);
};

Window_BattleItem.prototype.show = function () {
    this.showHelpWindow();
    this.select(0);
    Window_Pagination.prototype.show.call(this);
};

Window_BattleItem.prototype.hide = function () {
    this.hideHelpWindow();
    Window_Pagination.prototype.hide.call(this);
};

Window_BattleItem.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
    Window_Pagination.prototype.refresh.call(this);
    this.drawAllItems();
};
