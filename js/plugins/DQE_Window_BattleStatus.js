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

Window_BattleStatus.prototype.initialize = function (x, y, actor, titleAlign = 'left') {
    this._actorIndex = -1;
    Window_MenuStatus.prototype.initialize.call(this, x, y, actor, titleAlign);
};

Window_BattleStatus.prototype.setCategory = function (category, force = false) {
    if ((this._actorIndex !== category) || force) {
        this._actorIndex = category;
        this._actor = $gameParty.allMembers()[this._actorIndex];
        this.refresh();
    }
};
