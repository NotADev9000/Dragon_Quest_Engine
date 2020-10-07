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

Game_Troop.prototype.groups = function () {
    return this._groups;
};

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

/**
 * Groups enemies by name
 * if you had enemy [A, B, B, A]:
 * group1 = A
 * group2 = B
 */
Game_Troop.prototype.autoCreateEnemyGroups = function () {
    this.members().forEach(function (enemy) {
        if (enemy.isAlive()) {
            var name = enemy.originalName();
            if (!this.groups().some(function(group) {
                    if (group.name === name) {
                        // add current enemy to matching group
                        group.enemies.push(enemy);
                        return true;
                    }
                    return false;
                }, this)) {
                // if none of the groups matched this enemy, add it to a new group
                this._groups.push({ name: name, enemies: [enemy] });
            }
        }
    }, this);
};

Game_Troop.prototype.aliveAllGroups = function () {
    return this.groups().filter(function (group) {
        return this.aliveGroup(group);
    }, this);
};

Game_Troop.prototype.aliveGroup = function (group) {
    return group.enemies.filter(function (enemy) {
        return enemy.isAlive();
    });
};

