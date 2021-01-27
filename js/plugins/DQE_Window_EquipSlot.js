//=============================================================================
// Dragon Quest Engine - Window Equip Slot
// DQE_Window_EquipSlot.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for selecting actor's equipment - V0.1
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
Imported.DQEng_Window_EquipSlot = true;

var DQEng = DQEng || {};
DQEng.Window_EquipSlot = DQEng.Window_EquipSlot || {};

//-----------------------------------------------------------------------------
// Window_EquipSlot
//-----------------------------------------------------------------------------

Window_EquipSlot.prototype.initialize = function (x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = -1; // actor index
    this._actor = null;
    this._data = [];
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_EquipSlot.prototype.standardPadding = function () {
    return 9;
};

Window_EquipSlot.prototype.extraPadding = function () {
    return 15;
};

Window_EquipSlot.prototype.lineGap = function () {
    return 21;
};

Window_EquipSlot.prototype.titleHeight = function () {
    return 36;
};

Window_EquipSlot.prototype.itemWidth = function () {
    return this._width - (this.standardPadding() + this.extraPadding()) * 2;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_EquipSlot.prototype.maxItems = function () {
    return this.slots().length-1;
};

Window_EquipSlot.prototype.slots = function () {
    return $dataSystem.equipTypes;
};

Window_EquipSlot.prototype.slotIndex = function () {
    let index = this.index();
    let data = this._data[index];
    if (data && data.cloned >= 0) {
        return data.cloned;
    } else {
        return index;
    }
};

Window_EquipSlot.prototype.makeDisplayData = function () {
    this._data = Object.assign([], this._actor.equips());
    if (this._data[0] && this._data[0].meta.twoHand) {
        this._data[1] = Object.assign({}, this._data[0]);
        this._data[1].cloned = 0;
    } else if (this._data[1] && this._data[1].meta.twoHand) {
        this._data[0] = Object.assign({}, this._data[1]);
        this._data[0].cloned = 1;
    }
};

Window_EquipSlot.prototype.dataItem = function () {
    return this._actor ? this._data[this.index()] : null;
};

Window_EquipSlot.prototype.orderInInventory = function () {
    let count = 0;
    let order = [];
    this._data.forEach((item, index) => {
        if (!item) {
            order.push(null);
        } else if (item.cloned >= 0) {
            item.cloned > index ? order.push(count) : order.push(count-1);
        } else {
            order.push(count);
            count++;
        }
    });
    return order;
};

Window_EquipSlot.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_EquipSlot.prototype.drawTitle = function () {
    let actorName = this._actor.name();
    let actorLv = this._actor.level;
    let text = `${actorName} Lv.${actorLv}`;

    this.drawText(text, this.extraPadding(), this.extraPadding(), this.itemWidth(), 'center');
};

Window_EquipSlot.prototype.drawSlots = function () {
    let slots = this.slots();
    let x = this.extraPadding() + this.textPadding() + 24;

    for (let i = 0; i < this.maxItems(); i++) {
        let textWidth = this.contents.measureTextWidth(slots[i+1]);
        let y = this.extraPadding() + this.titleHeight();
        y += (this.itemHeight() + this.lineGap()) * 2 * i; // extra spacing between slots for the item to fit into
        this.drawHorzLine(0, y + 9, x - 3);
        this.changeTextColor(this.deathColor());
        this.drawText(slots[i+1], x, y, textWidth);
        this.resetTextColor();
        let lineX = x + textWidth;
        this.drawHorzLine(lineX, y + 9);
    }
};

Window_EquipSlot.prototype.drawAllItems = function () {
    for (var i = 0; i < this.maxItems(); i++) {
        this.drawItem(i);
    }
};

Window_EquipSlot.prototype.drawItem = function (index) {
    var rect = this.itemRectForText(index);
    var equip = this._data[index];
    var text = '';
    if (equip) {
        if (equip.cloned >= 0) this.changeTextColor(this.disabledColor());
        text = equip.name;
    } else {
        this.changeTextColor(this.disabledColor());
        text = '-';
    }
    this.drawText(text, rect.x, rect.y, rect.width);
    this.resetTextColor();
};

//////////////////////////////
// Functions - item positions
//////////////////////////////

Window_EquipSlot.prototype.itemRect = function (index) {
    var rect = new Rectangle();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight() + this.lineGap();
    rect.x = this.extraPadding();
    rect.y = this.extraPadding() + this.titleHeight() + (this.itemHeight() + this.lineGap());
    rect.y += (this.itemHeight() + this.lineGap()) * 2 * index; 
    return rect;
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_EquipSlot.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.dataItem());
};

Window_EquipSlot.prototype.setHelpWindowItem = function (item) {
    this._helpWindow.forEach(helpWindow => {
        helpWindow.setItem(item, true);
    });
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_EquipSlot.prototype.refresh = function () {
    if (this._actor && this.contents) {
        this.contents.clear();
        this.makeDisplayData();
        this.drawTitle();
        this.drawSlots();
        this.drawAllItems();
    }
};
