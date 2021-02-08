//=============================================================================
// Dragon Quest Engine - Game Player
// DQE_Game_Player.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the Player - V0.1
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
Imported.DQEng_Game_Player = true;

var DQEng = DQEng || {};
DQEng.Game_Player = DQEng.Game_Player || {};

//-----------------------------------------------------------------------------
// Game_Player
//-----------------------------------------------------------------------------

/**
 * Refreshes the character sprites for the party
 * 
 * This will display alive members in front of dead members regardless
 * of party line-up (line-up will stay the same only the sprites change.)
 * Dead members are displayed with a coffin sprite
 */
Game_Player.prototype.refresh = function () {
    let aliveFL = $gameParty.aliveFrontline();
    if (!$gameParty.inBattle() && !$gameParty.isAllDead() && aliveFL.length === 0) { // frontline all dead so backline should be swapped in
        $gameParty.swapFlWithBl();
        $gameMessage.add(TextManager.backup);
    } else {
        // the game character objects for the frontline party members
        var frontline = [this].concat(this._followers._data);
        // the game battler objects for the frontline party members ORGANISED with the alive members first
        var organisedFL = aliveFL.concat($gameParty.deadFrontline());
    
        frontline.forEach((member, index) => {
            orgMember = organisedFL[index];
            if (orgMember && orgMember.isDead()) {
                member.setImage('Protags1_DQ3', 4);
            } else {
                let charName = orgMember ? orgMember.characterName() : '';
                let charIndex = orgMember ? orgMember.characterIndex() : 0;
                member.setImage(charName, charIndex);
            }
        });
    }
};
