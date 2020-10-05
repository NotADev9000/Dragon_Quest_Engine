//=============================================================================
// Dragon Quest Engine - Window Battle Status
// DQE_Window_BattleStatus.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window that displays party member status in battle - V0.1
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
Imported.DQEng_Window_BattleStatus = true;

var DQEng = DQEng || {};
DQEng.Window_BattleStatus = DQEng.Window_BattleStatus || {};

//-----------------------------------------------------------------------------
// Window_BattleStatus
//-----------------------------------------------------------------------------

function Window_BattleStatus() {
    this.initialize.apply(this, arguments);
}

Window_BattleStatus.prototype = Object.create(Window_MenuStatus.prototype);
Window_BattleStatus.prototype.constructor = Window_BattleStatus;

Window_BattleStatus.prototype.initialize = function (x, y, actor) {
    Window_MenuStatus.prototype.initialize.call(this, x, y, actor);
};
