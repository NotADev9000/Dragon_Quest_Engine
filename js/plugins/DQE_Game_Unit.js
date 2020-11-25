//=============================================================================
// Dragon Quest Engine - Game Unit
// DQE_Game_Unit.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass of Game_Unit and Game_Troop. - V0.1
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
Imported.DQEng_Game_Unit = true;

var DQEng = DQEng || {};
DQEng.Game_Unit = DQEng.Game_Unit || {};

//-----------------------------------------------------------------------------
// Game_Unit
//-----------------------------------------------------------------------------

DQEng.Game_Unit.select = Game_Unit.prototype.select;
Game_Unit.prototype.select = function (activeMembers) {
    // deselect enemies so none are flashing
    this.members().forEach(member => member.deselect());
    // if there's no selection just return
    if (!activeMembers) return;
    // go through each selected enemy and highlight them
    activeMembers.forEach(function(activeMember) {
        this.members().forEach(function (member) {
            if (member === activeMember) {
                member.select();
            }
        });
    }, this);
};

/**
 * Returns the members of the front line party (first 4)
 */
Game_Unit.prototype.frontline = function () {
    return this.members().slice(0, 4);
};

Game_Unit.prototype.aliveFrontline = function () {
    return this.frontline().filter(function (member) {
        return member.isAlive();
    });
};

Game_Unit.prototype.deadFrontline = function () {
    return this.frontline().filter(function (member) {
        return member.isDead();
    });
};

/**
 * Returns the members of the back line party (members 4-8)
 */
Game_Unit.prototype.backline = function () {
    return $gameParty.allMembers().length > 4 ? this.allMembers().slice(4, 8) : [];
};
