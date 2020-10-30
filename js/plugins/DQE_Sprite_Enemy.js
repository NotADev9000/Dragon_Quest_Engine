//=============================================================================
// Dragon Quest Engine - Sprite Enemy
// DQE_Sprite_Enemy.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The sprite object class for the enemy - V0.1
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
Imported.DQEng_Sprite_Enemy = true;

var DQEng = DQEng || {};
DQEng.Sprite_Enemy = DQEng.Sprite_Enemy || {};

//-----------------------------------------------------------------------------
// Sprite_Enemy
//-----------------------------------------------------------------------------

Sprite_Enemy.prototype.startInstantCollapse = function () {
    this._effectDuration = 1;
    this._appeared = false;
};

Sprite_Enemy.prototype.damageOffsetY = function () {
    return -(this.height + 15);
};
