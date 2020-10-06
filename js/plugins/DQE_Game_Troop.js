//=============================================================================
// Dragon Quest Engine - Game Troop
// DQE_Game_Troop.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for a troop and the battle-related data - V0.1
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
Imported.DQEng_Game_Troop = true;

var DQEng = DQEng || {};
DQEng.Game_Troop = DQEng.Game_Troop || {};

//-----------------------------------------------------------------------------
// Game_Troop
//-----------------------------------------------------------------------------

DQEng.Game_Troop.clear = Game_Troop.prototype.clear;
Game_Troop.prototype.clear = function () {
    DQEng.Game_Troop.clear.call(this);
    this._groups = [];
};

DQEng.Game_Troop.setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function (troopId) {
    DQEng.Game_Troop.setup.call(this, troopId);
    this.autoCreateEnemyGroups();
};

Game_Troop.prototype.autoCreateEnemyGroups = function () {
    this.members().forEach(function (enemy) {
        if (enemy.isAlive()) {
            var name = enemy.originalName();
            this._groups[name] = this._groups[name] || [];
            this._groups[name].push(enemy);
        }
    }, this);
};
