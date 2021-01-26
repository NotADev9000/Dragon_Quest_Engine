//=============================================================================
// Dragon Quest Engine - Window Battle Equipment
// DQE_Window_BattleEquipment.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window that displays equipment to equip in battle - V0.1
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
Imported.DQEng_Window_BattleEquipment = true;

var DQEng = DQEng || {};
DQEng.Window_BattleEquipment = DQEng.Window_BattleEquipment || {};

//-----------------------------------------------------------------------------
// Window_BattleEquipment
//-----------------------------------------------------------------------------

function Window_BattleEquipment() {
    this.initialize.apply(this, arguments);
}

Window_BattleEquipment.prototype = Object.create(Window_BattleItem.prototype);
Window_BattleEquipment.prototype.constructor = Window_BattleEquipment;

Window_BattleEquipment.prototype.initialize = function (x, y, width, height) {
    Window_BattleItem.prototype.initialize.call(this, x, y, width, height);
    this._numActorEquips = 0;
    this._trueIndexes = []; // the index of the equipment piece when in the actor's inventory NOT when in this window's data
    this._slotData = []; // a list of which equipped piece is in which slot
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_BattleEquipment.prototype.makeItemList = function () {
    this._trueIndexes = [];
    if (this._actor) {
        this._numActorEquips = this._actor.numEquips();
        this._data = this._actor.items().filter(function (item, index) {
            if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                this._trueIndexes.push(index);
                return true;
            }
            return false;
        }, this);
        this._slotData = this._actor.getSlotData();
    } else {
        this._numActorEquips = 0;
        this._data = [];
    }
};

Window_BattleEquipment.prototype.isEquippedItem = function (index) {
    return index < this._numActorEquips;
};

Window_BattleEquipment.prototype.slotIndex = function () {
    return this._slotData[this.index()];
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_BattleEquipment.prototype.setHelpWindowItem = function (item) {
    this._helpWindow.forEach(helpWindow => {
        helpWindow.setItem(item, this.isEquippedItem(this.index()), item.etypeId - 1);
    });
};

//////////////////////////////
// Functions - draw
//////////////////////////////

Window_BattleEquipment.prototype.drawItem = function (index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRectForText(index);
        if (this.isEquippedItem(index)) {
            this.changeTextColor(this.deathColor());
            this.drawText('E', rect.x, rect.y, rect.width, 'right');
        }
        this.drawText(item.name, rect.x, rect.y, rect.width);
        this.resetTextColor();
    }
};
