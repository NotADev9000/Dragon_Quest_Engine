//=============================================================================
// Dragon Quest Engine - Game Battler Base
// DQE_Game_BattlerBase.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass of Game_Battler. It mainly contains parameters calculation. - V0.1
*
*
* @param Self Stun Skill ID
* @desc the skill ID for the self stun skill (for confusion). Default: 18.
* @default 18
*
* @param Stare Skill ID
* @desc the skill ID for the stare skill (for confusion/beguile). Default: 19.
* @default 19
*
* @param Whistle Skill ID
* @desc the skill ID for the whistle skill (for confusion/beguile). Default: 20.
* @default 20
*
* @param Laugh Skill ID
* @desc the skill ID for the laugh skill (for confusion). Default: 21.
* @default 21
*
* @param Grin Skill ID
* @desc the skill ID for the grin skill (for beguile). Default: 22.
* @default 22
*
* @param Cursed Stun Skill ID
* @desc the skill ID for the cursed stun skill. Default: 23.
* @default 23
*
* @param Cursed HP Skill ID
* @desc the skill ID for the cursed HP skill. Default: 24.
* @default 24
*
* @param Cursed MP Skill ID
* @desc the skill ID for the cursed MP skill. Default: 25.
* @default 25
*
* @param Cursed Death Skill ID
* @desc the skill ID for the cursed Death skill. Default: 26.
* @default 26
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_BattlerBase = true;

var DQEng = DQEng || {};
DQEng.Game_BattlerBase = DQEng.Game_BattlerBase || {};

var parameters = PluginManager.parameters('DQE_Game_BattlerBase');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_BattlerBase = {};
DQEng.Parameters.Game_BattlerBase.selfStunSkillId = Number(parameters["Self Stun Skill ID"]) || 18;
DQEng.Parameters.Game_BattlerBase.stareSkillId = Number(parameters["Stare Skill ID"]) || 19;
DQEng.Parameters.Game_BattlerBase.whistleSkillId = Number(parameters["Whistle Skill ID"]) || 20;
DQEng.Parameters.Game_BattlerBase.laughSkillId = Number(parameters["Laugh Skill ID"]) || 21;
DQEng.Parameters.Game_BattlerBase.grinSkillId = Number(parameters["Grin Skill ID"]) || 22;
DQEng.Parameters.Game_BattlerBase.cursedStunSkillId = Number(parameters["Cursed Stun Skill ID"]) || 23;
DQEng.Parameters.Game_BattlerBase.cursedHPSkillId = Number(parameters["Cursed HP Skill ID"]) || 24;
DQEng.Parameters.Game_BattlerBase.cursedMPSkillId = Number(parameters["Cursed MP Skill ID"]) || 25;
DQEng.Parameters.Game_BattlerBase.cursedDeathSkillId = Number(parameters["Cursed Death Skill ID"]) || 26;

//-----------------------------------------------------------------------------
// Game_BattlerBase
//-----------------------------------------------------------------------------

//////////////////////////////
// Functions - data
//////////////////////////////

// buffChangeRate Array (TODO: move to $data var)
Game_BattlerBase.PARAM_BUFFRATES = [
    { '-2': 0.5, '-1': 0.75, '1': 1.25, '2': 1.5 }, // Max HP
    { '-2': 0.5, '-1': 0.75, '1': 1.25, '2': 1.5 }, // Max MP
    { '-2': 0.5, '-1': 0.75, '1': 1.25, '2': 1.5 }, // Attack
    { '-2': 0.25, '-1': 0.5, '1': 1.5, '2': 2 }, // Defense
    { '-2': 0.5, '-1': 0.75, '1': 1.25, '2': 1.5 }, // Magical Might
    { '-2': 0.5, '-1': 0.75, '1': 1.25, '2': 1.5 }, // Magical Mending
    { '-2': 0.2, '-1': 0.4, '1': 1.2, '2': 1.4 }, // Agility
    { '-2': 0.5, '-1': 0.75, '1': 1, '2': 1 }, // Deftness
    { '-2': 0.5, '-1': 0.75, '1': 1.25, '2': 1.5 } // Charm
];
Game_BattlerBase.SPARAM_BUFFRATES = [
    {},
    {},
    {},
    {},
    {},
    {},
    { '-2': 1.5, '-1': 1.25, '1': 0.75, '2': 0.5 }, // Physical Damage
    { '-2': 1.5, '-1': 1.25, '1': 0.5, '2': 0.25 }, // Magic Damage
    {},
    { '-2': 1.5, '-1': 1.25, '1': 0.5, '2': 0.25 }, // Breath Damage
];
// where in the _buffs array params end
Game_BattlerBase.BUFFLIST_PARAM_END = 8;
Game_BattlerBase.BUFFLIST_SPARAM_END = 11;
// position of certain sp/ex/params in buff array
Game_BattlerBase.BUFFLIST_PARAM_CHARM = 8;
Game_BattlerBase.BUFFLIST_SPARAM_PHYDMG = 9;
Game_BattlerBase.BUFFLIST_SPARAM_MAGDMG = 10;
Game_BattlerBase.BUFFLIST_SPARAM_BREDMG = 11;
// position of sp/ex/params in their respective lists
Game_BattlerBase.POS_PARAM_CHARM = 8;
Game_BattlerBase.POS_XPARAM_BLOCKRATE = 10;
Game_BattlerBase.POS_XPARAM_CRITBLOCKRATE = 11;
Game_BattlerBase.POS_SPARAM_BREDMG = 10;

Object.defineProperties(Game_BattlerBase.prototype, {
    // STRength
    str: { get: function () { return this.paramBasePermPlus(2); }, configurable: true },
    // RESilience
    res: { get: function () { return this.paramBasePermPlus(3); }, configurable: true },
    // CHarM
    chm: { get: function () { return this.param(Game_BattlerBase.POS_PARAM_CHARM); }, configurable: true },
    // BLock Rate
    blr: { get: function () { return this.xparam(Game_BattlerBase.POS_XPARAM_BLOCKRATE); }, configurable: true },
    // Crit Block Rate
    cbr: { get: function () { return this.xparam(Game_BattlerBase.POS_XPARAM_CRITBLOCKRATE); }, configurable: true },
    // Breath Damage Rate
    bdr: { get: function () { return this.sparam(Game_BattlerBase.POS_SPARAM_BREDMG); }, configurable: true },
});

//////////////////////////////
// Functions - buffs
//////////////////////////////

Game_BattlerBase.prototype.clearBuffs = function () {
    /*
        HP, 
        MP, 
        Attack, 
        Defense, 
        Magical Might, 
        Magical Mending, 
        Agility, 
        Deftness, 
        Charm,

        Physical Dmg, 
        Magic Dmg, 
        Breath Dmg
    */
    this._buffs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
};

Game_BattlerBase.prototype.increaseBuff = function (paramId) {
    if (!this.isMaxBuffAffected(paramId)) {
        this._buffs[paramId]++;
        this._result.buffDifferences[paramId]++;
    }
};

Game_BattlerBase.prototype.decreaseBuff = function (paramId) {
    if (!this.isMaxDebuffAffected(paramId)) {
        this._buffs[paramId]--;
        this._result.buffDifferences[paramId]--;
    }
};

//////////////////////////////
// Functions - parameters
//////////////////////////////

Game_BattlerBase.prototype.clearParamPlus = function () {
    this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0];
};

Game_BattlerBase.prototype.paramMax = function (paramId) {
    return 999;
};

/**
 * returns the absolute base of a parameter + any permanent buffs
 * permanent buffs = seeds or skill tree boosts but NOT moves like oomph or equipment
 * 
 * @param {number} paramId id of parameter to return
 */
Game_BattlerBase.prototype.paramBasePermPlus = function (paramId) {
    let value = this.paramBase(paramId) + Game_Battler.prototype.paramPlus.call(this, paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_BattlerBase.prototype.paramBuffRate = function (paramId) {
    let buffAmount = this._buffs[paramId];
    if (buffAmount === 0) return 1;
    return Game_BattlerBase.PARAM_BUFFRATES[paramId][buffAmount];
};

Game_BattlerBase.prototype.sparamBuffRate = function (sparamId) {
    let buffId = this.sparamIdToBuffId(sparamId);
    let buffAmount = this._buffs[buffId];
    if (buffAmount === 0 || buffId === 0) return 1;
    return Game_BattlerBase.SPARAM_BUFFRATES[sparamId][buffAmount];
};

Game_BattlerBase.prototype.sparam = function (sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId) * this.sparamBuffRate(sparamId);
};

/**
 * returns the type and id of parameters/state rates that are changed for battler
 */
Game_BattlerBase.prototype.changedEffects = function () {
    let effects = [];
    // xparam
    for (i = 1; i < 11; i++) {
        if (this.xparam(i) !== 0) effects.push([1, i]);
    }
    // sparam
    for (i = 0; i < 10; i++) {
        if (this.sparam(i) !== 1) effects.push([2, i]); 
    }
    // state rates
    for (i = 1; i < $dataStates.length; i++) {
        if (this.stateRate(i) !== 1) effects.push([3, i]);
    }
    return effects;
};

/**
 * return the values of parameters but in a displayable format
 * e.g. if battler evasion is 0.05 then this function returns 5 (%)
 */
Game_BattlerBase.prototype.displayEffects = function (type, id) {
    switch (type) {
        case 1: // xparams
            return this.xparam(id) * 100;
        case 2: // sparams
            return ((1 - this.sparam(id)) * 100).toFixed(0);
        case 3: // states
            return ((1 - this.stateRate(id)) * 100).toFixed(0);
        default: // param rates
            break;
    }
};

//////////////////////////////
// Functions - traits
//////////////////////////////

Game_BattlerBase.prototype.allTraits = function () {
    return this.traitObjects().reduce(function (r, obj) {
        return r.concat(obj.traits)
                .concat(Game_BattlerBase.prototype.metaTraits(obj.meta));
    }, []);
};

Game_BattlerBase.prototype.metaTraits = function (meta) {
    let traits = [];
    if (meta.traits) {
        let notes = meta.traits.split('/');
        notes.forEach(trait => {
            let properties = trait.split(' ');
            let code;
            let dataId; // position in sp/ex-parameter list

            switch (properties[0]) {
                case 'xparam': // Ex-Parameter
                    code = Game_BattlerBase.TRAIT_XPARAM;
                    break;
                default: // Sp-Parameter
                    code = Game_BattlerBase.TRAIT_SPARAM;
                    break;
            }
            switch (properties[1]) {
                case 'blr': // BLock Rate
                    dataId = Game_BattlerBase.POS_XPARAM_BLOCKRATE;
                    break;
                case 'cbr': // Crit Block Rate
                    dataId = Game_BattlerBase.POS_XPARAM_CRITBLOCKRATE;
                    break;
                default: // Breath Damage Rate
                    dataId = Game_BattlerBase.POS_SPARAM_BREDMG;
                    break;
            }
            traits.push({
                code: code,
                dataId: dataId,
                value: Number(properties[2])
            });
        });
    }
    return traits;
};

//////////////////////////////
// Functions - states
//////////////////////////////

Game_BattlerBase.prototype.isRestricted = function () {
    return this.isAppeared() && this.restriction() > 0 && this.restriction() !== DQEng.Parameters.Game_Action.cursedRestriction;
};

Game_BattlerBase.prototype.restriction = function () {
    return Math.max.apply(null, this.states().map(function (state) {
        return Number(state.meta.restriction) || state.restriction;
    }).concat(0));
};

Game_BattlerBase.prototype.canMove = function () {
    return this.isAppeared() && this.restriction() !== 4;
};

Game_BattlerBase.prototype.isExtraConfused = function () {
    return this.isAppeared() && 
        (this.restriction() === DQEng.Parameters.Game_Action.confusedRestriction ||
        this.restriction() === DQEng.Parameters.Game_Action.beguiledRestriction);
};

Game_BattlerBase.prototype.extraConfusionLevel = function () {
    return this.isExtraConfused() ? this.restriction() : 0;
};

Game_BattlerBase.prototype.isCursed = function () {
    return this.isAppeared() && this.restriction() === DQEng.Parameters.Game_Action.cursedRestriction;
};

Game_BattlerBase.prototype.updateStateTurns = function (timing = 0) {
    this.states().forEach(function (state) {
        if (this._stateTurns[state.id] > 0 && (timing === 0 || state.autoRemovalTiming === timing)) {
            this._stateTurns[state.id]--;
        }
    }, this);
};

Game_BattlerBase.prototype.mostImportantStateDisplay = function () {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        if (states[i].meta.color) {
            return states[i];
        }
    }
    return null;
};

//////////////////////////////
// Functions - equipment
//////////////////////////////

DQEng.Game_BattlerBase.slotType = Game_BattlerBase.prototype.slotType;
Game_BattlerBase.prototype.slotType = function () {
    let actor = this.actor();
    if (actor.meta.slotType) return Number(actor.meta.slotType);
    return DQEng.Game_BattlerBase.slotType.call(this);
};

/**
 * Can the battler single & dual wield?
 */
Game_BattlerBase.prototype.isAllWield = function () {
    return this.slotType() === 2;
};

//////////////////////////////
// Functions - items
//////////////////////////////

Game_BattlerBase.prototype.meetsItemConditions = function (item) {
    return this.meetsUsableItemConditions(item);
};

//////////////////////////////
// Functions - skill ids
//////////////////////////////

Game_BattlerBase.prototype.stunSelfSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.selfStunSkillId;
};

Game_BattlerBase.prototype.stareSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.stareSkillId;
};

Game_BattlerBase.prototype.whistleSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.whistleSkillId;
};

Game_BattlerBase.prototype.laughSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.laughSkillId;
};

Game_BattlerBase.prototype.grinSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.grinSkillId;
};

Game_BattlerBase.prototype.cursedStunSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.cursedStunSkillId;
};

Game_BattlerBase.prototype.cursedHPSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.cursedHPSkillId;
};

Game_BattlerBase.prototype.cursedMPSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.cursedMPSkillId;
};

Game_BattlerBase.prototype.cursedDeathSkillId = function () {
    return DQEng.Parameters.Game_BattlerBase.cursedDeathSkillId;
};

//////////////////////////////
// Functions - converting IDs
//////////////////////////////

Game_BattlerBase.prototype.sparamIdToBuffId = function (sparamId) {
    switch (sparamId) {
        case 6:
            return Game_BattlerBase.BUFFLIST_SPARAM_PHYDMG;
        case 7:
            return Game_BattlerBase.BUFFLIST_SPARAM_MAGDMG;
        case Game_BattlerBase.POS_SPARAM_BREDMG:
            return Game_BattlerBase.BUFFLIST_SPARAM_BREDMG;
        default:
            return 0; // this sparam doesn't have a buff
    }
};

/**
 * Takes the given buffId and converts it
 * to the proper sp/ex/param ID.
 * 
 * @param {number} buffId index in _buffs array
 */
Game_BattlerBase.prototype.buffIdToParamId = function (buffId) {
    switch (buffId) {
        case Game_BattlerBase.BUFFLIST_SPARAM_PHYDMG:
            return 6;
        case Game_BattlerBase.BUFFLIST_SPARAM_MAGDMG:
            return 7;
        case Game_BattlerBase.BUFFLIST_SPARAM_BREDMG:
            return Game_BattlerBase.POS_SPARAM_BREDMG;
    }
};