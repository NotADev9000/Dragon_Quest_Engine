//=============================================================================
// Dragon Quest Engine - Game Party
// DQE_Game_Party.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the party - V0.1
*
* @param Preferred Member
* @desc Actor ID of party member who is given priority in certain situations. e.g. revived when party is wiped out, chosen as the leader in cutscenes
* @default 1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_Party = true;

var DQEng = DQEng || {};
DQEng.Game_Party = DQEng.Game_Party || {};

var parameters = PluginManager.parameters('DQE_Game_Party');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_Party = {};
DQEng.Parameters.Game_Party.PreferredMember = Number(parameters["Preferred Member"]) || 1;

//-----------------------------------------------------------------------------
// Game_Party
//-----------------------------------------------------------------------------

// Amount of sorting types
Game_Party.SORT_LENGTH = 3;
// Constants to identify sorting style
Game_Party.SORT_BY_OBTAINED = 0;
Game_Party.SORT_BY_ALPHABETICAL = 1;
Game_Party.SORT_BY_TYPE = 2;

DQEng.Game_Party.initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function () {
    DQEng.Game_Party.initialize.call(this);
    // quests
    this._quests = [];          // active/completed quests
    this._availableQuests = []; // quests not started but available to the player
    // bank
    this._bankGold = 0;         // gold in the bank
    // mini medals
    this._medalTotal = 0;       // total mini medals collected
    this._medalCurrent = 0;     // currently held mini medals
    // restore points
    this._restorePoint = new Game_RestorePoint();
    // zoom points
    this._zoomPoints = [];
    this._lastZoomPoint = {};   // last point zoomed to
    // item sorting
    this._sortMethod = Game_Party.SORT_BY_OBTAINED; // sort type defaults to order obtained
};

//////////////////////////////
// Functions - items
//////////////////////////////

// ITEM INFO

/**
 * containers are an array of arrays
 * this allows an order of when items were obtained instead of by database ID
 * 
 * second array contains ***_item info***
 * element[0] = item ID
 * element[1] = amount of item
 * 
 * second array contains ***_equipment info***
 * element[0] = item ID
 * element[1] = amount of item
 * element[2] = is weapon or armor? 0 = weapons, 1 = armor
 */
Game_Party.prototype.initAllItems = function () {
    this._items = [];
    this._equipment = [];
};

/**
 * filters _equipment into weapons
 * THIS FUNCTION DOES NOT GET THE DATA ITEMS - USE weapons()
 */
Game_Party.prototype.equipmentWeapons = function () {
    return this._equipment.filter(equipment => equipment[2] === 0);
};

/**
 * filters _equipment into armor
 * THIS FUNCTION DOES NOT GET THE DATA ITEMS - USE armors()
 */
Game_Party.prototype.equipmentArmors = function () {
    return this._equipment.filter(equipment => equipment[2] === 1);
};

/**
 * returns all equipment if seperateEquipment is false
 * returns just the weapons or armor if seperateEquipment is true
 */
Game_Party.prototype.itemContainer = function (item, seperateEquipment = false) {
    if (!item) {
        return null;
    } else if (DataManager.isItem(item)) {
        return this._items;
    } else if (DataManager.isWeapon(item)) {
        return seperateEquipment ? this.equipmentWeapons() : this._equipment;
    } else if (DataManager.isArmor(item)) {
        return seperateEquipment ? this.equipmentArmors() : this._equipment;
    } else {
        return null;
    }
};

/**
 * returns the array of item info for passed item
 * returns undefined if not holding that item
 */
Game_Party.prototype.itemInfo = function (item) {
    return this.itemContainer(item, true).
        find(containerItem => containerItem[0] === item.id);
};

// DATA ITEMS

Game_Party.prototype.items = function () {
    return this.dataItems(this._items, $dataItems);
};

Game_Party.prototype.equipItems = function () {
    return this.dataItems(this._equipment);
};

Game_Party.prototype.weapons = function () {
    const weapons = this.equipmentWeapons();
    return this.dataItems(weapons, $dataWeapons);
};

Game_Party.prototype.armors = function () {
    const armors = this.equipmentArmors();
    return this.dataItems(armors, $dataArmors);
};

Game_Party.prototype.dataItems = function (items, data) {
    const list = [];
    const hasData = data ? true : false; // has a data object been passed as argument? (it won't be when getting weapons & armors)

    items.forEach(item => {
        if (!hasData) data = item[2] === 0 ? $dataWeapons : $dataArmors; // getting all equipment data so item needs to be checked if it's a weapon or armor piece
        list.push(data[item[0]]);
    });
    return list;
};

// ITEM QUERIES

Game_Party.prototype.numItems = function (item) {
    const itemInfo = this.itemInfo(item);
    return itemInfo ? itemInfo[1] : 0;
};

Game_Party.prototype.gainItem = function (item, amount) {
    const container = this.itemContainer(item);
    if (container) {
        const itemInfo = this.itemInfo(item);
        if (itemInfo) {
            // already holding this item
            itemInfo[1] = (itemInfo[1] + amount).clamp(0, this.maxItems()); // update amount of that item
            // if carrying 0, delete item from array
            if (itemInfo[1] === 0) {
                const removeAt = container.indexOf(itemInfo);
                container.splice(removeAt, 1);
            }
        } else if (amount > 0) {
            // not holding this item & not trying to remove it
            let newItem = [item.id, amount];
            // if item is weapon or armor add indicator to item array (0 = weapon, 1 = armor)
            if ("wtypeId" in item) newItem.push(0)
            else if ("atypeId" in item) newItem.push(1);
            // add new weapon to container
            container.push(newItem);
        }
        $gameMap.requestRefresh();
    }
};

//////////////////////////////
// Functions - moving items
//////////////////////////////

Game_Party.prototype.giveItemToActor = function (item, actor, index, amount = 1) {
    actor.giveItems(item, amount, index);
    this.loseItem(item, amount);
};

Game_Party.prototype.giveItemToActorMessage = function (item, actor) {
    return `${actor._name} takes the ${item.name} from the bag.`;
};

Game_Party.prototype.giveItemToActorAndEquipMessage = function (item, actor) {
    return `${actor._name} takes the ${item.name} from the bag and equips it.`;
};

Game_Party.prototype.giveMultipleItemsToActorMessage = function (item, actor, amount) {
    return `${actor._name} takes ${amount} ${item.name}s from the bag.`;
};

//////////////////////////////
// Functions - quests
//////////////////////////////

Game_Party.prototype.quests = function () {
    return this._quests;
};

Game_Party.prototype.availableQuests = function () {
    return this._availableQuests;
};

Game_Party.prototype.isQuestActive = function (questId) {
    return this._quests[questId];
};

Game_Party.prototype.activateQuest = function (questId) {
    if (!this.isQuestActive(questId)) {
        // remove quest from locator
        this.removeAvailableQuest(questId);
        // add new quest to active list (ordered by ID)
        this._quests[questId] = new Game_Quest($DQE_dataQuests[questId]);
    }
};

Game_Party.prototype.addAvailableQuest = function (questId) {
    this._availableQuests[questId] = questId;
};

Game_Party.prototype.removeAvailableQuest = function (questId) {
    this._availableQuests[questId] = undefined;
};

/**
 * compare the active quests to the data quests and udpate
 * the active ones if they don't match
 */
Game_Party.prototype.updateQuests = function () {
    this._quests.forEach(quest => {
        if (quest) {
            quest.stages().forEach((stage, index) => {
                const gameObjs = stage.objectives();
                const dataObjs = quest.stage(index).objectives;
                if (gameObjs.length < dataObjs.length) {
                    const diff = dataObjs.length - gameObjs.length;
                    for (let i = 0; i < diff; i++) {
                        gameObjs.push(0);
                    }
                }
            });
        }
    });
};

//////////////////////////////
// Functions - gold
//////////////////////////////

/**
 * 10 million max gold
 */
Game_Party.prototype.maxGold = function () {
    return 10000000;
};

//////////////////////////////
// Functions - bank gold
//////////////////////////////

Game_Party.prototype.bankGold = function () {
    return this._bankGold;
};

/**
 * 10 million max bank gold
 */
Game_Party.prototype.maxBankGold = function () {
    return 10000000;
};

Game_Party.prototype.hasMaxBankGold = function () {
    return this.bankGold() >= this.maxBankGold();
};

Game_Party.prototype.hasNoBankGold = function () {
    return this.bankGold() <= 0;
};

Game_Party.prototype.gainBankGold = function (amount) {
    this._bankGold = (this._bankGold + amount).clamp(0, this.maxBankGold());
};

Game_Party.prototype.loseBankGold = function (amount) {
    this.gainBankGold(-amount);
};

Game_Party.prototype.depositGold = function (amount) {
    this.loseGold(amount);
    this.gainBankGold(amount);
};

Game_Party.prototype.withdrawGold = function (amount) {
    this.gainGold(amount);
    this.loseBankGold(amount);
};

//////////////////////////////
// Functions - mini medals
//////////////////////////////

Game_Party.prototype.medalTotal = function () {
    return this._medalTotal;
};

Game_Party.prototype.medalCurrent = function () {
    return this._medalCurrent;
};

Game_Party.prototype.gainMedal = function (amount) {
    this._medalTotal += amount;
    this._medalCurrent += amount;
};

Game_Party.prototype.loseMedal = function (amount) {
    this._medalCurrent = Math.max(this._medalCurrent - amount, 0);
};

//////////////////////////////
// Functions - battle
//////////////////////////////

Game_Party.prototype.onBattleStart = function () {
    this.allMembers().forEach(function (member) {
        member.onBattleStart();
    });
    this._inBattle = true;
};

Game_Party.prototype.onBattleEnd = function () {
    this._inBattle = false;
    this.allMembers().forEach(function (member) {
        member.onBattleEnd();
    });
};

Game_Party.prototype.makeActions = function () {
    this.allMembers().forEach(function (member) {
        member.makeActions();
    });
};

//////////////////////////////
// Functions - line-up
//////////////////////////////

/**
 * swaps actors at given indexes and returns false if the frontline
 * does not have 1 alive party member after the swap
 */
Game_Party.prototype.attemptSwap = function (index1, index2) {
    let frontline = Object.assign([], $gameParty.frontline());
    let swapWith = $gameParty.allMembers()[index2];
    frontline[index1] = swapWith;

    return frontline.some(actor => actor.isAlive());
};

/**
 * checks if the passed array of actor indexes have at least
 * one living actor in the frontline
 */
Game_Party.prototype.checkGroupOrder = function (array) {
    let frontlineInd = array.slice().splice(0, 4);
    return frontlineInd.some(index => 
        $gameParty.allMembers()[index].isAlive()
    );
};

/**
 * takes an array of character positions and converts them to
 * the character indexes and then sets that as the party order
 * 
 * @param {array} list an array of character positions
 */
Game_Party.prototype.newOrder = function (list) {
    var actorIds = [];
    list.forEach((element) => {
        actorIds.push($gameParty.allMembers()[element]._actorId);
    });
    this._actors = actorIds;
    $gamePlayer.refresh();
};

/**
 * swaps the frontline and backline members
 */
Game_Party.prototype.swapFlWithBl = function () {
    fl = this.frontline();
    bl = this.backline();
    let actors = this._actors = [];
    bl.concat(fl).forEach(member => {
        actors.push(member._actorId);
    });
    $gamePlayer.refresh();
};

//////////////////////////////
// Functions - actors
//////////////////////////////

Game_Party.prototype.revivePreferredMember = function () {
    let preferId = DQEng.Parameters.Game_Party.PreferredMember;
    this.allMembers().forEach(actor => {
        if (actor.actorId() === preferId && actor.isDead()) actor.setHp(1);
    });
    $gamePlayer.refresh();
};

Game_Party.prototype.isAllDead = function () {
    return this.allAliveMembers().length === 0;
};

Game_Party.prototype.allAliveMembers = function () {
    return this.allMembers().filter(function (member) {
        return member.isAlive();
    });
};

Game_Party.prototype.firstAliveMemberName = function () {
    return this.movableMembers()[0].name();
};

//////////////////////////////
// Functions - restore point
//////////////////////////////

Game_Party.prototype.restorePoint = function () {
    return this._restorePoint;
};

Game_Party.prototype.setRestorePoint = function (mapId, x, y, dir, mapName) {
    let restorePoint = this.restorePoint();
    restorePoint.mapId = mapId;
    restorePoint.mapName = mapName || $gameMap.displayName();
    restorePoint.x = x;
    restorePoint.y = y;
    restorePoint.direction = dir;
};

//////////////////////////////
// Functions - zoom points
//////////////////////////////

/**
 * returns the zoom point list without the empty items
 */
Game_Party.prototype.zoomPoints = function () {
    return this._zoomPoints.filter(point => point);
};

// Zoom IDs start at 0
Game_Party.prototype.addZoomPoint = function (id, name, mapId, x, y) {
    const point = {
        id: id,
        name: name.replaceAll('_', ' '),
        mapId: mapId,
        x: x,
        y: y
    }
    this._zoomPoints[id] = point;
};

/**
 * Does game allow player to zoom & does player have zoom points
 */
Game_Party.prototype.allowedZoom = function () {
    return $gameSwitches.value(DQEng.Parameters.Game_System.AllowZoomSwitch)
        && this.zoomPoints().length;
};

/**
 * Does party have zoom spell
 */
Game_Party.prototype.hasZoom = function () {
    return this.members().some(actor => {
        return actor.hasSkill(DQEng.Parameters.Game_BattlerBase.zoomSkillId);
    });
};

/**
 * Is there a party member who has and is able to use zoom spell
 */
Game_Party.prototype.partyCanZoom = function () {
    return this.movableMembers().some(actor => {
        return actor.hasSkill(DQEng.Parameters.Game_BattlerBase.zoomSkillId);
    });
};

/**
 * Return front party member who can zoom
 */
Game_Party.prototype.zoomMember = function () {
    return this.movableMembers().find(actor => {
        return actor.hasSkill(DQEng.Parameters.Game_BattlerBase.zoomSkillId);
    });
};

Game_Party.prototype.lastZoomPoint = function () {
    return this._lastZoomPoint;
};

Game_Party.prototype.setLastZoomPoint = function (point) {
    this._lastZoomPoint = point;
};

//////////////////////////////
// Functions - sort items style
//////////////////////////////

Game_Party.prototype.sortMethod = function () {
    return this._sortMethod;
};

/**
 * Pass in a constant (number) to set sort method
 */
Game_Party.prototype.setSortMethod = function (sortMethod) {
    this._sortMethod = sortMethod;
};

Game_Party.prototype.nextSortMethod = function () {
    this._sortMethod = this._sortMethod >= Game_Party.SORT_LENGTH - 1 ? 0 : this._sortMethod + 1;
};

Game_Party.prototype.prevSortMethod = function () {
    this._sortMethod = this._sortMethod <= 0 ? Game_Party.SORT_LENGTH - 1 : this._sortMethod - 1;
};
