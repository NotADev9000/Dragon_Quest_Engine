//=============================================================================
// Dragon Quest Engine - Game Party
// DQE_Game_Party.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the party - V0.1
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
Imported.DQEng_Game_Party = true;

var DQEng = DQEng || {};
DQEng.Game_Party = DQEng.Game_Party || {};

//-----------------------------------------------------------------------------
// Game_Party
//-----------------------------------------------------------------------------

Game_Party.prototype.giveItemToActor = function (item, actor) {
    actor.giveItems(item, 1);
    this.loseItem(item, 1, false);
}

Game_Party.prototype.giveItemToActorMessage = function (item, actor) {
    return `${actor._name} took the ${item.name} from the bag.`;
}
