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
    // active quest windows
    this.createQuestListWindow();
    this.createQuestDetailsWindow();
    this.createQuestRewardsWindow();
    this.createQuestLocatorIconWindow();
    // available quest windows
    this.createQuestListAvailableWindow();
    this.createQuestDetailsAvailableWindow();
    this.createQuestActiveIconWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

// active quest windows

Scene_Quests.prototype.createQuestListWindow = function () {
    this._questListWindow = new Window_QuestList(48, 48, 642, 447);
    // change stage
    this._questListWindow.setHandler('pageup', this.onCommandChangeStagePage.bind(this, true));
    this._questListWindow.setHandler('pagedown', this.onCommandChangeStagePage.bind(this, false));
    // change objectives
    this._questListWindow.setHandler('next', this.onCommandChangeObjectivesPage.bind(this, true));
    this._questListWindow.setHandler('previous', this.onCommandChangeObjectivesPage.bind(this, false));
    // misc
    this._questListWindow.setHandler('help', this.onCommandOpenLocator.bind(this));
    this._questListWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._questListWindow);
};

Scene_Quests.prototype.createQuestDetailsWindow = function () {
    const x = 48 + this._questListWindow.width;
    this._questDetailsWindow = new Window_QuestDetails(x, 48, 702);
    this.addWindow(this._questDetailsWindow);
    this._questListWindow.setHelpWindow(this._questDetailsWindow);
};

Scene_Quests.prototype.createQuestRewardsWindow = function () {
    const y = 48 + this._questListWindow.height;
    const width = this._questListWindow.width;
    this._questRewardsWindow = new Window_QuestRewards(48, y, width, 192);
    this.addWindow(this._questRewardsWindow);
    this._questListWindow.setHelpWindow(this._questRewardsWindow);
};

Scene_Quests.prototype.createQuestLocatorIconWindow = function () {
    const y = this._questListWindow.maxItems() ? 
                this._questRewardsWindow.y + this._questRewardsWindow.height : 
                this._questListWindow.y + this._questListWindow.height;
    this._questLocatorIconWindow = new Window_Icon_Help(48, y, 423, ['help'], ['Quest Locator']);
    this.addWindow(this._questLocatorIconWindow);
};

// available quest windows

Scene_Quests.prototype.createQuestListAvailableWindow = function () {
    this._questListAvailableWindow = new Window_QuestList_Available(48, 48, 642, 447);
    this._questListAvailableWindow.hide();
    this._questListAvailableWindow.setHandler('help', this.onCommandOpenActive.bind(this));
    this._questListAvailableWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._questListAvailableWindow);
};

Scene_Quests.prototype.createQuestDetailsAvailableWindow = function () {
    const x = 48 + this._questListAvailableWindow.width;
    this._questDetailsAvailableWindow = new Window_QuestDetails_Available(x, 48, 702);
    this._questDetailsAvailableWindow.hide();
    this.addWindow(this._questDetailsAvailableWindow);
    this._questListAvailableWindow.setHelpWindow(this._questDetailsAvailableWindow);
};

Scene_Quests.prototype.createQuestActiveIconWindow = function () {
    const y = this._questListAvailableWindow.y + this._questListAvailableWindow.height;
    this._questActiveIconWindow = new Window_Icon_Help(48, y, 423, ['help'], ['Active Quests']);
    this._questActiveIconWindow.hide();
    this.addWindow(this._questActiveIconWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Quests.prototype.onCommandChangeStagePage = function (next) {
    this._questDetailsWindow.changeStage(next);
    this._questListWindow.activate();
};

Scene_Quests.prototype.onCommandChangeObjectivesPage = function (next) {
    this._questDetailsWindow.changeObjective(next);
};

Scene_Quests.prototype.onCommandOpenLocator = function () {
    // hide windows
    this._questListWindow.hide();
    this._questDetailsWindow.hide();
    this._questRewardsWindow.hide();
    this._questLocatorIconWindow.hide();
    // select & activate
    this._questListAvailableWindow.select(this._questListAvailableWindow._lastSelected);
    this._questListAvailableWindow.activate();
    // show windows
    this._questListAvailableWindow.show();
    if (this._questListAvailableWindow.maxItems()) {
        this._questDetailsAvailableWindow.show();
    }
    this._questActiveIconWindow.show();
};

Scene_Quests.prototype.onCommandOpenActive = function () {
    // hide windows
    this._questListAvailableWindow.hide();
    this._questDetailsAvailableWindow.hide();
    this._questActiveIconWindow.hide();
    // select & activate
    this._questListWindow.select(this._questListWindow._lastSelected);
    this._questListWindow.activate();
    // show windows
    this._questListWindow.show();
    if (this._questListWindow.maxItems()) {
        this._questDetailsWindow.show();
        this._questRewardsWindow.show();
    }
    this._questLocatorIconWindow.show();
};
