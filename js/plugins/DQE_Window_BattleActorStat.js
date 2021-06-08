//=============================================================================
// Dragon Quest Engine - Window Battle Actor Stat
// DQE_Window_BattleActorStat.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying party members stats in battle - V0.1
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
Imported.DQEng_Window_BattleActorStat = true;

var DQEng = DQEng || {};
DQEng.Window_BattleActorStat = DQEng.Window_BattleActorStat || {};

//-----------------------------------------------------------------------------
// Window_BattleActorStat
//-----------------------------------------------------------------------------

function Window_BattleActorStat() {
    this.initialize.apply(this, arguments);
}

Window_BattleActorStat.prototype = Object.create(Window_ItemActorStat.prototype);
Window_BattleActorStat.prototype.constructor = Window_BattleActorStat;

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_BattleActorStat.prototype.windowWidth = function () {
    return 297;
};

Window_BattleActorStat.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

Window_BattleActorStat.prototype.standardPadding = function () {
    return 24;
};

Window_BattleActorStat.prototype.extraPadding = function () {
    return 0;
};

Window_BattleActorStat.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

Window_BattleActorStat.prototype.numVisibleRows = function () {
    return this.maxItems();
};

Window_BattleActorStat.prototype.maxItems = function () {
    return $gameParty.battleMembers().length;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_BattleActorStat.prototype.prepDrawItems = function () {
    // set values
    let param = this._stat[1];
    switch (this._stat[0]) {
        case Game_BattlerBase.TRAIT_PARAM:
            this._statValue = '000/000';
            if (param === 0) {
                this._statName = TextManager.basic(2);
            } else if (param === 1) {
                this._statName = TextManager.basic(4);
            } else {
                this._statName = TextManager.param(param);
                this._statValue = '000';
            }
            break;
        case Game_BattlerBase.TRAIT_UPARAM:
            this._statName = TextManager.baseparam(param - 7);
            this._statValue = '000';
            break;
        case Game_BattlerBase.TRAIT_XPARAM:
            this._statName = TextManager.xparam(param);
            this._statValue = '000%';
            break;
        case Game_BattlerBase.TRAIT_SPARAM:
            this._statName = TextManager.sparam(param);
            this._statValue = '000%';
            break;
        case Game_BattlerBase.TRAIT_STATE_RATE:
            this._statName = $dataStates[param].name.toUpperCase();
            this._statValue = 'Yes';
            break;
        default:
            this._statName = '';
            this._statValue = '';
            break;
    }
    this._statName += ': ';
    this.width = Math.max(this.windowWidth(), this.contents.measureTextWidth(this._statName + this._statValue) + ((this.standardPadding() + this.extraPadding()) * 2));
};

Window_BattleActorStat.prototype.drawStats = function () {
    const tw = this.textWidth();
    let value = this._statValue;
    let type = this._stat[0];
    let param = this._stat[1];
    let y;
    $gameParty.battleMembers().forEach((actor, index) => {
        switch (type) {
            case Game_BattlerBase.TRAIT_PARAM:
                if (param === 0) {
                    value = `${actor.hp.toString().padStart(3, ' ')}/${actor.mhp}`;
                } else if (param === 1) {
                    value = `${actor.mp.toString().padStart(3, ' ')}/${actor.mmp}`;
                } else {
                    value = actor.param(param);
                }
                break;
            case Game_BattlerBase.TRAIT_UPARAM:
                value = actor.uparam(param);
                break;
            case Game_BattlerBase.TRAIT_XPARAM:
                value = `${actor.displayEffects(1, param)}%`;
                break;
            case Game_BattlerBase.TRAIT_SPARAM:
                value = `${actor.displayEffects(2, param)}%`;
                break;
            case Game_BattlerBase.TRAIT_STATE_RATE:
                value = actor.isStateAffected(param) ? `Yes` : `No`;
                break;
            default:
                value = ``;
                break;
        }
        if (type === Game_BattlerBase.TRAIT_STATE_RATE) this.changeTextColor(this.textColor($dataStates[param].meta.color));
        y = index * this.itemHeight();
        this.drawText(this._statName, 0, y);
        this.resetTextColor();
        this.drawText(value, 0, y, tw, 'right');
    });
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
