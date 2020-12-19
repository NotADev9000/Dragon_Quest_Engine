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

Game_BattlerBase.prototype.isRestricted = function () {
    return this.isAppeared() && this.restriction() > 0 && this.restriction() !== DQEng.Parameters.Game_Action.cursedRestriction;
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

Game_BattlerBase.prototype.restriction = function () {
    return Math.max.apply(null, this.states().map(function (state) {
        return Number(state.meta.restriction) || state.restriction;
    }).concat(0));
};

Game_BattlerBase.prototype.meetsItemConditions = function (item) {
    return this.meetsUsableItemConditions(item);
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
