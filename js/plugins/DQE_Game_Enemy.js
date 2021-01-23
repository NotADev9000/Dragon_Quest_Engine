//=============================================================================
// Dragon Quest Engine - Game Enemy
// DQE_Game_Enemy.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for the enemy - V0.1
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
Imported.DQEng_Game_Enemy = true;

var DQEng = DQEng || {};
DQEng.Game_Enemy = DQEng.Game_Enemy || {};

//-----------------------------------------------------------------------------
// Game_Enemy
//-----------------------------------------------------------------------------

Game_Enemy.prototype.paramBase = function (paramId) {
    return paramId <= 7 ? this.enemy().params[paramId] : this.enemy().meta.charm || 0;
};
