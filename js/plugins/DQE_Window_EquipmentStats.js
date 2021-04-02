//=============================================================================
// Dragon Quest Engine - Window Equipment Stats
// DQE_Window_EquipmentStats.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying equipment stats - V0.1
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
Imported.DQEng_Window_EquipmentStats = true;

var DQEng = DQEng || {};
DQEng.Window_EquipmentStats = DQEng.Window_EquipmentStats || {};

//-----------------------------------------------------------------------------
// Window_EquipmentStats
//-----------------------------------------------------------------------------

function Window_EquipmentStats() {
    this.initialize.apply(this, arguments);
}

Window_EquipmentStats.prototype = Object.create(Window_Base.prototype);
Window_EquipmentStats.prototype.constructor = Window_EquipmentStats;

Window_EquipmentStats.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
    this._slot = null;
    this._item = null;
    this._equipped = true;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_EquipmentStats.prototype.standardPadding = function () {
    return 9;
};

Window_EquipmentStats.prototype.extraPadding = function () {
    return 15;
};

Window_EquipmentStats.prototype.titleBlockHeight = function () {
    return 54;
};

Window_EquipmentStats.prototype.numberOfItems = function () {
    return Math.floor((this.contentsHeight() - this.titleBlockHeight()) / (this.itemHeight() * 2));
};

Window_EquipmentStats.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_EquipmentStats.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = category > -1 ? $gameParty.members()[this._category] : null;
    }
};

// used in scene_battle
Window_EquipmentStats.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
    }
};

Window_EquipmentStats.prototype.setItem = function (item, equipped, slot) {
    this._item = JsonEx.makeDeepCopy(item);
    this._equipped = equipped;
    this._slot = slot;
    this.refresh();
};

/**
 * used in scene_battle
 * 
 * changes values but not the item property
 * this will be kept from a previous windows selection
 * e.g. in battle, the battleEquipment window sets the item and the EquipSlot_Weapons changes these values
 */
Window_EquipmentStats.prototype.setEquippedPlusSlot = function (equipped, slot) {
    this._equipped = equipped;
    this._slot = slot;
    this.refresh();
};

Window_EquipmentStats.prototype.combineItemStats = function (stats, equippedStats) {
    let result = {};
    let unequipped = [], equipped = [];
    stats = stats.concat(equippedStats);
    stats.forEach(stat => {
        let isSparam = stat.code === Game_BattlerBase.TRAIT_SPARAM || stat.code === Game_BattlerBase.TRAIT_STATE_RATE;
        let thisStat = `${stat.code}/${stat.dataId}`;
        if (result[thisStat]) {
            result[thisStat].diff -= isSparam ? 1 - stat.value : stat.value;
        } else {
            result[thisStat] = stat;
             // init difference value
            if (result[thisStat].equipped) {
                result[thisStat].diff = isSparam ? -(1 - stat.value) : -stat.value;
            } else {
                result[thisStat].diff = isSparam ? 1 - stat.value : stat.value;
            }
        }
    });
    for (const [key, value] of Object.entries(result)) {
        value.equipped ? equipped.push(value) : unequipped.push(value);
    }

    return unequipped.concat(equipped);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_EquipmentStats.prototype.drawTitle = function () {
    let name = '';
    if (this._item) {
        name = this._item.wtypeId >= 0 ? $dataSystem.weaponTypes[this._item.wtypeId] : $dataSystem.armorTypes[this._item.atypeId];
    }
    this.drawText(name, 0, this.extraPadding(), this.contentsWidth(), 'center');
    this.drawHorzLine(0, this.titleBlockHeight() - 3);
};

Window_EquipmentStats.prototype.drawStats = function () {
    let stats = this.makeItemStats(this._item); // stats for the hovered over item (in slot and list windows)
    if (!this._equipped && this._actor) {
        let replaceEquipment = this.getReplaceEquipment(this._item.meta.twoHand, this._actor, this._slot);
        let otherStats = [];
        replaceEquipment.forEach(equipment => {
            otherStats = otherStats.concat(this.makeItemStats(equipment, true)); // the stats for the current equipped items
        });
        stats = this.combineItemStats(stats, otherStats);
    }
    let noItems = Math.min(this.numberOfItems(), stats.length);
    let x = this.extraPadding();
    let y = this.titleBlockHeight() + this.extraPadding();
    for (let i = 0; i < noItems; i++) {
        let name, value, actorValue, actorNewValue;
        let percent = '%';
        switch (stats[i].code) {
            case Game_BattlerBase.TRAIT_PARAM:
                name = TextManager.param(stats[i].dataId);
                value = stats[i].equipped ? 0 : stats[i].value;
                actorValue = this._actor?.param(stats[i].dataId);
                if (!this._equipped && this._actor) actorNewValue = actorValue + stats[i].diff;
                percent = '';
                break;
            case Game_BattlerBase.TRAIT_XPARAM:
                name = TextManager.xparam(stats[i].dataId);
                value = stats[i].equipped ? 0 : stats[i].value * 100;
                actorValue = this._actor?.displayEffects(1, stats[i].dataId);
                if (!this._equipped && this._actor) actorNewValue = actorValue + (stats[i].diff * 100);
                break;
            case Game_BattlerBase.TRAIT_SPARAM:
                name = TextManager.sparamAbbr(stats[i].dataId);
                value = stats[i].equipped ? 0 : ((1 - stats[i].value) * 100).toFixed(0);
                actorValue = this._actor?.displayEffects(2, stats[i].dataId);
                if (!this._equipped && this._actor) actorNewValue = Number(actorValue) + Number((stats[i].diff * 100).toFixed(0));
                break;
            case Game_BattlerBase.TRAIT_STATE_RATE:
                name = $dataStates[stats[i].dataId].meta.resistName;
                value = stats[i].equipped ? 0 : ((1 - stats[i].value) * 100).toFixed(0);
                actorValue = this._actor?.displayEffects(3, stats[i].dataId);
                if (!this._equipped && this._actor) actorNewValue = Number(actorValue) + Number((stats[i].diff * 100).toFixed(0));
                break;
        }
        let sign = value < 0 ? '' : '+';
        stats[i].equipped ? this.changeTextColor(this.statEquipColor()) : this.changeTextColor(this.statColor());
        this.drawText(name, x, y);
        this.resetTextColor();
        y += this.itemHeight();
        let text = '';
        if (this._equipped) { // the item being looked at is equipped by actor
            text = `${sign}${value}${percent}(E ${actorValue}${percent})`;
            this.drawText(text, x, y);
        } else if (this._actor) {
            text = `${sign}${value}${percent}(${actorValue}${percent} > `;
            this.drawText(text, x, y);
            x += this.contents.measureTextWidth(text);

            let text2 = `${actorNewValue}${percent}`;
            this.changeTextColor(this.paramchangeTextColor(actorNewValue - actorValue));
            this.drawText(text2, x, y);
            x += this.contents.measureTextWidth(text2);

            let text3 = `)`;
            this.resetTextColor();
            this.drawText(text3, x, y);
        } else { // looking in equipment bag
            text = `${sign}${value}${percent}`;
            this.drawText(text, x, y);
        }
        x = this.extraPadding();
        y += this.itemHeight();
    }
};

// actor can't equip this item
Window_EquipmentStats.prototype.drawDisallow = function () {
    const y = this.titleBlockHeight() + this.extraPadding();
    this.drawText(`Can't Equip!`, 0, y, this.contentsWidth(), 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_EquipmentStats.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitle();
    // if no actor (player is looking in bag) or actor can equip selected item: draw stats; else: draw disallow text
    if (this._item) !this._actor || this._actor.canEquip(this._item) ? this.drawStats() : this.drawDisallow();
};
