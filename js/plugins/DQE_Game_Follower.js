//=============================================================================
// Dragon Quest Engine - Game Follower
// DQE_Game_Follower.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the Follower - V0.1
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
Imported.DQEng_Game_Follower = true;

var DQEng = DQEng || {};
DQEng.Game_Follower = DQEng.Game_Follower || {};

//-----------------------------------------------------------------------------
// Game_Follower
//-----------------------------------------------------------------------------

Game_Follower.prototype.refresh = function () {
    var actor = this.actor();
    if (actor && actor.isDead()) {
        this.setImage('Protags1_DQ3', 4);
    } else {
        var characterName = this.isVisible() ? actor.characterName() : '';
        var characterIndex = this.isVisible() ? actor.characterIndex() : 0;
        this.setImage(characterName, characterIndex);
    }
};
