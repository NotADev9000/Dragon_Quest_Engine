//=============================================================================
// Dragon Quest Engine - Window Simple Equipment List
// DQE_Window_SimpleEquipmentList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying equipments but without selection - V0.1
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
Imported.DQEng_Window_SimpleEquipmentList = true;

var DQEng = DQEng || {};
DQEng.Window_SimpleEquipmentList = DQEng.Window_SimpleEquipmentList || {};

//-----------------------------------------------------------------------------
// Window_SimpleEquipmentList
//-----------------------------------------------------------------------------

function Window_SimpleEquipmentList() {
    this.initialize.apply(this, arguments);
}

Window_SimpleEquipmentList.prototype = Object.create(Window_Status.prototype);
Window_SimpleEquipmentList.prototype.constructor = Window_SimpleEquipmentList;

Window_SimpleEquipmentList.prototype.initialize = function (x, y, width) {
    Window_Status.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SimpleEquipmentList.prototype.drawEquipment = function () {
    this._actor.equips().forEach((item, index) => {
        let text = item ? item.name : '-';
        this.drawText(text, this.extraPadding(), this.extraPadding() + ((index)*36), 0);
    });
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SimpleEquipmentList.prototype.refresh = function () {
    if (this._actor) {
        this.contents.clear();
        this.drawEquipment();
    }
};
