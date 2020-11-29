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
};

/**
 * Added items to setup
 */
DQEng.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    DQEng.Game_Actor.setup.call(this, actorId);
    this._items = this.initItems();
    this.releaseUnequippableItems(true);
    this.refresh();
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

Game_Actor.prototype.initEquips = function (equips) {
    var slots = this.equipSlots();
    var maxSlots = slots.length;
    this._equips = [];
    for (var i = 0; i < maxSlots; i++) {
        this._equips[i] = new Game_Item();
    }
    for (var j = 0; j < equips.length; j++) {
        if (j < maxSlots) {
            this._equips[j].setEquip(slots[j] === 1, equips[j]);
        }
    }
};

Game_Actor.prototype.equipSlots = function () {
    var slots = [];
    for (var i = 1; i < $dataSystem.equipTypes.length; i++) {
        slots.push(i);
    }
    if (slots.length >= 2) {
        if (this.isDualWield()) {
            slots[1] = 1;
        } else if (this.isAllWield()) {
            slots[1] = 6;
        }
    }
    return slots;
};

/**
 * removes equipped items from item list but NOT
 * from the equips list
 */
Game_Actor.prototype.resetCarriedEquips = function () {
    this._items.splice(0, this.numEquips());
};

Game_Actor.prototype.releaseUnequippableItems = function (forcing) {
    for (; ;) {
        var slots = this.equipSlots();
        var equips = this.equips();
        var changed = false;
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && (!this.canEquip(item) || !this.eTypeMatchesSlot(item.etypeId, slots[i]))) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                }
                this.unequipItem(i, !forcing);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};

Game_Actor.prototype.eTypeMatchesSlot = function (eType, slot) {
    if (slot === 6) { // all wield
        return eType === 1 || eType === 2;
    } else {
        return eType === slot;
    }
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
    return this._items.length ? this._items[index].object() : null;
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
};

Game_Actor.prototype.isSlotEquipped = function (slotId) {
    return this.equips()[slotId];
};

/**
 * Is the item at given index an equipped item?
 * 
 * @param {number} index of held item 
 */
Game_Actor.prototype.indexIsEquip = function (index) {
    return index < this.numEquips();
};

Game_Actor.prototype.getSlotData = function () {
    var slotData = [];
    this._equips.forEach((item, index) => {
        if (item && item._itemId) slotData.push(index);
    });
    return slotData;
};

//////////////////////////////
// Functions - item movement
//////////////////////////////

/**
 * Removes item at index if it is a consumable
 * 
 * @param {number} index 
 */
Game_Actor.prototype.consumeActorItem = function (index) {
    if (this.item(index).consumable) {
        this.removeItemAtIndex(index);
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
    this.updateTwoHand(slotId, item);
    this.refresh();
};

/**
 * Unequips an item.
 * When keeping the item, it's removed from
 * inventory and re-added.
 * 
 * @param {number} index of item to unequip
 * @param {boolean} keep should the item be kept in the actors' inventory?
 * @param {number} slot of the equipped item is in
 */
Game_Actor.prototype.unequipItem = function (index, keep = true, slot = undefined) {
    var item = this.item(index);

    if (item) {
        this.removeItemAtIndex(index, slot);
        if (keep) {
            this.giveItems(item, 1);
        }
    }
};

DQEng.Game_Actor.discardEquip = Game_Actor.prototype.discardEquip;
Game_Actor.prototype.discardEquip = function (item) {
    DQEng.Game_Actor.discardEquip.call(this, item);
    this.refresh();
};

Game_Actor.prototype.discardEquipAtSlot = function (slotId) {
    this._equips[slotId].setObject(null);
    this.refresh();
};

/**
 * Removes item at given index
 * Unequips the item if equipped
 * 
 * @param {number} index of item to remove
 * @param {number} slot of the equipped item is in
 */
Game_Actor.prototype.removeItemAtIndex = function (index, slot = undefined) {
    if (this.indexIsEquip(index)) {
        if (slot) {
            this.discardEquipAtSlot(slot);
        } else {
            this.discardEquip(this.item(index));
        }
    }
    this._items.splice(index, 1);
};

/**
 * 
 * 
 * @param {number} slot the item is being equipped into
 * @param {item} item the item equipped
 */
Game_Actor.prototype.updateTwoHand = function (slot, item) {
    switch (slot) {
        case 0: // right hand (weapon)
            if (this.equips()[1] && (item.meta.twoHand || this.equips()[1].meta.twoHand)) {
                this.unequipItem(1, true, 1);
            }
            break;
        case 1: // left hand (weapon or shield)
            if (this.equips()[0] && (item.meta.twoHand || this.equips()[0].meta.twoHand)) {
                this.unequipItem(0, true, 0);
            }
            break;
    }
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
};

Game_Actor.prototype.giveItemToBag = function (index, slot = undefined) {
    $gameParty.gainItem(this.item(index), 1);
    this.removeItemAtIndex(index, slot);
};

Game_Actor.prototype.giveItemToActor = function (index, actor, slot = undefined) {
    actor.giveItems(this.item(index), 1);
    this.removeItemAtIndex(index, slot);
};

/**
 * Trades an item with the bag
 * 
 * @param {number} index of item being swapped with bag
 * @param {dataItem} item that is being given to actor
 * @param {number} slot of the equipped item is in
 */
Game_Actor.prototype.tradeItemWithBag = function (index, item, slot = undefined) {
    var isEquipped = this.indexIsEquip(index);
    var removedItem = this.item(index);

    this.removeItemAtIndex(index, slot);
    if (isEquipped) {
        $gameParty.giveItemToActor(item, this);
    } else {
        $gameParty.giveItemToActor(item, this, index);
    }
    $gameParty.gainItem(removedItem, 1);
};

/**
 * Trades an item with another actor
 * 
 * @param {number} index of item being swapped with other actor
 * @param {number} actorIndex of item being given to this actor
 * @param {Game_Actor} actor to swap an item with
 */
Game_Actor.prototype.tradeItemWithActor = function (index, actorIndex, actor, thisSlot = undefined, actorSlot = undefined) {
    var newPos = this.indexIsEquip(index) ? null : index;
    var item = this.item(index);
    var actorNewPos = actor.indexIsEquip(actorIndex) ? null : actorIndex;
    var actorItem = actor.item(actorIndex);

    this.removeItemAtIndex(index, thisSlot);
    actor.removeItemAtIndex(actorIndex, actorSlot);
    this.giveItems(actorItem, 1, newPos);
    actor.giveItems(item, 1, actorNewPos);
};

//////////////////////////////
// Functions - levels
//////////////////////////////

Game_Actor.prototype.gainExp = function (exp, playSound) {
    var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp(), playSound);
};

Game_Actor.prototype.changeExp = function (exp, show, playSound = false) {
    this._exp[this._classId] = Math.max(exp, 0);
    var lastLevel = this._level;
    var lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills), playSound);
    }
    this.refresh();
};

Game_Actor.prototype.displayLevelUp = function (newSkills, playSound) {
    var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
    var me = playSound ? '\\ME[Level_Up]' : '';
    var breaker = playSound ? ' \\|' : '';
    $gameMessage.newPage();
    $gameMessage.add(me + text + breaker);
    newSkills.forEach(function (skill) {
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
};

//////////////////////////////
// Functions - messages
//////////////////////////////

Game_Actor.prototype.magicUsedMessage = function (item) {
    return `\\sfx[Magic]${this._name}` + `${item.message1.format(item.name)}`;
};

Game_Actor.prototype.triedToMagicMessage = function (item, target) {
    return `${this._name} starts to cast ${item.name}...\\!\nBut it won't have any effect on ${target.name()}.`;
};

Game_Actor.prototype.triedToMagicAllMessage = function (item) {
    return `${this._name} starts to cast ${item.name}...\\!\nBut it won't have any effect.`;
};

Game_Actor.prototype.itemUsedMessage = function (item) {
    return `${this._name} used the ${item.name}.`;
};

Game_Actor.prototype.triedToUseMessage = function (item, target) {
    return `${this._name} tried to use the ${item.name}.\\!\nBut it had no effect on ${target.name()}.`;
};

// for items that target the whole party
Game_Actor.prototype.triedToUseAllMessage = function (item) {
    return `${this._name} tried to use the ${item.name}.\\!\nBut it had no effect.`;
};

Game_Actor.prototype.giveItemToBagMessage = function (index) {
    return `${this._name} placed the ${this.item(index).name} in the bag.`;
};

Game_Actor.prototype.giveItemToActorMessage = function (index, actor) {
    return `${this._name} handed the ${this.item(index).name} to ${actor._name}.`;
};

Game_Actor.prototype.tradeItemWithBagMessage = function (index, item) {
    return `${this._name} swapped the ${this.item(index).name}\nwith the ${item.name} from the bag.`;
};

Game_Actor.prototype.tradeItemWithActorMessage = function (index, actorIndex, actor) {
    return `${this._name} handed the ${this.item(index).name} to ${actor._name}\nand received the ${actor.item(actorIndex).name}.`;
};

Game_Actor.prototype.equipItemMessage = function (index) {
    return `${this._name} equipped the ${this.item(index).name}.`;
};

Game_Actor.prototype.unequipItemMessage = function (index) {
    return `${this._name} unequipped the ${this.item(index).name}.`;
};

Game_Actor.prototype.cantEquipMessage = function (index) {
    return `${this._name} can't equip the ${this.item(index).name}.`;
};

Game_Actor.prototype.inventoryFullMessage = function () {
    return `${this._name} has a full inventory.\nSelect an item to swap.`;
};
