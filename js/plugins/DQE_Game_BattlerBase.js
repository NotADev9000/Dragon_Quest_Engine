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

Game_BattlerBase.prototype.meetsItemConditions = function (item) {
    return this.meetsUsableItemConditions(item);
};
