//=============================================================================
// Dragon Quest Engine - Scene Quests
// DQE_Scene_Quests.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the quest logs - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_Quests = DQEng.Scene_Quests || {};

//-----------------------------------------------------------------------------
// Scene_Quests
//-----------------------------------------------------------------------------

function Scene_Quests() {
    this.initialize.apply(this, arguments);
}

Scene_Quests.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Quests.prototype.constructor = Scene_Quests;

Scene_Quests.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Quests.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Quests.prototype.createCommandWindow = function () {
    this._questListWindow = new Window_QuestList(48, 48, 642, 447);
    this._questListWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._questListWindow);
};


