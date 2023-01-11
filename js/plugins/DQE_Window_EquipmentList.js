//=============================================================================
// Dragon Quest Engine - Window Equipment List
// DQE_Window_EquipmentList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying equipments - V0.1
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
Imported.DQEng_Window_EquipmentList = true;

var DQEng = DQEng || {};
DQEng.Window_EquipmentList = DQEng.Window_EquipmentList || {};

//-----------------------------------------------------------------------------
// Window_EquipmentList
//-----------------------------------------------------------------------------

function Window_EquipmentList() {
    this.initialize.apply(this, arguments);
}

Window_EquipmentList.prototype = Object.create(Window_ItemListBase.prototype);
Window_EquipmentList.prototype.constructor = Window_EquipmentList;

Window_EquipmentList.prototype.initialize = function (x, y, width, height, sortItems = false) {
    Window_ItemListBase.prototype.initialize.call(this, x, y, width, height, sortItems);
    this._slot = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_EquipmentList.prototype.titleBlockHeight = function () {
    return 78;
};

Window_EquipmentList.prototype.itemWidth = function () {
    return this._width - (this.standardPadding() + this.extraPadding()) * 2;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_EquipmentList.prototype.maxRows = function () {
    if (this._maxRows != -1) return this._maxRows;
    const pageHeight = this.height - (this.padding * 2) - this.pageBlockHeight() - this.titleBlockHeight();
    return Math.floor(pageHeight / this.itemHeight());
};

Window_EquipmentList.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
    }
};

Window_EquipmentList.prototype.setSlot = function (slot) {
    this._slot = slot;
    return this.refresh();
};

Window_EquipmentList.prototype.data = function () {
    let index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_EquipmentList.prototype.item = function () {
    let index = this.index();
    return this._data && index >= 0 ? this._data[index].item : null;
};

Window_EquipmentList.prototype.makeItemList = function () {
    this._data = [];
    let etype;
    switch (this._actor.equipSlots()[this._slot]) {
        case 1: // right hand
        etype = 1;
            break;
        case 2: // left hand
        etype = 2;
            break;
        case 3: // head
        etype = 3;
            break;
        case 4: // torso
        etype = 4;
            break;
        case 5: // accessory
        etype = 5;
            break;
        case 7: // right & left hand
        this.getData(1);
        etype = 2;
            break;
    }
    if (etype) this.getData(etype);
    // sort items
    if (this._data.length > 0 && this._sortItems) Data_Items.sortEquipmentListItems(this._data);
};

Window_EquipmentList.prototype.getData = function (etype) {
    // actor items
    $gameParty.members().forEach((actor, actorIndex) => {
        let includeEquips = this._category !== actorIndex; // if equipping for this actor, ignore their equipped items
        let equipmentInfo = actor.itemsEquipmentExtraInfo(etype, includeEquips);
        actor.equipmentByType(etype, includeEquips).forEach((equipment, equipmentIndex) => {
            if (this._actor.canEquip(equipment)) {
                let item = {
                    item: equipment,
                    heldBy: actorIndex,
                    equipped: includeEquips ? equipmentInfo[equipmentIndex].equipped : false,
                    index: equipmentInfo[equipmentIndex].index
                };
                this._data.push(item);
            }
        });
    });
    // bag items
    $gameParty.equipItems().filter(function (equipment) {
        return equipment.etypeId === etype && this._actor.canEquip(equipment);
    }, this).forEach((equipment) => {
        for (let i = 0; i < $gameParty.numItems(equipment); i++) {
            let item = {
                item: equipment,
                heldBy: -1,
                equipped: false,
                index: 0
            };
            this._data.push(item);
        }
    });
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_EquipmentList.prototype.drawTitle = function () {
    let actorName = this._actor.name();
    let actorLv = this._actor.level;
    let text = `${actorName} Lv.${actorLv}`;

    this.drawText(text, this.extraPadding(), this.extraPadding(), this.itemWidth(), 'center');
};

Window_EquipmentList.prototype.drawSlot = function () {
    let slotName = $dataSystem.equipTypes[this._slot+1];
    let textWidth = this.contents.measureTextWidth(slotName);
    let x = this.extraPadding() + this.textPadding() + 24;
    let y = this.extraPadding() + this.itemHeight();

    this.drawHorzLine(0, y + 9, x - 3);
    this.changeTextColor(this.deathColor());
    this.drawText(slotName, x, y, textWidth);
    this.resetTextColor();
    let lineX = x + textWidth;
    this.drawHorzLine(lineX, y + 9);
};

Window_EquipmentList.prototype.drawItem = function (index) {
    var item = this._data[index] ? this._data[index].item : null;
    if (item) {
        var rect = this.itemRectForText(index);
        if (this._data[index].equipped) {
            this.changeTextColor(this.deathColor());
            this.drawText('E', rect.x, rect.y, this.itemWidth() - this.extraPadding(), 'right');
        }
        this.drawText(item.name, rect.x, rect.y, 432);
        this.resetTextColor();
    }
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_EquipmentList.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.data());
};

Window_EquipmentList.prototype.setHelpWindowItem = function (data) {
    if (data) {
        this._helpWindow[0].setItem(data.item); // equipment description window
        this._helpWindow[1].setItem(data.equipped, data.heldBy); // equipment location window
        this._helpWindow[2].setItem(data.item, false, this._slot); // equipment stats window
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_EquipmentList.prototype.refresh = function () {
    if (this._slot >= 0) {
        this.makeItemList();
        this.createContents();
        Window_Pagination.prototype.refresh.call(this);
        this.drawTitle();
        this.drawSlot();
        this.drawAllItems();
    }
    return this._data.length;
};
