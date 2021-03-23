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
    this._zoomPoints = [];
    this._lastZoomPoint = {};   // last point zoomed to
    this._medalTotal = 0;       // total mini medals collected
    this._medalCurrent = 0;     // currently held mini medals
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
// Functions - mini medals
//////////////////////////////

Game_Party.prototype.medalTotal = function () {
    return this._medalTotal;
};

Game_Party.prototype.medalCurrent = function () {
    return this._medalCurrent;
};

Game_Party.prototype.gainMedal = function (amount) {
    this._medalTotal += amount;
    this._medalCurrent += amount;
};

Game_Party.prototype.loseMedal = function (amount) {
    this._medalCurrent -= amount;
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

/**
 * swaps actors at given indexes and returns false if the frontline
 * does not have 1 alive party member after the swap
 */
Game_Party.prototype.attemptSwap = function (index1, index2) {
    let frontline = Object.assign([], $gameParty.frontline());
    let swapWith = $gameParty.allMembers()[index2];
    frontline[index1] = swapWith;

    return frontline.some(actor => actor.isAlive());
};

/**
 * checks if the passed array of actor indexes have at least
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
Game_Party.prototype.newOrder = function (list) {
    var actorIds = [];
    list.forEach((element) => {
        actorIds.push($gameParty.allMembers()[element]._actorId);
    });
    this._actors = actorIds;
    $gamePlayer.refresh();
};

/**
 * swaps the frontline and backline members
 */
Game_Party.prototype.swapFlWithBl = function () {
    fl = this.frontline();
    bl = this.backline();
    let actors = this._actors = [];
    bl.concat(fl).forEach(member => {
        actors.push(member._actorId);
    });
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

Game_Party.prototype.isAllDead = function () {
    return this.allAliveMembers().length === 0;
};

Game_Party.prototype.allAliveMembers = function () {
    return this.allMembers().filter(function (member) {
        return member.isAlive();
    });
};

//////////////////////////////
// Functions - restore point
//////////////////////////////

Game_Party.prototype.restorePoint = function () {
    return this._restorePoint;
};

Game_Party.prototype.setRestorePoint = function (mapId, x, y, dir, mapName) {
    let restorePoint = this.restorePoint();
    restorePoint.mapId = mapId;
    restorePoint.mapName = mapName || $gameMap.displayName();
    restorePoint.x = x;
    restorePoint.y = y;
    restorePoint.direction = dir;
};

//////////////////////////////
// Functions - zoom points
//////////////////////////////

/**
 * returns the zoom point list without the empty items
 */
Game_Party.prototype.zoomPoints = function () {
    return this._zoomPoints.filter(point => point);
};

// Zoom IDs start at 0
Game_Party.prototype.addZoomPoint = function (id, name, mapId, x, y) {
    const point = {
        id: id,
        name: name.replaceAll('_', ' '),
        mapId: mapId,
        x: x,
        y: y
    }
    this._zoomPoints[id] = point;
};

/**
 * Does game allow player to zoom & does player have zoom points
 */
Game_Party.prototype.allowedZoom = function () {
    return $gameSwitches.value(DQEng.Parameters.Game_System.AllowZoomSwitch)
        && this.zoomPoints().length;
};

/**
 * Does party have zoom spell
 */
Game_Party.prototype.hasZoom = function () {
    return this.members().some(actor => {
        return actor.hasSkill(DQEng.Parameters.Game_BattlerBase.zoomSkillId);
    });
};

/**
 * Is there a party member who has and is able to use zoom spell
 */
Game_Party.prototype.partyCanZoom = function () {
    return this.movableMembers().some(actor => {
        return actor.hasSkill(DQEng.Parameters.Game_BattlerBase.zoomSkillId);
    });
};

/**
 * Return front party member who can zoom
 */
Game_Party.prototype.zoomMember = function () {
    return this.movableMembers().find(actor => {
        return actor.hasSkill(DQEng.Parameters.Game_BattlerBase.zoomSkillId);
    });
};

Game_Party.prototype.lastZoomPoint = function () {
    return this._lastZoomPoint;
};

Game_Party.prototype.setLastZoomPoint = function (point) {
    this._lastZoomPoint = point;
    console.log(this.lastZoomPoint());
};