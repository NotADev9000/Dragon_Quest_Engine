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

//////////////////////////////
// Functions - actor setup
//////////////////////////////

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

//////////////////////////////
// Functions - item setup
//////////////////////////////

/**
 * Add equipment to held items
 * 
 * TODO: Read from Actor notetags to retrieve default items
 */
Game_Actor.prototype.initItems = function () {
    return this.initCarriedEquips();
};

Game_Actor.prototype.initCarriedEquips = function () {
    return this._equips.filter(equip => {
        return equip._itemId;
    });
};

/**
 * removes equipped items from item list but NOT
 * from the equips list
 */
Game_Actor.prototype.resetCarriedEquips = function () {
    this._items.splice(0, this.numEquips());
};

//////////////////////////////
// Functions - item queries
//////////////////////////////

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
 * How many items can actor fit in inventory
 */
Game_Actor.prototype.spaceLeft = function () {
    return this.maxItems() - this.numItems();
}

Game_Actor.prototype.isSlotEquipped = function (slotId) {
    return this.equips()[slotId];
}

/**
 * Is the item at given index an equipped item?
 * 
 * @param {number} index of held item 
 */
Game_Actor.prototype.indexIsEquip = function (index) {
    return index < this.numEquips();
};

//////////////////////////////
// Functions - item movement
//////////////////////////////

Game_Actor.prototype.changeEquip = function (slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
        (!item || this.equipSlots()[slotId] === item.etypeId)) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};

/**
 * Equips an item from actors' own inventory
 */
Game_Actor.prototype.equipItemFromInv = function (index) {
    var item = this.item(index);
    var slotId = item.etypeId - 1;
    var replace = new Game_Item(this.equips()[slotId]); // item in this position is being unequipped

    if (replace._itemId) {
        // move the previously equipped item into inventory
        this._items[index] = replace;
    } else {
        // remove item that has just been equipped
        this.removeItemAtIndex(index);
    }
    this.resetCarriedEquips();
    this._equips[slotId].setObject(item);
    this._items = this.initCarriedEquips().concat(this._items);
}

/**
 * Unequips an item.
 * When keeping the item, it's removed from
 * inventory and re-added.
 * 
 * @param {number} index of item to unequip
 * @param {boolean} keep should the item be kept in the actors' inventory?
 */
Game_Actor.prototype.unequipItem = function (index, keep = true) {
    var item = this.item(index);

    this.removeItemAtIndex(index);
    if (keep) {
        this.giveItems(item, 1);
    }
}

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

Game_Actor.prototype.gainItem = function (item, index) {
    if (index >= 0) {
        this._items.splice(index, 0, new Game_Item(item));
    } else {
        this._items.push(new Game_Item(item));
    }
};

/**
 * Adds items to actor inventory if there is room
 * Returns the amount of items that were successfuly
 * added to the actor inventory
 * 
 * @param {dataItem} item the item to add to the inventory
 * @param {number} amount the amount of items to add
 * @param {number} index to insert the items at
 */
Game_Actor.prototype.giveItems = function (item, amount, index) {
    for (let i = 0; i < amount; i++) {
        if (this.hasMaxItems()) return i;
        this.gainItem(item, index);
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

/**
 * Trades an item with the bag
 * 
 * @param {number} index of item being swapped with bag
 * @param {dataItem} item that is being given to actor
 */
Game_Actor.prototype.tradeItemWithBag = function (index, item) {
    var isEquipped = this.indexIsEquip(index);
    var removedItem = this.item(index);

    this.removeItemAtIndex(index);
    if (isEquipped) {
        $gameParty.giveItemToActor(item, this);
    } else {
        $gameParty.giveItemToActor(item, this, index);
    }
    $gameParty.gainItem(removedItem, 1);
}

/**
 * Trades an item with another actor
 * 
 * @param {number} index of item being swapped with other actor
 * @param {number} actorIndex of item being given to this actor
 * @param {Game_Actor} actor to swap an item with
 */
Game_Actor.prototype.tradeItemWithActor = function (index, actorIndex, actor) {
    var newPos = this.indexIsEquip(index) ? null : index;
    var item = this.item(index);
    var actorNewPos = actor.indexIsEquip(actorIndex) ? null : actorIndex;
    var actorItem = actor.item(actorIndex);

    this.removeItemAtIndex(index);
    actor.removeItemAtIndex(actorIndex);
    this.giveItems(actorItem, 1, newPos);
    actor.giveItems(item, 1, actorNewPos);
}

//////////////////////////////
// Functions - messages
//////////////////////////////

Game_Actor.prototype.giveItemToBagMessage = function (index) {
    return `${this._name} placed the ${this.item(index).name} in the bag.`;
}

Game_Actor.prototype.giveItemToActorMessage = function (index, actor) {
    return `${this._name} handed the ${this.item(index).name} to ${actor._name}.`;
}

Game_Actor.prototype.tradeItemWithBagMessage = function (index, item) {
    return `${this._name} swapped the ${this.item(index).name}\nwith the ${item.name} from the bag.`;
}

Game_Actor.prototype.tradeItemWithActorMessage = function (index, actorIndex, actor) {
    return `${this._name} handed the ${this.item(index).name} to ${actor._name}\nand received the ${actor.item(actorIndex).name}.`;
}

Game_Actor.prototype.equipItemMessage = function (index) {
    return `${this._name} equipped the ${this.item(index).name}.`;
}

Game_Actor.prototype.unequipItemMessage = function (index) {
    return `${this._name} unequipped the ${this.item(index).name}.`;
}

Game_Actor.prototype.cantEquipMessage = function (index) {
    return `${this._name} can't equip the ${this.item(index).name}.`;
}

Game_Actor.prototype.inventoryFullMessage = function () {
    return `${this._name} has a full inventory.\nSelect an item to swap.`;
}
