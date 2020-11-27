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

Window_PartyOrder.prototype.setAssociatedWindow = function (window) {
    this._associatedWindow = window;
};

Window_PartyOrder.prototype.updateAssociatedWindow = function (index, addData = true) {
    if (addData) {
        this._excludeActors.push(index);
        this._associatedWindow.addData(index);
    } else {
        this._excludeActors.splice(this._excludeActors.indexOf(index), 1);
        this._associatedWindow.removeData();
    }
    this.refresh(true);
};

Window_PartyOrder.prototype.clearAssociatedWindow = function () {
    this._excludeActors = [];
    this._associatedWindow.clearData();
    this.refresh();
};

Window_PartyOrder.prototype.setStatusWindow = function (window) {
    this._statusWindow = window;
};

Window_PartyOrder.prototype.show = function () {
    Window_PartySelection.prototype.show.call(this);
    if (this._associatedWindow) this._associatedWindow.show();
    if (this._statusWindow) this._statusWindow.show();
};

Window_PartyOrder.prototype.hide = function () {
    Window_PartySelection.prototype.hide.call(this);
    if (this._associatedWindow) this._associatedWindow.hide();
    if (this._statusWindow) this._statusWindow.hide();
};

Window_PartyOrder.prototype.refresh = function (checkSelect = false) {
    Window_PartySelection.prototype.refresh.call(this);
    if (checkSelect && this.index() >= this.maxItems()-1 || this.index() < 0) {
        this.select(this.maxItems()-1);
    }
};

Window_PartyOrder.prototype.update = function () {
    Window_PartySelection.prototype.update.call(this);
    if (this._statusWindow) {
        this._statusWindow.setCategory(this.currentSymbol());
    }
};
