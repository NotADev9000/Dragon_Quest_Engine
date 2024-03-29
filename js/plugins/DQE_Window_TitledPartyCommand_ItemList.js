//=============================================================================
// Dragon Quest Engine - Titled Party Command Item List
// DQE_Window_TitledPartyCommand_ItemList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Titled Party Command that can control the associated item list - V0.1
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
Imported.DQEng_Window_TitledPartyCommand_ItemList = true;

var DQEng = DQEng || {};
DQEng.Window_TitledPartyCommand_ItemList = DQEng.Window_TitledPartyCommand_ItemList || {};

//-----------------------------------------------------------------------------
// Window_TitledPartyCommand_ItemList
//-----------------------------------------------------------------------------

function Window_TitledPartyCommand_ItemList() {
    this.initialize.apply(this, arguments);
}

Window_TitledPartyCommand_ItemList.prototype = Object.create(Window_TitledPartyCommand.prototype);
Window_TitledPartyCommand_ItemList.prototype.constructor = Window_TitledPartyCommand_ItemList;

Window_TitledPartyCommand_ItemList.prototype.initialize = function (x, y, windowWidth, menuTitle, commands, selectCallback, excludeActors, commandType) {
    this._checkListIsEmpty = false;
    Window_TitledPartyCommand.prototype.initialize.call(this, x, y, windowWidth, menuTitle, commands, selectCallback, excludeActors, commandType);
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_TitledPartyCommand_ItemList.prototype.checkListIsEmpty = function () {
    return this._checkListIsEmpty;
};

Window_TitledPartyCommand_ItemList.prototype.setCheckListIsEmpty = function (check) {
    this._checkListIsEmpty = check;
};

Window_TitledPartyCommand_ItemList.prototype.isCurrentItemEnabled = function () {
    return this._checkListIsEmpty ? this._helpWindow[0]?._data.length : true;
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_TitledPartyCommand_ItemList.prototype.cursorRight = function () {
    this.changeItemListPage();
};

Window_TitledPartyCommand_ItemList.prototype.cursorLeft = function () {
    this.changeItemListPage(-1);
};

Window_TitledPartyCommand_ItemList.prototype.changeItemListPage = function (next = 1) {
    const itemListWindow = this._helpWindow[0];
    if (itemListWindow) {
        itemListWindow.gotoNextPage(next);
        itemListWindow.deselect();
    }
};
