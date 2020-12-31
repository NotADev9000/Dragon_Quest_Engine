//=============================================================================
// Dragon Quest Engine - Game Action
// DQE_Game_Action.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for an Action - V0.1
*
*
* @param Nothing Happens Skill ID
* @desc the skill ID for the items that do nothing. Default: 3.
* @default 3
* 
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_Action = true;

var DQEng = DQEng || {};
DQEng.Game_Action = DQEng.Game_Action || {};

var parameters = PluginManager.parameters('DQE_Game_Action');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_Action = {};
DQEng.Parameters.Game_Action.nothingHappensSkillId = Number(parameters["Nothing Happens Skill ID"]) || 3;
DQEng.Parameters.Game_Action.confusedRestriction = Number(parameters["Confused Restriction Level"]) || 3.1;
DQEng.Parameters.Game_Action.beguiledRestriction = Number(parameters["Beguiled Restriction Level"]) || 3.2;
DQEng.Parameters.Game_Action.cursedRestriction = Number(parameters["Cursed Restriction Level"]) || 3.01;

//-----------------------------------------------------------------------------
// Game_Action
//-----------------------------------------------------------------------------

Game_Action.HITTYPE_BREATH = 3;

DQEng.Game_Action.clear = Game_Action.prototype.clear;
Game_Action.prototype.clear = function () {
    DQEng.Game_Action.clear.call(this);
    this.clearModifiedItem();
    this._itemIndex = -1; // index of item needs to be known when selecting from actor inventory
};

Game_Action.prototype.clearModifiedItem = function () {
    this._modifiedItem = null;
};

Game_Action.prototype.setSkill = function (skillId) {
    this.clearModifiedItem();
    this._item.setObject($dataSkills[skillId]);
};

/**
 * sets the item to use in battle (or skill if an item casts one)
 * checks the meta skillId property for a skill an item should use
 * if there isn't a skillId and the item doesn't do anything a nothing skill is used
 */
Game_Action.prototype.setItem = function (item, itemIndex) {
    this.clearModifiedItem();
    var invokedSkill;
    if (item.meta.skillId) {
        invokedSkill = $dataSkills[item.meta.skillId];
        this._modifiedItem = Object.assign({}, invokedSkill);
        this._modifiedItem.mpCost = 0;
        this._modifiedItem.message1 = item.meta.message1;
        this._modifiedItem.stypeId = 0; // skill should NOT be set as skill/ability to prevent fizzle from blocking it
    } else if (DataManager.isWeapon(item) || DataManager.isArmor(item) || item.scope === 0) {
        invokedSkill = $dataSkills[DQEng.Parameters.Game_Action.nothingHappensSkillId];
        this._modifiedItem = Object.assign({}, invokedSkill);
        this._modifiedItem.name = item.name;
    } else {
        invokedSkill = item;
    }
    this._item.setObject(invokedSkill);
    this._itemIndex = itemIndex;
};

Game_Action.prototype.checkItemScope = function (list) {
    var scope = this.item().meta.scope ? Number(this.item().meta.scope) : this.item().scope;
    return list.contains(scope);
};

Game_Action.prototype.isForNothing = function () {
    return this.checkItemScope([0]);
};

Game_Action.prototype.isForOpponent = function () {
    return this.checkItemScope([1, 2, 3, 4, 5, 6, 12]);
};

Game_Action.prototype.isForGroup = function () {
    return this.checkItemScope([12]);
};

Game_Action.prototype.needsSelection = function () {
    return this.checkItemScope([1, 7, 9, 12]);
};

Game_Action.prototype.isCertainHit = function () {
    return !this.item().meta.hitType && (this.item().hitType === Game_Action.HITTYPE_CERTAIN);
};

Game_Action.prototype.isPhysical = function () {
    return !this.item().meta.hitType && (this.item().hitType === Game_Action.HITTYPE_PHYSICAL);
};

Game_Action.prototype.isMagical = function () {
    return !this.item().meta.hitType && (this.item().hitType === Game_Action.HITTYPE_MAGICAL);
};

Game_Action.prototype.isBreath = function () {
    return Number(this.item().meta.hitType) === Game_Action.HITTYPE_BREATH;
};

Game_Action.prototype.targetsForOpponents = function () {
    var targets = [];
    var unit = this.opponentsUnit();
    if (this.isForRandom()) {
        for (var i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTarget());
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            targets.push(unit.randomTarget());
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else if (this.isForGroup()) { 
        targets = unit.aliveGroup(unit.group(this._targetIndex)).enemies;
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

Game_Action.prototype.setStunSelf = function () {
    this.setSkill(this.subject().stunSelfSkillId());
};

Game_Action.prototype.setRandomGoof = function (level) {
    let chance = Math.randomInt(100);

    if (chance <= 33) {
        this.setSkill(this.subject().stareSkillId());
    } else if (chance <= 66) {
        this.setSkill(this.subject().whistleSkillId());
    } else {
        level === DQEng.Parameters.Game_Action.confusedRestriction ? this.setSkill(this.subject().laughSkillId()) : this.setSkill(this.subject().grinSkillId());
    }
};

Game_Action.prototype.setExtraConfusion = function () {
    let chance = Math.randomInt(100)+1;
    let confusionLevel = this.subject().extraConfusionLevel();

    if (chance <= 50) {
        this.setAttack();
    } else if (chance <= 60 && confusionLevel === DQEng.Parameters.Game_Action.confusedRestriction) {
        this.setStunSelf();
    } else {
        this.setRandomGoof(confusionLevel);
    }
};

Game_Action.prototype.setCursed = function () {
    let chance = Math.randomInt(100) + 1;

    if (chance <= 10) { // death
        this.setSkill(this.subject().cursedDeathSkillId());
    } else if (chance <= 30) { // stare into space
        this.setSkill(this.subject().stareSkillId());
    } else if (chance <= 50) { // half hp
        this.setSkill(this.subject().cursedHPSkillId());
    } else if (chance <= 70) { // half mp
        this.setSkill(this.subject().cursedMPSkillId());
    } else { // cursed stun
        this.setSkill(this.subject().cursedStunSkillId());
    }
};

Game_Action.prototype.prepare = function () {
    if (!this._forcing) {
        if (this.subject().isConfused()) {
            this.setConfusion();
        } else if (this.subject().isExtraConfused()) {
            this.setExtraConfusion();
        } else if (this.subject().isCursed() && Math.randomInt(2) === 0) {
            this.setCursed();
        }
    }
};

Game_Action.prototype.isValid = function () {
    return (this._forcing && this.item()) 
        || this.subject().canUse(this.item())
        || (this._modifiedItem && this.subject().meetsSkillConditions(this._modifiedItem));
};

Game_Action.prototype.makeTargets = function () {
    var targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets = [this.confusionTarget()];
    } else if (!this._forcing && this.subject().isExtraConfused() && this.item().id === this.subject().attackSkillId()) {
        targets = [this.extraConfusionTarget()];
    } else if (this.isForOpponent()) {
        targets = this.targetsForOpponents();
    } else if (this.isForFriend()) {
        targets = this.targetsForFriends();
    }
    return this.repeatTargets(targets);
};

Game_Action.prototype.extraConfusionTarget = function () {
    switch (this.subject().extraConfusionLevel()) {
        case DQEng.Parameters.Game_Action.confusedRestriction: // random anything
            if (Math.randomInt(2) === 0) {
                return this.opponentsUnit().randomTarget();
            }
            return this.friendsUnit().randomTarget();
        case DQEng.Parameters.Game_Action.beguiledRestriction: // random ally
            return this.friendsUnit().randomTarget();
    }
};

Game_Action.prototype.itemEva = function (target) {
    if (this.isPhysical()) {
        return (1 - ((1 - this.baseEva(target.param(7))) * (1 - target.eva))).toFixed(4);
    } else if (this.isMagical()) {
        return target.mev;
    } else {
        return 0;
    }
};

/**
 * formula: base evasion = ((1.0032^agility) + 0.5)/100;
 * 
 * base evasion returned where 1 = 100% chance of evading
 * 
 * @param {number} agility of evading target
 */
Game_Action.prototype.baseEva = function (agility) {
    return ((Math.pow(1.0032, agility) + 0.5) / 100);
};

/**
 * formula: crit rate = skill modifier * (total crit rate + (deftness/20000))
 * 
 * skill modifier = each skill can modify the crit rate
 * total crit rate = subject's base crit rate + any equipment/buff/etc. bonuses
 * 
 * crit rate is returned where 1 = 100% chance of crit
 */
Game_Action.prototype.itemCri = function () {
    if (this.item().damage.critical)  {
        let itemMod = this.item().meta.critRateMod || 1;
        return itemMod * (this.subject().cri + (this.subject().param(7)/20000));
    }
    return 0;
};

/**
 * return the chance of blocking move
 * 
 * @param {Game_Battler} target 
 */
Game_Action.prototype.itemBlock = function (target) {
    if (this.isPhysical()) {
        return target.blr;
    } else {
        return 0;
    }
};

/**
 * return the chance of blocking crit
 * 
 * @param {Game_Battler} target 
 */
Game_Action.prototype.itemCritBlock = function (target) {
    return target.cbr
};

Game_Action.prototype.apply = function (target) {
    var result = target.result();
    let doesDmg = this.item().damage.type > 0;
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    result.recover = this.isRecover();
    if (result.onTarget() && doesDmg) {
        result.critical = (Math.random() < this.itemCri(target)); // is action a crit?
        let block = result.critical ? this.itemCritBlock(target) : this.itemBlock(target); // block chance depending on crit
        if (Math.random() < block) {
            result.blocked = true;
            result.critical = false; // make action non-crit if it was blocked
        }
    }
    if (result.isHit()) {
        if (doesDmg) {
            var value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        // regular effects
        this.item().effects.forEach(effect => {
            this.applyItemEffect(target, effect);
        }, this);
        // notetag effects
        this.metaEffects(this.item().meta).forEach(effect => {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};

Game_Action.prototype.metaEffects = function (meta) {
    let effects = [];
    if (meta.effectBuffs) {
        let notes = meta.effectBuffs.split('/');
        notes.forEach(effect => {
            let properties = effect.split(' ');
            let code;
            let dataId; // index position in Game_BattlerBase _buffs array

            switch (properties[0]) {
                case 'AddB': // Add Buff
                    code = Game_Action.EFFECT_ADD_BUFF;
                    break;
                case 'AddD': // Add Debuff
                    code = Game_Action.EFFECT_ADD_DEBUFF;
                    break;
                case 'RemB': // Remove Buff
                    code = Game_Action.EFFECT_REMOVE_BUFF;
                    break;
                default: // Remove Debuff
                    code = Game_Action.EFFECT_REMOVE_DEBUFF;
            }
            switch (properties[1]) {
                case 'Chrm': // Charm
                    dataId = Game_BattlerBase.BUFFLIST_PARAM_CHARM;
                    break;
                case 'Phys': // Physical Damage
                    dataId = Game_BattlerBase.BUFFLIST_SPARAM_PHYDMG;
                    break;
                case 'Magc': // Magic Damage
                    dataId = Game_BattlerBase.BUFFLIST_SPARAM_MAGDMG;
                    break;
                default: // Breath Damage
                    dataId = Game_BattlerBase.BUFFLIST_SPARAM_BREDMG;
                    break;
            }
            effects.push({
                code: code,
                dataId: dataId,
                value1: Number(properties[2]),
                value2: 0
            });
        });
    }
    return effects;
};

Game_Action.prototype.makeDamageValue = function (target, critical) {
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    let vari = item.meta.variance ? item.meta.variance : item.damage.variance;
    if (this.isPhysical()) {
        value *= target.pdr;
    } else if (this.isMagical()) {
        value *= target.mdr;
    } else if (this.isBreath()) {
        value *= target.bdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    value = this.applyVariance(value, vari);
    if (!item.meta.noMetalSave) value += this.applyMetalSave();
    if (critical) value = this.applyCritical(value);
    value = this.applyGuard(value, target);
    value = Math.floor(value);
    return value;
};

Game_Action.prototype.applyCritical = function (damage) {
    let attack = this.subject().param(3);
    let item = this.item();
    let mod = 1.2;
    let crit1 = damage * mod;

    if (item.meta.critMod) {
        let nums = item.meta.critMod.split(' ');
        attack = this.subject().param(nums[0]);
        mod = $gameSystem.randomNumMinMax(Number(nums[1]), Number(nums[2]), 2);
    } else {
        switch (item.hitType) {
            case Game_Action.HITTYPE_CERTAIN:
            case Game_Action.HITTYPE_PHYSICAL:
                mod = $gameSystem.randomNumMinMax(0.95, 1.051, 2);
                break;
            case Game_Action.HITTYPE_MAGICAL:
                attack = this.subject().param(5);
                mod = $gameSystem.randomNumMinMax(1.5, 2.001, 2);
                break;
        }
    }
    let crit2 = attack * mod;
    return Math.max(crit1, crit2);
};

Game_Action.prototype.applyVariance = function (damage, vari) {
    // vari = $gameSystem.randomNumMinMax(0, vari, 2);
    let v = damage * (vari/100);
    v *= Math.random() >= 0.5 ? 1 : -1;
    return damage + v;
};

/**
 * 50% chance to return a +1 dmg bonus (for killing metal slimes)
 */
Game_Action.prototype.applyMetalSave = function () {
    return Math.random() >= 0.5 ? 1 : 0;
};
