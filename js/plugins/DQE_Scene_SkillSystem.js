//=============================================================================
// Dragon Quest Engine - Scene Skill System
// DQE_Scene_SkillSystem.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the skill system - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_SkillSystem = DQEng.Scene_SkillSystem || {};

//-----------------------------------------------------------------------------
// Scene_SkillSystem
//-----------------------------------------------------------------------------

function Scene_SkillSystem() {
    this.initialize.apply(this, arguments);
}

Scene_SkillSystem.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillSystem.prototype.constructor = Scene_SkillSystem;

Scene_SkillSystem.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SkillSystem.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createSkillSetsListWindow();
    this.createSkillSetsWindow();
    this.createSkillPointsWindow();
};

Scene_SkillSystem.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this.startFadeIn(this.fadeSpeed(), false);
};

Scene_SkillSystem.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    this.updateBackgroundScroll();
};

//////////////////////////////
// Functions - visuals
//////////////////////////////

Scene_SkillSystem.prototype.createBackground = function () {
    this._backgroundSprite = new TilingSprite();
    this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
    this._backgroundSprite.bitmap = ImageManager.loadSystem('SkillSystem_BG');
    this.addChild(this._backgroundSprite);
};

Scene_SkillSystem.prototype.updateBackgroundScroll = function () {
    // moving the origin x/y allows the tiling sprite to tile the image properly
    this._backgroundSprite.origin.x -= 2;
    this._backgroundSprite.origin.y -= 2;
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_SkillSystem.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand_ItemList(0, 0, 354, 'Party');
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('pageup', this.onCommandNextSkillSet.bind(this));
    this._commandWindow.setHandler('pagedown', this.onCommandPreviousSkillSet.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._commandWindow.setCheckListIsEmpty(true);
    // cursor right and left should change skillSets window
    this._commandWindow.cursorLeft = () => {};
    this._commandWindow.cursorRight = () => {};
    this.addWindow(this._commandWindow);
};

Scene_SkillSystem.prototype.createSkillSetsListWindow = function () {
    const x = this._commandWindow.x + this._commandWindow.width;
    this._skillSetsListWindow = new Window_SkillSetsList(x, 0, 1086, 231);
    this._skillSetsListWindow.setHandler('cancel', this.onSkillSetListCancel.bind(this));
    this.addWindow(this._skillSetsListWindow);
    this._commandWindow.setHelpWindow(this._skillSetsListWindow);
};

Scene_SkillSystem.prototype.createSkillSetsWindow = function () {
    const x = this._skillSetsListWindow.x;
    const y = this._skillSetsListWindow.y + this._skillSetsListWindow.height;
    this._skillSetsWindow = new Window_SkillSets(x, y, 1086, 555, false);
    this.addWindow(this._skillSetsWindow);
    this._commandWindow.setHelpWindow(this._skillSetsWindow);
    this._skillSetsListWindow.setHelpWindow(this._skillSetsWindow);
};

Scene_SkillSystem.prototype.createSkillPointsWindow = function () {
    const y = this._commandWindow.y + this._commandWindow.height;
    this._skillPointsWindow = new Window_SkillPoints(0, y, 354);
    this.addWindow(this._skillPointsWindow);
    this._commandWindow.setHelpWindow(this._skillPointsWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_SkillSystem.prototype.onCommandOk = function () {
    this._commandWindow.showBackgroundDimmer();
    this._skillSetsListWindow.select(this._skillSetsListWindow._lastSelected);
    this._skillSetsListWindow.activate();
};

Scene_SkillSystem.prototype.onCommandNextSkillSet = function () {
    this._skillSetsListWindow.gotoNextPage();
    this._skillSetsListWindow.deselect();
    this._commandWindow.activate();
};

Scene_SkillSystem.prototype.onCommandPreviousSkillSet = function () {
    this._skillSetsListWindow.gotoNextPage(-1);
    this._skillSetsListWindow.deselect();
    this._commandWindow.activate();
};

Scene_SkillSystem.prototype.onSkillSetListCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._skillSetsListWindow.deselect();
    this._commandWindow.activate();
};
