//=============================================================================
// Dragon Quest Engine - Game CharacterBase
// DQE_Game_CharacterBase.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for CharacterBase - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Game_CharacterBase = DQEng.Game_CharacterBase || {};

//-----------------------------------------------------------------------------
// Game_CharacterBase
//-----------------------------------------------------------------------------

DQEng.Game_CharacterBase = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
    DQEng.Game_CharacterBase.call(this);
    this._moveSpeed = 5;
};
