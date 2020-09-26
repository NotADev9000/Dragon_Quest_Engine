//=============================================================================
// Dragon Quest Engine - Game Actor
// DQE_Game_Actor.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for an actor - V0.1
*
*
* @help
* This is where the party members' held items logic is stored
* 
* Items are stored the same as equipment, meaning they are stored
* as Game_Item objects.
*
* Actor's equipment is always stored at the front of the item list.
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_Actor = true;

var DQEng = DQEng || {};
DQEng.Game_Actor = DQEng.Game_Actor || {};

//-----------------------------------------------------------------------------
// Game_Actor
//-----------------------------------------------------------------------------

/**
 * Initialize items array
 */
DQEng.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    DQEng.Game_Actor.initMembers.call(this);
    this._items = [];
}

/**
 * Added items to setup
 */
DQEng.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    DQEng.Game_Actor.setup.call(this, actorId);
    this._items = this.initItems();
};

/**
 * Add equipment to held items
 * 
 * TODO: Read from Actor notetags to retrieve default items
 */
Game_Actor.prototype.initItems = function () {
    return this._equips.filter(equip => {
        return equip._itemId;
    });
};

/**
 * Returns held items as an array of data items
 */
Game_Actor.prototype.items = function () {
    return this._items.map(function (item) {
        return item.object();
    });
};

/**
 * Returns item at index as a data item
 * 
 * @param {number} index of item in actor inventory
 */
Game_Actor.prototype.item = function (index) {
    return this._items[index].object();
};

Game_Actor.prototype.maxItems = function () {
    return 12;
};

Game_Actor.prototype.numEquips = function () {
    return this._equips.filter(equip => {
        return equip._itemId;
    }).length;
};

Game_Actor.prototype.numItems = function () {
    return this._items.length;
};

Game_Actor.prototype.hasMaxItems = function () {
    return this.numItems() >= this.maxItems();
};

Game_Actor.prototype.hasItem = function (item) {
    return this.items().contains(item);
};

/**
 * Is the item at given index an equipped item?
 * 
 * @param {number} index of held item 
 */
Game_Actor.prototype.indexIsEquip = function (index) {
    return index < this.numEquips();
};

Game_Actor.prototype.gainItem = function (item) {
    this._items.push(new Game_Item(item));
};

/**
 * Removes item at given index
 * Unequips the item if equipped
 * 
 * @param {number} index of item to remove
 */
Game_Actor.prototype.removeItemAtIndex = function (index) {
    if (this.indexIsEquip(index)) {
        this.discardEquip(this.item(index));
    }
    this._items.splice(index, 1);
};

/**
 * Adds items to actor inventory if there is room
 * Returns the amount of items that were successfuly
 * added to the actor inventory
 * 
 * @param {dataItem} item the item to add to the inventory
 * @param {number} amount the amount of items to add
 */
Game_Actor.prototype.giveItems = function (item, amount) {
    for (let i = 0; i < amount; i++) {
        if (this.hasMaxItems()) return i;
        this.gainItem(item);
        this.refresh();
    }
    return amount;
}

Game_Actor.prototype.giveItemToBag = function (index) {
    $gameParty.gainItem(this.item(index), 1);
    this.removeItemAtIndex(index);
}

Game_Actor.prototype.giveItemToActor = function (index, actor) {
    actor.giveItems(this.item(index), 1);
    this.removeItemAtIndex(index);
}

Game_Actor.prototype.giveItemToBagMessage = function (index) {
    return `${this._name} placed the ${this.item(index).name} in the bag.`;
}

Game_Actor.prototype.giveItemToActorMessage = function (index, actor) {
    return `${this._name} handed the ${this.item(index).name} to ${actor._name}.`;
}
