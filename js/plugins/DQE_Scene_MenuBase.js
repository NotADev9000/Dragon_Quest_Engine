//=============================================================================
// Dragon Quest Engine - Scene Menu Base
// DQE_Scene_MenuBase.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass for the scene Menus - V0.1
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
Imported.DQEng_Scene_MenuBase = true;

var DQEng = DQEng || {};
DQEng.Scene_MenuBase = DQEng.Scene_MenuBase || {};

//-----------------------------------------------------------------------------
// Scene_MenuBase
//-----------------------------------------------------------------------------

Scene_MenuBase.prototype.createStatusWindow = function () {
    this._statusWindow = [];
    var partyMembers = $gameParty.members();

    for (let i = 0; i < Math.min(partyMembers.length, 4); i++) {
        this._statusWindow[i] = new Window_MenuStatus(63 + (Window_MenuStatus.prototype.windowWidth() * i), 480, partyMembers[i]);
        this.addWindow(this._statusWindow[i]);
    }
};

Scene_MenuBase.prototype.refreshStatusWindow = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.refresh();
    });
};
