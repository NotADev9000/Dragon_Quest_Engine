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
