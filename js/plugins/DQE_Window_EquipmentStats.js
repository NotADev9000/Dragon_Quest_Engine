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
    return (this.contentsHeight() - this.titleBlockHeight()) / (this.itemHeight() * 2);
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
        this._actor = $gameParty.members()[this._category];
    }
};

Window_EquipmentStats.prototype.setItem = function (item, equipped, slot) {
    this._item = JsonEx.makeDeepCopy(item);
    this._equipped = equipped;
    this._slot = slot;
    this.refresh();
};

Window_EquipmentStats.prototype.makeItemStats = function (item) {
    stats = [];
    if (item) {
        // default params
        item.params.forEach((param, index) => {
            if (param !== 0) stats.push({
                code: Game_BattlerBase.TRAIT_PARAM,
                dataId: index,
                value: param
            });
        });
        // meta params
        if (item.meta.charm) stats.push({
            code: Game_BattlerBase.TRAIT_PARAM,
            dataId: Game_BattlerBase.POS_PARAM_CHARM,
            value: Number(item.meta.charm)
        });
        // xparams/sparams/states
        stats = stats.concat(item.traits.filter(trait => {
            return trait.code === Game_BattlerBase.TRAIT_STATE_RATE ||
                trait.code === Game_BattlerBase.TRAIT_PARAM ||
                trait.code === Game_BattlerBase.TRAIT_XPARAM ||
                trait.code === Game_BattlerBase.TRAIT_SPARAM
        })).concat(this._actor.metaTraits(item.meta));
    }
    return stats;
};

Window_EquipmentStats.prototype.combineItemStats = function (stats, equippedStats) {
    let result = [];
    let dupe;
    stats.forEach(stat => {
        // get stat from equipped item that is the same as checked item stat
        dupe = equippedStats.filter(eStat => {
            return eStat.code === stat.code && eStat.dataId === stat.dataId;
        });
        // get the difference in value for the items stat (stat taken from checked item if equipped item doesn't affect current stat)
        stat.diff = dupe.length ? stat.value - dupe[0].value : stat.code === Game_BattlerBase.TRAIT_SPARAM ? stat.value - 1 : stat.value;
        result.push(stat);
        // remove duplicate stat from equippedStats array (so it's not checked again within this forEach loop)
        equippedStats = equippedStats.filter(eStat => {
            return eStat.code !== stat.code || eStat.dataId !== stat.dataId;
        });
    });
    // any stats remaining in equippedStats will also need to be added
    equippedStats.forEach(stat => {
        stat.diff = stat.code === Game_BattlerBase.TRAIT_SPARAM ? 1 - stat.value : -stat.value;
        stat.value = stat.code === Game_BattlerBase.TRAIT_SPARAM ? 1 : 0;
        result.push(stat);
    });
    return result;
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
    if (this._item) {
        let stats = this.makeItemStats(this._item); // stats for the hovered over item (in slot and list windows)
        if (!this._equipped) {
            let otherStats = this.makeItemStats(JsonEx.makeDeepCopy(this._actor.equips()[this._slot])); // the stats for the current equipped item
            stats = this.combineItemStats(stats, otherStats);
        }
        let noItems = Math.min(this.numberOfItems(), stats.length);
        let x = this.extraPadding();
        let y = this.titleBlockHeight() + this.extraPadding();
        for (let i = 0; i < noItems; i++) {
            let name, value, actorValue, actorNewValue;
            let percent = '';
            switch (stats[i].code) {
                case Game_BattlerBase.TRAIT_PARAM:
                    name = TextManager.param(stats[i].dataId);
                    value = stats[i].value;
                    actorValue = this._actor.param(stats[i].dataId);
                    if (!this._equipped) actorNewValue = actorValue + stats[i].diff;
                    break;
                case Game_BattlerBase.TRAIT_XPARAM:
                    name = TextManager.xparam(stats[i].dataId);
                    value = stats[i].value * 100;
                    actorValue = this._actor.displayEffects(1, stats[i].dataId);
                    if (!this._equipped) actorNewValue = actorValue + (stats[i].diff * 100);
                    percent = '%';
                    break;
                case Game_BattlerBase.TRAIT_SPARAM:
                    name = TextManager.sparam(stats[i].dataId);
                    value = ((1 - stats[i].value) * 100).toFixed(0);
                    actorValue = this._actor.displayEffects(2, stats[i].dataId);
                    if (!this._equipped) actorNewValue = Number(actorValue) - Number((stats[i].diff * 100).toFixed(0));
                    percent = '%';
                    break;
            }
            let sign = value < 0 ? '' : '+';
            this.changeTextColor(this.itemColor());
            this.drawText(name, x, y);
            this.resetTextColor();
            y += this.itemHeight();
            let text = '';
            if (this._equipped) { // the item being looked at is equipped by actor
                text = `${sign}${value}${percent}(E ${actorValue}${percent})`;
                this.drawText(text, x, y);
            } else {
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
            }
            x = this.extraPadding();
            y += this.itemHeight();
        }
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_EquipmentStats.prototype.refresh = function () {
    if (this._actor) {
        this.contents.clear();
        this.drawTitle();
        this.drawStats();
    }
};
