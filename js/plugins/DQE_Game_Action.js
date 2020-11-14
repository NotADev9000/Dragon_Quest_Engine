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

var parameters = PluginManager.parameters('DQE_Windows');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_Action = {};
DQEng.Parameters.Game_Action.nothingHappensSkillId = Number(parameters["Nothing Happens Skill ID"]) || 3;

//-----------------------------------------------------------------------------
// Game_Action
//-----------------------------------------------------------------------------
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

Game_Action.prototype.isForOpponent = function () {
    return this.checkItemScope([1, 2, 3, 4, 5, 6, 12]);
};

Game_Action.prototype.isForGroup = function () {
    return this.checkItemScope([12]);
};

Game_Action.prototype.needsSelection = function () {
    return this.checkItemScope([1, 7, 9, 12]);
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

Game_Action.prototype.apply = function (target) {
    var result = target.result();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            var value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function (effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};
