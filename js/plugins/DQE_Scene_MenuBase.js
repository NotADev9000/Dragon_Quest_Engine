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

Scene_MenuBase.prototype.refreshStatusWindow = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.refresh();
    });
};

Scene_MenuBase.prototype.showStatusWindowBackgroundDimmers = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.showBackgroundDimmer();
    });
};

Scene_MenuBase.prototype.hideStatusWindowBackgroundDimmers = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.hideBackgroundDimmer();
    });
};
