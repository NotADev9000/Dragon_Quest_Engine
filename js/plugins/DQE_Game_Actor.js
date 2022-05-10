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
    this._checkSecondHand = true;
    this._skillSets = [];
    this._skillPoints = 0;
    this._addedTraits = []; // traits that are unlocked throughout the game
};

/**
 * Added items to setup
 */
DQEng.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    DQEng.Game_Actor.setup.call(this, actorId);
    // items
    this.initItems();
    this.releaseUnequippableItems(true);
    this.refresh();
    // skillsets
    this.initSkillSets();
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
    this._items = this.initCarriedEquips();
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
            slots[1] = 7;
        }
        slots[5] = 5; // second accessory should match first
    }
    return slots;
};

/**
 * removes equipped items from item list but NOT
 * from the equips list
 */
Game_Actor.prototype.removeEquipsFromItemList = function () {
    this._items.splice(0, this.numEquips());
};

Game_Actor.prototype.releaseUnequippableItems = function (forcing) {
    for (; ;) {
        var slots = this.equipSlots();
        var equips = this.equips();
        var changed = false;
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && (!this.canEquip(item) || 
                         !this.eTypeMatchesSlot(item.etypeId, slots[i]) || 
                         (this._checkSecondHand && this.isSecondHand(item.etypeId, i, slots[i]))
                        )) {
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
    if (slot === 7) { // all wield
        return eType === 1 || eType === 2;
    } else {
        return eType === slot;
    }
};

/**
 * for dual wield equipment only
 * is the item in slotId in the off-hand when 
 * there is no equipment in the main hand
 * 
 * @param {number} etype the equipment type ID of an item
 * @param {number} slotId the equip slot currently being checked
 * @param {number} slot the type of slot e.g. right hand, left hand, all wield, head, etc.
 */
Game_Actor.prototype.isSecondHand = function (etype, slotId, slot) {
    if (slot === 7 && etype-1 !== slotId) {
        return !this.isSlotEquipped(etype-1);
    }
    return false;
};

/**
 * retrieves equipped item in certain slot but also takes 2h weapons into consideration
 * e.g. if slotId === 1 and a two-handed sword is equipped, then return item in slot[0]
 */
Game_Actor.prototype.getItemInSlot = function (slotId) {
    let equip = this.equips()[slotId];
    if (!equip) { // no equipment in slot
        let pairedSlotEquip = null;
        switch (slotId) {
            case 0:
                pairedSlotEquip = this.equips()[1];
                break;
            case 1:
                pairedSlotEquip = this.equips()[0];
                break; 
        }
        return pairedSlotEquip?.meta.twoHand ? pairedSlotEquip : null;
    }
    return equip;
};

//////////////////////////////
// Functions - item queries
//////////////////////////////

/**
 * Returns held items as an array of Game_Item
 */
Game_Actor.prototype.gameItems = function () {
    return this._items;
};

/**
 * Returns held items as an array of $dataItems
 */
Game_Actor.prototype.items = function () {
    return this._items.map(function (item) {
        return item.object();
    });
};

Game_Actor.prototype.setItems = function (items) {
    this._items = items;
};

/**
 * Returns held items that are equipment pieces
 */
Game_Actor.prototype.itemsEquipment = function (includeEquips = true) {
    if (!includeEquips) var numEquips = this.numEquips();
    return this._items.filter(function (item, index) {
        return includeEquips ? item._dataClass !== "item" : item._dataClass !== "item" && index >= numEquips;
    }).map(function (item) {
        return item.object();
    });
};

/**
 * returns some extra information about the equipment held
 * - is it equipped?
 * - the index of the equipment
 */
Game_Actor.prototype.itemsEquipmentExtraInfo = function (etype, includeEquips = true) {
    let array = [];
    let numEquips = this.numEquips();
    this._items.forEach(function (item, index) {
        if (includeEquips || index >= numEquips) {
            // is equipment                  no etype OR item is of requested etype
            if (item._dataClass !== "item" && (!etype || etype === item.object().etypeId)) {
                array.push({
                    equipped: index < numEquips,
                    index: index
                });
            }
        }
    });
    return array;
};

Game_Actor.prototype.equipmentByType = function (etype, includeEquips) {
    return this.itemsEquipment(includeEquips).filter(function (item) {
        return item.etypeId === etype;
    });
};

/**
 * Looks at the actor's inventory and decides which
 * slot needs to be equipped
 */
Game_Actor.prototype.whichEquipSlot = function (item, selectedSlot) {
    let etype = item.etypeId-1;
    let slotItem = this.isSlotEquipped(etype);
    if (!item.meta.twoHand && slotItem && !slotItem.meta.twoHand) {
        return selectedSlot;
    } else {
        return etype;
    }
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
    return 28;
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

Game_Actor.prototype.amountOfItem = function (item, type) {
    const items = this.items();
    const id = item.id;
    let count = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            switch (type) {
                case 0:
                    if (items[i].itypeId === item.itypeId) count++;
                    break;
                case 1:
                    if (items[i].wtypeId === item.wtypeId) count++;
                    break;
                case 2:
                    if (items[i].atypeId === item.atypeId) count++;
                    break;
            }
        }
    }
    return count;
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

/**
 * Does actor have 2h weapon equipped
 */
Game_Actor.prototype.hasTwoHandedEquipped = function () {
    let e = this.equips();
    return e[0]?.meta.twoHand || e[1]?.meta.twoHand;
};

Game_Actor.prototype.hasHandsFree = function () {
    let e = this.equips();
    return !(e[0]?.id || e[1]?.id);
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
Game_Actor.prototype.equipItemFromInv = function (index, slot = undefined) {
    var item = this.item(index);
    var slotId = slot >= 0 && !item.meta.twoHand ? slot : item.etypeId - 1;
    var replace = new Game_Item(this.equips()[slotId]); // item in this position is being unequipped

    if (replace._itemId) {
        // move the previously equipped item into inventory
        this._items[index] = replace;
    } else {
        // remove item that has just been equipped
        this.removeItemAtIndex(index);
    }
    this.removeEquipsFromItemList();
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

Game_Actor.prototype.setCheckSecondHand = function (check) {
    this._checkSecondHand = check;
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

/**
 * Sends all non-equipment items OR all unequipped equipment to bag
 */
Game_Actor.prototype.sendItemsOrEquipmentToBag = function (sendItems = true) {
    const itemCheckFunc = sendItems ? Game_Item.prototype.isItem : Game_Item.prototype.isEquipItem;
    this.removeEquipsFromItemList(); // so no equips are sent to bag

    // keeps the items of the type not being checked (these items are not added to bag as the OR check has been passed)
    // items of the type being checked are then added to bag
    // (these items are added to bag as OR check has failed, $gameParty.gainItem always returns undefined)
    const filtered = this._items.filter((item, i) =>
        !itemCheckFunc.call(item) || $gameParty.gainItem(this.item(i), 1)
    );

    // place equips back
    this._items = this.initCarriedEquips().concat(filtered);
};

/**
 * Sends all unequipped items & equipment to bag
 */
Game_Actor.prototype.sendEverythingToBag = function () {
    this.removeEquipsFromItemList();
    this._items.forEach((item, i) => $gameParty.gainItem(this.item(i), 1));
    this._items = this.initCarriedEquips();
};

//////////////////////////////
// Functions - parameters
//////////////////////////////

Game_Actor.prototype.paramMax = function (paramId) {
    return Game_Battler.prototype.paramMax.call(this, paramId);
};

/**
 * @param {*} paramId ID of the parameter to retrieve
 * @param {*} levelChange How much to change the current level by 
 */
Game_Actor.prototype.paramDefault = function (paramId, levelChange = 0) {
    return this.currentClass(paramId > 7).params[paramId][this._level + levelChange];
};

Game_Actor.prototype.paramBase = function (paramId, levelChange = 0) {
    return Game_Battler.prototype.paramBase.call(this, paramId, levelChange);
};

Game_Actor.prototype.paramPlus = function (paramId) {
    return Game_Battler.prototype.paramPlus.call(this, paramId);
};

Game_Actor.prototype.paramEquips = function (paramId) {
    let value = 0;
    let equips = this.equips();
    for (let i = 0; i < equips.length; i++) {
        let item = equips[i];
        if (item) {
            value += paramId <= 7 ? item.params[paramId] : Number(item.meta.charm) || 0;
        }
    }
    return value;
};

//////////////////////////////
// Functions - traits
//////////////////////////////

Game_Actor.prototype.allTraits = function () {
    let traits = Game_Battler.prototype.allTraits.call(this);
    return traits.concat(this._addedTraits);
};

/**
 * adds a new trait to the actor
 * trait param should follow trait objects: {code: trait type ID, dataId: trait data ID, value: trait data value}
 * 
 * @param {Object} trait the trait to add
 */
Game_Actor.prototype.addTrait = function (trait) {
    this._addedTraits.push(trait);
};

//////////////////////////////
// Functions - class
//////////////////////////////

Game_Actor.prototype.currentClass = function (extra = false) {
    return extra ? $DQE_dataClasses[this._classId] : $dataClasses[this._classId];
};

//////////////////////////////
// Functions - levels
//////////////////////////////

Game_Actor.prototype.gainExp = function (exp, playSound, inBattle) {
    var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp(), playSound, inBattle);
};

Game_Actor.prototype.changeExp = function (exp, show, playSound = false, inBattle = false) {
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
        this.displayLevelUp(this.findNewSkills(lastSkills), playSound, inBattle);
        this.displayEarnedSkillPoints();
    }
    this.refresh();
};

DQEng.Game_Actor.levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function () {
    DQEng.Game_Actor.levelUp.call(this);
    this.addSkillPoints(this.skillPointsThisLevel());
};

Game_Actor.prototype.displayLevelUp = function (newSkills, playSound, inBattle) {
    const text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
    let statWindowCallback = '';
    if (inBattle) {
        const actorIndex = $gameParty.members().indexOf(this);
        statWindowCallback = `\\FUNC[SceneManager,_scene,refreshAndShowStatsWindow,${actorIndex}]`;
    }
    const me = playSound ? '\\ME[Level_Up]' : '';
    const breaker = playSound ? ' \\|' : '';
    $gameMessage.newPage();
    $gameMessage.add(statWindowCallback + me + text + breaker);
    if (newSkills.length) {
        $gameMessage.newPage();
        newSkills.forEach(function (skill) {
            $gameMessage.add(TextManager.obtainSkill.format(this._name, skill.name));
        }, this);
    }
};

Game_Actor.prototype.displayEarnedSkillPoints = function () {
    const skillPointsLevel = this.skillPointsThisLevel();
    if (skillPointsLevel > 0) {
        $gameMessage.newPage();
        $gameMessage.add(TextManager.terms.obtainSkillPoint.format(this._name, `${skillPointsLevel} ${TextManager.skillPointText(skillPointsLevel)}`));
    }
};

//////////////////////////////
// Functions - skill sets
//////////////////////////////

Game_Actor.prototype.skillSets = function () {
    return this._skillSets;
};

Game_Actor.prototype.initSkillSets = function () {
    this._skillSets = [];
    // looping through the data actors' skill sets
    this.actor().skillSets.forEach(skillSetId => {
        this.addSkillSet(skillSetId);
    });
};

Game_Actor.prototype.addSkillSet = function (skillSetId) {
    const skillSet = $gameSystem.findSkillSet(skillSetId);
    if (skillSet) {
        this._skillSets.push(JsonEx.makeDeepCopy(skillSet));
    } else {
        console.warn(`skill set with ID: ${skillSetId} does not exist.`);
    }
};

Game_Actor.prototype.numSkillSets = function () {
    return this._skillSets.length;
};

//////////////////////////////
// Functions - skill points
//////////////////////////////

Game_Actor.prototype.skillPoints = function () {
    return this._skillPoints;
};

/**
 * @returns how many skill points actor earns at their current level
 */
Game_Actor.prototype.skillPointsThisLevel = function () {
    return this.actor().skillPoints[this._level] || 0;
};

Game_Actor.prototype.addSkillPoints = function (amount) {
    this._skillPoints = Math.min(this._skillPoints + amount, 9999);
};

Game_Actor.prototype.loseSkillPoints = function (amount) {
    this._skillPoints = Math.max(this._skillPoints - amount, 0);
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

Game_Actor.prototype.triedToZoomMessage = function (item) {
    return `${this._name} starts to cast ${item.name}...\\!\nBut something is stopping the spell's power.`;
};

Game_Actor.prototype.itemUsedMessage = function (item) {
    return `${this._name} uses the ${item.name}.`;
};

Game_Actor.prototype.triedToUseMessage = function (item, target) {
    return `${this._name} tries to use the ${item.name}.\\!\nBut it has no effect on ${target.name()}.`;
};

// for items that target the whole party
Game_Actor.prototype.triedToUseAllMessage = function (item) {
    return `${this._name} tries to use the ${item.name}.\\!\nBut it has no effect.`;
};

Game_Actor.prototype.giveItemToBagMessage = function (index) {
    return `${this._name} places the ${this.item(index).name} in the bag.`;
};

Game_Actor.prototype.giveItemToActorMessage = function (index, actor) {
    return `${this._name} hands the ${this.item(index).name} to ${actor._name}.`;
};

Game_Actor.prototype.tradeItemWithBagMessage = function (index, item) {
    return `${this._name} swaps the ${this.item(index).name}\nwith the ${item.name} from the bag.`;
};

Game_Actor.prototype.tradeItemWithActorMessage = function (index, actorIndex, actor) {
    return `${this._name} hands the ${this.item(index).name} to ${actor._name}\nand receives the ${actor.item(actorIndex).name}.`;
};

Game_Actor.prototype.equipItemMessage = function (index) {
    return `${this._name} equips the ${this.item(index).name}.`;
};

Game_Actor.prototype.unequipItemMessage = function (index) {
    return `${this._name} unequips the ${this.item(index).name}.`;
};

Game_Actor.prototype.tradeItemWithBagAndEquipMessage = function (index, item) {
    return `${this._name} swaps the ${this.item(index).name} with the ${item.name} from the bag and equips it.`;
};

Game_Actor.prototype.tradeItemWithActorAndEquipMessage = function (index, actorIndex, actor) {
    return `${this._name} swaps the ${this.item(index).name} with the ${actor.item(actorIndex).name} from ${actor._name} and equips it.`;
};

Game_Actor.prototype.getItemFromActorAndEquipMessage = function (index, actor) {
    return `${this._name} takes the ${actor.item(index).name} from ${actor._name} and equips it.`;
};

Game_Actor.prototype.cantEquipMessage = function (index) {
    return `${this._name} can't equip the ${this.item(index).name}.`;
};

Game_Actor.prototype.inventoryFullMessage = function () {
    return `${this._name} has a full inventory.\nSelect an item to swap.`;
};

Game_Actor.prototype.inventoryFullCarryMessage = function () {
    return `${this._name} can't carry any more items!`;
};

// Sending to bag

Game_Actor.prototype.sendItemsToBagMessage = function () {
    return `${this._name} places all non-equipment items in the bag.`;
};

Game_Actor.prototype.sendEquipmentToBagMessage = function () {
    return `${this._name} places all unequipped gear in the bag.`;
};

Game_Actor.prototype.sendEverythingToBagMessage = function () {
    return `${this._name} places all unequipped items and gear in the bag.`;
};

//////////////////////////////
// Functions - actions
//////////////////////////////

Game_Actor.prototype.makeExtraConfusionActions = function () {
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setExtraConfusion();
    }
    this.setActionState('waiting');
};

Game_Actor.prototype.makeActions = function () {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        this.setActionState('undecided');
    } else {
        this.setActionState('waiting');
    }
    if (this.isAutoBattle()) {
        this.makeAutoBattleActions();
    } else if (this.isConfused()) {
        this.makeConfusionActions();
    } else if (this.isExtraConfused()) {
        this.makeExtraConfusionActions();
    }
};
