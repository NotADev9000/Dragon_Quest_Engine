//=============================================================================
// Dragon Quest Engine - Window Item Actor Stat
// DQE_Window_ItemActorStat.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying party members stats in the item menu - V0.1
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
Imported.DQEng_Window_ItemActorStat = true;

var DQEng = DQEng || {};
DQEng.Window_ItemActorStat = DQEng.Window_ItemActorStat || {};

//-----------------------------------------------------------------------------
// Window_ItemActorStat
//-----------------------------------------------------------------------------

function Window_ItemActorStat() {
    this.initialize.apply(this, arguments);
}

Window_ItemActorStat.STAT_HP = 0;
Window_ItemActorStat.STAT_MP = 1;
Window_ItemActorStat.STAT_ATTACK = 2;
Window_ItemActorStat.STAT_DEFENCE = 3;
Window_ItemActorStat.STAT_MMIGHT = 4;
Window_ItemActorStat.STAT_MMEND = 5;
Window_ItemActorStat.STAT_AGILITY = 6;
Window_ItemActorStat.STAT_DEFTNESS = 7;
Window_ItemActorStat.STAT_CHARM = 8;
Window_ItemActorStat.STAT_STRENGTH = 9;
Window_ItemActorStat.STAT_RESILIENCE = 10;
Window_ItemActorStat.STAT_PHYRES = 11;
Window_ItemActorStat.STAT_MAGRES = 12;
Window_ItemActorStat.STAT_BRERES = 13;
Window_ItemActorStat.STAT_MPCOST = 14;
Window_ItemActorStat.STAT_EVASION = 15;
Window_ItemActorStat.STAT_CRIT = 16;
Window_ItemActorStat.STAT_BLOCK = 17;
Window_ItemActorStat.STAT_CRITBLOCK = 18;

Window_ItemActorStat.prototype = Object.create(Window_Base.prototype);
Window_ItemActorStat.prototype.constructor = Window_ItemActorStat;

Window_ItemActorStat.prototype.initialize = function (x, y) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this._actorIndex = -1;  // index of actor
    this._actor;
    this._stat = [];        // type of stat to display, 0=type, 1=param
    this._statName;
    this._statValue;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ItemActorStat.prototype.windowWidth = function () {
    return 264;
};

Window_ItemActorStat.prototype.windowHeight = function () {
    return 123;
};

Window_ItemActorStat.prototype.standardPadding = function () {
    return 9;
};

Window_ItemActorStat.prototype.extraPadding = function () {
    return 15;
};

Window_ItemActorStat.prototype.textWidth = function () {
    return this.contentsWidth() - (this.extraPadding() * 2);
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ItemActorStat.prototype.setCategory = function (category) {
    if (this._actorIndex !== category) {
        this._actorIndex = category;
        this._actor = $gameParty.allMembers()[this._actorIndex];
        this.refresh();
    }
};

Window_ItemActorStat.prototype.setAction = function (action) {
    this.setStat(action);
    this.refresh();
};

Window_ItemActorStat.prototype.setStat = function (action) {
    const item = action.item();
    const effect = item.effects.concat(action.metaEffects(item.meta))[0];

    // get types
    if (effect) {
        if (action.isEffectStat(effect)) {
            this._stat[0] = Game_BattlerBase.TRAIT_STATE_RATE;
            this._stat[1] = effect.dataId;
        } else if (action.isEffectBuffGrow(effect)) {
            this._stat[0] = this._actor.buffIdToParamType(effect.dataId);
            this._stat[1] = this._actor.buffIdToParamId(effect.dataId);
        }
    } else if (action.isHpEffect()) {
        this._stat[0] = Game_BattlerBase.TRAIT_PARAM;
        this._stat[1] = 0;
    } else if (action.isMpEffect()) {
        this._stat[0] = Game_BattlerBase.TRAIT_PARAM;
        this._stat[1] = 1;
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ItemActorStat.prototype.prepDrawItems = function () {
    // set values
    let param = this._stat[1];
    switch (this._stat[0]) {
        case Game_BattlerBase.TRAIT_PARAM:
            this._statName = param === 0 ? TextManager.basic(2) : param === 1 ? TextManager.basic(4) : TextManager.param(param);
            this._statValue = this._actor.param(param);
            break;
        case Game_BattlerBase.TRAIT_UPARAM:
            this._statName = TextManager.baseparam(param - 7);
            this._statValue = this._actor.uparam(param);
            break;
        case Game_BattlerBase.TRAIT_XPARAM:
            this._statName = TextManager.xparam(param);
            this._statValue = `${this._actor.displayEffects(1, param)}%`;
            break;
        case Game_BattlerBase.TRAIT_SPARAM:
            this._statName = TextManager.sparam(param);
            this._statValue = `${this._actor.displayEffects(2, param)}%`;
            break;
        case Game_BattlerBase.TRAIT_STATE_RATE:
            this._statName = $dataStates[param].name.toUpperCase();
            this._statValue = this._actor.isStateAffected(param) ? `Yes` : `No`;
            break;
        default:
            this._statName = '';
            this._statValue = '';
            break;
    }

    this.width = Math.max(this.windowWidth(), this.contents.measureTextWidth(this._statName) + ((this.standardPadding() + this.extraPadding()) * 2));
};

Window_ItemActorStat.prototype.drawStats = function () {
    const ep = this.extraPadding();
    const tw = this.textWidth();
    if (this._stat[0] === Game_BattlerBase.TRAIT_STATE_RATE) this.changeTextColor(this.textColor($dataStates[this._stat[1]].meta.color));
    this.drawText(this._statName, ep, ep, tw, 'center');
    this.resetTextColor();
    this.drawHorzLine(0, 51);
    this.drawText(this._statValue, ep, 69, tw, 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ItemActorStat.prototype.refresh = function () {
    if (this._stat.length) {
        this.prepDrawItems();
        this.createContents();
        this.drawStats();
    }
};
