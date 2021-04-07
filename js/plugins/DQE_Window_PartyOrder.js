//=============================================================================
// Dragon Quest Engine - Choosing party order
// DQE_Window_PartyOrder.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The command list window with party members - V0.1
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
Imported.DQEng_Window_PartyOrder = true;

var DQEng = DQEng || {};
DQEng.Window_PartyOrder = DQEng.Window_PartyOrder || {};

//-----------------------------------------------------------------------------
// Window_PartyOrder
//-----------------------------------------------------------------------------

function Window_PartyOrder() {
    this.initialize.apply(this, arguments);
}

Window_PartyOrder.prototype = Object.create(Window_PartySelection.prototype);
Window_PartyOrder.prototype.constructor = Window_PartyOrder;

Window_PartyOrder.prototype.initialize = function (x, y, windowWidth, commandType, excludeActors) {
    Window_PartySelection.prototype.initialize.call(this, x, y, windowWidth, commandType, excludeActors);
};

Window_PartyOrder.prototype.setListWindow = function (window) {
    this._listWindow = window;
};

Window_PartyOrder.prototype.updateListWindow = function (index, addData = true) {
    if (addData) {
        this._excludeActors.push(index);
        this._listWindow.addData(index);
    } else {
        this._excludeActors.splice(this._excludeActors.indexOf(index), 1);
        this._listWindow.removeData();
    }
    this.refresh(true);
};

Window_PartyOrder.prototype.clearListWindow = function () {
    this._excludeActors = [];
    this._listWindow.clearData();
    this.refresh();
};

Window_PartyOrder.prototype.show = function () {
    Window_PartySelection.prototype.show.call(this);
    this._listWindow?.show();
    this._helpWindow[0]?.show();
};

Window_PartyOrder.prototype.hide = function () {
    Window_PartySelection.prototype.hide.call(this);
    this._listWindow?.hide();
    this._helpWindow[0]?.hide();
};

Window_PartyOrder.prototype.refresh = function (checkSelect = false) {
    Window_PartySelection.prototype.refresh.call(this);
    if (checkSelect && this.index() >= this.maxItems()-1 || this.index() < 0) {
        this.select(this.maxItems()-1);
    }
};

Window_PartyOrder.prototype.updateHelp = function () {
    const symbol = this.currentSymbol();
    this._helpWindow.forEach(helpWindow => {
        helpWindow.setCategory(symbol);
    });
};
