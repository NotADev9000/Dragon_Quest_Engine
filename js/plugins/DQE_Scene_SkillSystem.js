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
    this.createStatsWindow();
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

    // next skill set list
    this._commandWindow.setHandler('pageup', this.onCommandNextSkillSetPage.bind(this));
    this._commandWindow.setHandler('pagedown', this.onCommandPreviousSkillSetPage.bind(this));

    // next skill set
    this._commandWindow.setHandler('next', this.onNextSkillSet.bind(this));
    this._commandWindow.setHandler('previous', this.onPreviousSkillSet.bind(this));

    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._commandWindow.setCheckListIsEmpty(true);

    // cursor right and left should change skillSets window
    this._commandWindow.cursorLeft = this.onCursorLeft.bind(this);
    this._commandWindow.cursorRight = this.onCursorRight.bind(this);

    this.addWindow(this._commandWindow);
};

Scene_SkillSystem.prototype.createSkillSetsListWindow = function () {
    const x = this._commandWindow.x + this._commandWindow.width;
    this._skillSetsListWindow = new Window_SkillSetsList(x, 0, 1086, 231);
    this._skillSetsListWindow.setHandler('ok', this.onSkillSetListOk.bind(this));

    // next skill set
    this._skillSetsListWindow.setHandler('next', this.onNextSkillSet.bind(this));
    this._skillSetsListWindow.setHandler('previous', this.onPreviousSkillSet.bind(this));

    this._skillSetsListWindow.setHandler('cancel', this.onSkillSetListCancel.bind(this));

    // cursor right and left should change skillSets window
    this._skillSetsListWindow.cursorLeft = this.onCursorLeft.bind(this);
    this._skillSetsListWindow.cursorRight = this.onCursorRight.bind(this);

    this._skillSetsListWindow.setHideCursor(true);

    this.addWindow(this._skillSetsListWindow);
    this._commandWindow.setHelpWindow(this._skillSetsListWindow);
};

Scene_SkillSystem.prototype.createSkillSetsWindow = function () {
    const x = this._skillSetsListWindow.x;
    const y = this._skillSetsListWindow.y + this._skillSetsListWindow.height;
    this._skillSetsWindow = new Window_SkillSets(x, y, 1086, 555, false);

    // next skill set
    this._skillSetsWindow.setHandler('next', this.onNextSkillSet.bind(this));
    this._skillSetsWindow.setHandler('previous', this.onPreviousSkillSet.bind(this));

    this._skillSetsWindow.setHandler('cancel', this.onSkillSetCancel.bind(this));

    this.addWindow(this._skillSetsWindow);
    this._skillSetsListWindow.setHelpWindow(this._skillSetsWindow);
};

Scene_SkillSystem.prototype.createSkillPointsWindow = function () {
    const y = this._commandWindow.y + this._commandWindow.height;
    this._skillPointsWindow = new Window_SkillPoints(0, y, 354);

    this.addWindow(this._skillPointsWindow);
    this._commandWindow.setHelpWindow(this._skillPointsWindow);
};

Scene_SkillSystem.prototype.createStatsWindow = function () {
    this._statsWindow = new Window_Stats(0, 0, 513, true);
    this._statsWindow.hide();

    this.addWindow(this._statsWindow);
    this._commandWindow.setHelpWindow(this._statsWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_SkillSystem.prototype.onCommandOk = function () {
    this._commandWindow.showBackgroundDimmer();
    this._skillSetsListWindow.setHideCursor(false);
    this._skillSetsListWindow.select(this._skillSetsListWindow._lastSelected);
    this._skillSetsListWindow.activate();
};

Scene_SkillSystem.prototype.onCommandNextSkillSetPage = function () {
    this._skillSetsListWindow.setHideCursor(true);
    this._skillSetsListWindow.gotoNextPage();
    this._commandWindow.activate();
};

Scene_SkillSystem.prototype.onCommandPreviousSkillSetPage = function () {
    this._skillSetsListWindow.setHideCursor(true);
    this._skillSetsListWindow.gotoNextPage(-1);
    this._commandWindow.activate();
};

Scene_SkillSystem.prototype.onNextSkillSet = function () {
    this._skillSetsListWindow.moveToNextSkillSet();
};

Scene_SkillSystem.prototype.onPreviousSkillSet = function () {
    this._skillSetsListWindow.moveToPreviousSkillSet();
};

Scene_SkillSystem.prototype.onCursorLeft = function () { 
    this._skillSetsWindow.cursorLeft.call(this._skillSetsWindow);
};

Scene_SkillSystem.prototype.onCursorRight = function () {
    this._skillSetsWindow.cursorRight.call(this._skillSetsWindow);
};

Scene_SkillSystem.prototype.onSkillSetListOk = function () {
    this._commandWindow.hide();
    this._skillSetsListWindow.hide();
    this._statsWindow.show();
    // move/resize skill points
    this._skillPointsWindow.width = 513;
    this._skillPointsWindow.y = this._statsWindow.y + this._statsWindow.height;
    this._skillPointsWindow.refresh();
    // move/resize/activate skill sets
    this._skillSetsWindow.x = this._statsWindow.x + this._statsWindow.width;
    this._skillSetsWindow.y = 0;
    this._skillSetsWindow.width = 927;
    this._skillSetsWindow.setSelectable(true);
    this._skillSetsWindow.refresh();
    this._skillSetsWindow.select(this._skillSetsWindow._lastSelected);
    this._skillSetsWindow.activate();
};

Scene_SkillSystem.prototype.onSkillSetListCancel = function () {
    this._skillSetsListWindow.setHideCursor(true);
    this._skillSetsListWindow.updateCursor();
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};

Scene_SkillSystem.prototype.onSkillSetCancel = function () {
    this._statsWindow.hide();
    this._commandWindow.show();
    this._skillSetsListWindow.show();
    // move/resize skill points
    this._skillPointsWindow.width = 354;
    this._skillPointsWindow.y = this._commandWindow.y + this._commandWindow.height;
    this._skillPointsWindow.refresh();
    // move/resize skill sets
    this._skillSetsWindow.x = this._skillSetsListWindow.x;
    this._skillSetsWindow.y = this._skillSetsListWindow.y + this._skillSetsListWindow.height;
    this._skillSetsWindow.width = 1086;
    this._skillSetsWindow.setSelectable(false);
    this._skillSetsWindow.deselect();
    this._skillSetsWindow.refresh();
    // activate skill sets list
    this._skillSetsListWindow.activate();
};
