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
    this._modifiedItem = null;
    this._itemIndex = -1; // index of item needs to be known when selecting from actor inventory
};

/**
 * sets the item to use in battle (or skill if an item casts one)
 * checks the meta skillId property for a skill an item should use
 * if there isn't a skillId and the item doesn't do anything a nothing skill is used
 */
Game_Action.prototype.setItem = function (item, itemIndex) {
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

Game_Action.prototype.applyGlobal = function () {
    this.item().effects && this.item().effects.forEach(function (effect) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }, this);
};
