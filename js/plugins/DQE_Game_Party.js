//=============================================================================
// Dragon Quest Engine - Game Party
// DQE_Game_Party.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the party - V0.1
*
* @param Preferred Member
* @desc Actor ID of party member who is given priority in certain situations. e.g. revived when party is wiped out, chosen as the leader in cutscenes
* @default 1
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

var parameters = PluginManager.parameters('DQE_Game_Party');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_Party = {};
DQEng.Parameters.Game_Party.PreferredMember = Number(parameters["Preferred Member"]) || 1;

//-----------------------------------------------------------------------------
// Game_Party
//-----------------------------------------------------------------------------

DQEng.Game_Party.initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function () {
    DQEng.Game_Party.initialize.call(this);
    this._restorePoint = new Game_RestorePoint();
};

//////////////////////////////
// Functions - items
//////////////////////////////

Game_Party.prototype.giveItemToActor = function (item, actor, index, amount = 1) {
    actor.giveItems(item, amount, index);
    this.loseItem(item, amount, false);
};

Game_Party.prototype.giveItemToActorMessage = function (item, actor) {
    return `${actor._name} takes the ${item.name} from the bag.`;
};

Game_Party.prototype.giveItemToActorAndEquipMessage = function (item, actor) {
    return `${actor._name} takes the ${item.name} from the bag and equips it.`;
};

Game_Party.prototype.giveMultipleItemsToActorMessage = function (item, actor, amount) {
    return `${actor._name} takes ${amount} ${item.name}s from the bag.`;
};

//////////////////////////////
// Functions - battle
//////////////////////////////

Game_Party.prototype.onBattleStart = function () {
    this.allMembers().forEach(function (member) {
        member.onBattleStart();
    });
    this._inBattle = true;
};

Game_Party.prototype.onBattleEnd = function () {
    this._inBattle = false;
    this.allMembers().forEach(function (member) {
        member.onBattleEnd();
    });
};

Game_Party.prototype.makeActions = function () {
    this.allMembers().forEach(function (member) {
        member.makeActions();
    });
};

//////////////////////////////
// Functions - line-up
//////////////////////////////

Game_Party.prototype.attemptSwap = function (index1, index2) {
    let frontline = Object.assign([], $gameParty.frontline());
    let swapWith = $gameParty.allMembers()[index2];
    frontline[index1] = swapWith;

    return frontline.some(actor => actor.isAlive());
};

/**
 * Checks if the passed array of actor indexes have at least
 * one living actor in the frontline
 */
Game_Party.prototype.checkGroupOrder = function (array) {
    let frontlineInd = array.slice().splice(0, 4);
    return frontlineInd.some(index => 
        $gameParty.allMembers()[index].isAlive()
    );
};

/**
 * takes an array of character positions and converts them to
 * the character indexes and then sets that as the party order
 * 
 * @param {array} list an array of character positions
 */
Game_Party.prototype.swapAll = function (list) {
    var actorIds = [];
    list.forEach((element) => {
        actorIds.push($gameParty.allMembers()[element]._actorId);
    });
    this._actors = actorIds;
    $gamePlayer.refresh();
};

//////////////////////////////
// Functions - actors
//////////////////////////////

Game_Party.prototype.revivePreferredMember = function () {
    let preferId = DQEng.Parameters.Game_Party.PreferredMember;
    this.allMembers().forEach(actor => {
        if (actor.actorId() === preferId && actor.isDead()) actor.setHp(1);
    });
    $gamePlayer.refresh();
};

//////////////////////////////
// Functions - restore point
//////////////////////////////

Game_Party.prototype.restorePoint = function () {
    return this._restorePoint;
};

Game_Party.prototype.setRestorePoint = function (mapId, x, y, dir) {
    let restorePoint = this.restorePoint();
    restorePoint.mapId = mapId;
    restorePoint.x = x;
    restorePoint.y = y;
    restorePoint.direction = dir;
};
