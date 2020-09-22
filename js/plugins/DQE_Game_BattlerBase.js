//=============================================================================
// Dragon Quest Engine - Game Battler Base
// DQE_Game_BattlerBase.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the actor base - V0.1
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

Game_BattlerBase.prototype.meetsItemConditions = function (item) {
    return this.meetsUsableItemConditions(item);
};
