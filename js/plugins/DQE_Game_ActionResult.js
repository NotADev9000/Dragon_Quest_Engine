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

DQEng.Game_ActionResult.clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function () {
    DQEng.Game_ActionResult.clear.call(this);
    this.stackedStates = [];
    this.recover = false;
};

Game_ActionResult.prototype.stackedStateObjects = function () {
    return this.stackedStates.map(function (id) {
        return $dataStates[id];
    });
};

DQEng.Game_ActionResult.isStatusAffected = Game_ActionResult.prototype.isStatusAffected;
Game_ActionResult.prototype.isStatusAffected = function () {
    return DQEng.Game_ActionResult.isStatusAffected.call(this) ||
            this.stackedStates.length > 0;
};

Game_ActionResult.prototype.isStateStacked = function (stateId) {
    return this.stackedStates.contains(stateId);
};

Game_ActionResult.prototype.pushStackedState = function (stateId) {
    if (!this.isStateStacked(stateId)) {
        this.stackedStates.push(stateId);
    }
};
