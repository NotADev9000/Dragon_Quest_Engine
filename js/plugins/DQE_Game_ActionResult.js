//=============================================================================
// Dragon Quest Engine - Game Action Result
// DQE_Game_ActionResult.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for an Action Result - V0.1
* 
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_ActionResult = true;

var DQEng = DQEng || {};
DQEng.Game_ActionResult = DQEng.Game_ActionResult || {};

var parameters = PluginManager.parameters('DQE_Game_ActionResult');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_ActionResult = {};

//-----------------------------------------------------------------------------
// Game_ActionResult
//-----------------------------------------------------------------------------

Game_ActionResult.FAILURE_TYPE_NOTHING = 0;
Game_ActionResult.FAILURE_TYPE_AFFECTED = 1;
Game_ActionResult.FAILURE_TYPE_FULLHEALTH = 2;

DQEng.Game_ActionResult.clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function () {
    DQEng.Game_ActionResult.clear.call(this);
    this.stackedStates = [];
    this.recover = false;
    this.blocked = false;
    this.grow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // amount a stat grew by
    this.changedBuffs = [];
    this.buffDifferences = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.failureType = 0; // when an action is unsuccessful the message displayed depends on this type
};

Game_ActionResult.prototype.stackedStateObjects = function () {
    return this.stackedStates.map(function (id) {
        return $dataStates[id];
    });
};

DQEng.Game_ActionResult.isStatusAffected = Game_ActionResult.prototype.isStatusAffected;
Game_ActionResult.prototype.isStatusAffected = function () {
    return DQEng.Game_ActionResult.isStatusAffected.call(this) ||
            this.stackedStates.length > 0 || this.changedBuffs.length > 0;
};

Game_ActionResult.prototype.isStateStacked = function (stateId) {
    return this.stackedStates.contains(stateId);
};

Game_ActionResult.prototype.pushStackedState = function (stateId) {
    if (!this.isStateStacked(stateId)) {
        this.stackedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isBuffChanged = function (paramId) {
    return this.changedBuffs.contains(paramId);
};

Game_ActionResult.prototype.pushChangedBuff = function (paramId) {
    if (!this.isBuffChanged(paramId)) {
        this.changedBuffs.push(paramId);
    }
};

Game_ActionResult.prototype.isHit = function () {
    return this.onTarget() && !this.blocked;
};

Game_ActionResult.prototype.onTarget = function () {
    return this.used && !this.missed && !this.evaded;
};
