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
Window_ItemActorStat.STAT_EVASION = 14;
Window_ItemActorStat.STAT_CRIT = 15;
Window_ItemActorStat.STAT_BLOCK = 16;
Window_ItemActorStat.STAT_CRITBLOCK = 17;
Window_ItemActorStat.STAT_MPCOST = 18;

Window_ItemActorStat.prototype = Object.create(Window_Base.prototype);
Window_ItemActorStat.prototype.constructor = Window_ItemActorStat;

Window_ItemActorStat.prototype.initialize = function (x, y) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this._stat = -1;
    this._actorIndex = -1;
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

    if (effect) {
        if (action.isEffectBuffGrow(effect)) {
            switch (effect.dataId) {
                case 0:
                    this._stat = Window_ItemActorStat.STAT_HP;
                    break;
                case 1:
                    this._stat = Window_ItemActorStat.STAT_MP;
                    break;
                case 2:
                    this._stat = Window_ItemActorStat.ATTACK;
                    break;
            }
        }
    } else if (action.isHpEffect()) {
        this._stat = Window_ItemActorStat.STAT_HP;
    } else if (action.isMpEffect()) {
        this._stat = Window_ItemActorStat.STAT_MP;
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ItemActorStat.prototype.drawStats = function () {
    const actor = $gameParty.allMembers()[this._actorIndex];
    const ep = this.extraPadding();
    const tw = this.textWidth();
    let stat, value = '';
    switch (this._stat) {
        case Window_ItemActorStat.STAT_HP:
            stat = TextManager.basic(2);
            value = `${actor.hp.toString()}/${actor.mhp}`;
            break;
        case Window_ItemActorStat.STAT_MP:
            stat = TextManager.basic(4);
            value = `${actor.mp.toString()}/${actor.mmp}`;
            break;
        case Window_ItemActorStat.STAT_ATTACK:
            stat = TextManager.param(2);
            value = actor.atk.toString();
            break;
    }
    this.changeTextColor(this.hpColor(actor));
    this.drawText(stat, ep, ep, tw, 'center');
    this.drawHorzLine(0, 51);
    this.drawText(value, ep, 69, tw, 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ItemActorStat.prototype.refresh = function () {
    if (this._stat >= 0) {
        this.contents.clear();
        this.drawStats();
    }
};
