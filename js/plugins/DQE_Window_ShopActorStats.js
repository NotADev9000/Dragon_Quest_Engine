//=============================================================================
// Dragon Quest Engine - Window Shop Actor Stats
// DQE_Window_ShopActorStats.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for the shop's actor stat list - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_ShopActorStats = DQEng.Window_ShopActorStats || {};

//-----------------------------------------------------------------------------
// Window_ShopActorStats
//-----------------------------------------------------------------------------

function Window_ShopActorStats() {
    this.initialize.apply(this, arguments);
}

Window_ShopActorStats.prototype = Object.create(Window_Base.prototype);
Window_ShopActorStats.prototype.constructor = Window_ShopActorStats;

Window_ShopActorStats.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._index = 0;
    this._stats = null;
    this._item = null;
    this._slot = -1;
    this._twoHand = false;
    // actor values
    this._actorValue = 0;
    this._actorNewValue = 0;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ShopActorStats.prototype.standardPadding = function () {
    return 9;
};

Window_ShopActorStats.prototype.extraPadding = function () {
    return 15;
};

Window_ShopActorStats.prototype.titleBlockHeight = function () {
    return 54;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ShopActorStats.prototype.setValues = function (stats, item) {
    this._index = 0;
    this._stats = stats;
    this._item = item;
    this._slot = item.etypeId - 1;
    this._twoHand = item.meta.twoHand;
    this.refresh();
};

Window_ShopActorStats.prototype.forwardIndex = function () {
    const numStats = this.numStats();
    if (numStats > 1) {
        this._index = this._index >= numStats - 1 ? 0 : this._index + 1;
    }
    this.refresh();
};

Window_ShopActorStats.prototype.backwardIndex = function () {
    const numStats = this.numStats();
    if (numStats > 1) {
        this._index = this._index <= 0 ? numStats - 1 : this._index - 1;
    }
    this.refresh();
};

Window_ShopActorStats.prototype.numStats = function () {
    return this._stats.length;
};

Window_ShopActorStats.prototype.makeStatDiffs = function (stat, replaceStats) {
    const isSparamType = stat.code === Game_BattlerBase.TRAIT_SPARAM || stat.code === Game_BattlerBase.TRAIT_STATE_RATE; // sparam types display value differently
    let diff = isSparamType ? 1 - stat.value : stat.value; // diff is initially the new equipments value
    replaceStats.forEach(replaceStat => {
        if (stat.code === replaceStat.code && stat.dataId === replaceStat.dataId) {
            diff -= isSparamType ? 1 - replaceStat.value : replaceStat.value;
        }
    });
    return diff;
};

Window_ShopActorStats.prototype.makeActorValues = function (actor, stat) {
    let replaceStats = []; // the stats of the item(s) being replaced
    const replaceEquipment = this.getReplaceEquipment(this._twoHand, actor, this._slot); // the item(s) being replaced
    replaceEquipment.forEach(equipment => {
        replaceStats = replaceStats.concat(this.makeItemStats(equipment));
    });
    // value differences
    const diff = this.makeStatDiffs(stat, replaceStats);
    // actor values
    this._percent = '%';
    switch (stat.code) {
        case Game_BattlerBase.TRAIT_PARAM:
            this._actorValue = actor?.param(stat.dataId);
            this._actorNewValue = this._actorValue + diff;
            this._percent = '';
            break;
        case Game_BattlerBase.TRAIT_XPARAM:
            this._actorValue = actor?.displayEffects(1, stat.dataId);
            this._actorNewValue = this._actorValue + (diff * 100);
            break;
        case Game_BattlerBase.TRAIT_SPARAM:
            this._actorValue = actor?.displayEffects(2, stat.dataId);
            this._actorNewValue = Number(this._actorValue) + Number((diff * 100).toFixed(0));
            break;
        case Game_BattlerBase.TRAIT_STATE_RATE:
            this._actorValue = actor?.displayEffects(3, stat.dataId);
            this._actorNewValue = Number(this._actorValue) + Number((diff * 100).toFixed(0));
            break;
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ShopActorStats.prototype.drawTitle = function () {
    const ep = this.extraPadding();
    const cw = this.contentsWidth();
    const stat = this._stats[this._index];
    // get stat name
    let name = '';
    switch (stat.code) {
        case Game_BattlerBase.TRAIT_PARAM:
            name = TextManager.param(stat.dataId);
            break;
        case Game_BattlerBase.TRAIT_XPARAM:
            name = TextManager.xparam(stat.dataId);
            break;
        case Game_BattlerBase.TRAIT_SPARAM:
            name = TextManager.sparamAbbr(stat.dataId);
            break;
        case Game_BattlerBase.TRAIT_STATE_RATE:
            name = $dataStates[stat.dataId].meta.resistName;
            break;
    }
    // draw stat name
    this.drawText(name, 0, ep, cw, 'center');
    this.drawHorzLine(0, this.titleBlockHeight() - 3);
    // draw icons
    if (this.numStats() > 1) {
        let icon = this.getHandlerIcon('previous');
        this.drawTextEx(` \\i[${icon}]`, 0, ep);
        icon = this.getHandlerIcon('next');
        let x = cw - Window_Base._iconWidth - this.textWidth(' ');
        this.drawTextEx(`\\i[${icon}] `, x, ep);
    }
};

Window_ShopActorStats.prototype.drawStats = function () {
    // draw positions
    const ep = this.extraPadding();
    const ih = this.itemHeight();
    let y = ep + this.titleBlockHeight();
    let cw, text, textWidth;
    // stats
    const stat = this._stats[this._index];
    const actors = $gameParty.members();
    actors.forEach(actor => {
        // reset contents width
        cw = this.contentsWidth();
        // actor name
        this.drawText(actor.name(), ep, y);
        // can actor equip this item
        if (actor.canEquip(this._item)) {
            text = ')';
            textWidth = this.contents.measureTextWidth(text);
            // make actor stats
            this.makeActorValues(actor, stat);
            // actor values (draw in reverse so can position colored text properly)
            // )
            this.drawText(text, 0, y, cw, 'right');
            cw -= textWidth;
            // actor new value
            text = `${this._actorNewValue}${this._percent}`;
            textWidth = this.contents.measureTextWidth(text);
            this.changeTextColor(this.paramchangeTextColor(this._actorNewValue - this._actorValue));
            this.drawText(text, 0, y, cw, 'right');
            this.resetTextColor();
            cw -= textWidth;
            // actor current value
            text = `(${this._actorValue}${this._percent} > `;
            this.drawText(text, 0, y, cw, 'right');
        } else {
            cw -= ep;
            text = '-';
            this.drawText(text, 0, y, cw, 'right');
        }
        // update y position
        y += ih;
    });
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ShopActorStats.prototype.refresh = function () {
    if (this._stats) {
        this.contents.clear();
        this.drawTitle();
        this.drawStats();
    }
};
