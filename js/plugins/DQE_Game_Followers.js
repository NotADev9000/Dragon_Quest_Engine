//=============================================================================
// Dragon Quest Engine - Game Followers
// DQE_Game_Followers.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the Followers - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Game_Followers = DQEng.Game_Followers || {};

//-----------------------------------------------------------------------------
// Game_Followers
//-----------------------------------------------------------------------------

Game_Followers.prototype.updateMove = function (force = false) {
    if (!$gameSwitches.value(DQEng.Parameters.Game_System.SeperateFollowersSwitch) || force) {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
            this._data[i].chaseCharacter(precedingCharacter);
        }
    }
};
