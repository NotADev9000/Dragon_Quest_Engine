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

Game_Follower.prototype.memberIndex = function () {
    return this._memberIndex;
};

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

Game_Follower.prototype.update = function () {
    Game_Character.prototype.update.call(this);
    if (!$gameSwitches.value(DQEng.Parameters.Game_System.SeperateFollowersSwitch)) {
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
        this.setOpacity($gamePlayer.opacity());
        this.setBlendMode($gamePlayer.blendMode());
        this.setWalkAnime($gamePlayer.hasWalkAnime());
        this.setStepAnime($gamePlayer.hasStepAnime());
        this.setDirectionFix($gamePlayer.isDirectionFixed());
        this.setTransparent($gamePlayer.isTransparent());
    }
};

Game_Follower.prototype.chaseCharacter = function (character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (sx !== 0 && sy !== 0) {
        this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    } else if (sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
    }
    if (!$gameSwitches.value(DQEng.Parameters.Game_System.SeperateFollowersSwitch)) this.setMoveSpeed($gamePlayer.realMoveSpeed());
};

Game_Follower.prototype.chasePrecedingCharacter = function () {
    const precedingChar = $gamePlayer.followers().follower(this.memberIndex() - 2);
    this.chaseCharacter(precedingChar);
};
