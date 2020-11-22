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

Window_ItemList.prototype = Object.create(Window_ItemListBase.prototype);

Window_ItemList.prototype.initialize = function (x, y, width, height) {
    Window_ItemListBase.prototype.initialize.call(this, x, y, width, height);
    this._numActorEquips = 0; // How many items actor has equipped
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
        case 'Bag':
            return true;
        default:
            return false;
    }
};

/**
 * Creates the item list to be displayed in the window
 * Retrieves items from party or actor inventory
 * Retrieves equipment from actor equips
 */
Window_ItemList.prototype.makeItemList = function () {
    if (this.isCategoryActor()) {
        var actor = $gameParty.members()[this._category];
        this._numActorEquips = actor.numEquips();
        this._data = actor.items();
    } else {
        this._data = $gameParty.allItems().filter(function (item) {
            return this.includes(item);
        }, this);
    }
};

/**
 * returns actors' equips while ignoring empty slots
 * 
 * @param {Game_Actor} actor 
 */
Window_ItemList.prototype.getActorEquips = function (actor) {
    var equips = [];
    actor.equips().forEach(equipment => {
        if (equipment) { 
            equips.push(equipment);
        }
    });
    return equips;
};

Window_ItemList.prototype.isEquippedItem = function (index) {
    return index < this._numActorEquips;
};

/**
 * Draws item to window
 * Number of items is only drawn when viewing party inventory
 */
Window_ItemList.prototype.drawItem = function (index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRectForText(index);
        if (!this.isCategoryActor()) {
            this.drawText($gameParty.numItems(item), rect.x, rect.y, rect.width, 'right');
        } else if(this.isEquippedItem(index)) {
            this.changeTextColor(this.deathColor());
            this.drawText('E', rect.x, rect.y, rect.width, 'right');
        }
        this.drawText(item.name, rect.x, rect.y, 432);
        this.resetTextColor();
    }
};
