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
    this.createQuestListWindow();
    this.createQuestDetailsWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Quests.prototype.createQuestListWindow = function () {
    this._questListWindow = new Window_QuestList(48, 48, 642, 447);
    this._questListWindow.setHandler('next', this.onCommandChangeObjectivesPage.bind(this, true));
    this._questListWindow.setHandler('previous', this.onCommandChangeObjectivesPage.bind(this, false));
    this._questListWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._questListWindow);
};

Scene_Quests.prototype.createQuestDetailsWindow = function () {
    const x = 48 + this._questListWindow.width;
    this._questDetailsWindow = new Window_QuestDetails(x, 48, 702, 714);
    this.addWindow(this._questDetailsWindow);
    this._questListWindow.setHelpWindow(this._questDetailsWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Quests.prototype.onCommandChangeObjectivesPage = function (next) {
    this._questDetailsWindow.changeObjective(next);
    // this._questListWindow.activate();
};