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

//-----------------------------------------------------------------------------
// Game_BattlerBase
//-----------------------------------------------------------------------------

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

Game_BattlerBase.prototype.meetsItemConditions = function (item) {
    return this.meetsUsableItemConditions(item);
};
