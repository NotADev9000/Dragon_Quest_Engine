//=============================================================================
// Dragon Quest Engine - Scene Skill
// DQE_Scene_Skill.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the skill (aka magic) menu - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Skill = true;

var DQEng = DQEng || {};
DQEng.Scene_Skill = DQEng.Scene_Skill || {};

//-----------------------------------------------------------------------------
// Scene_Skill
//-----------------------------------------------------------------------------

Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCommandWindow();
    this.createSkillWindow();
    this.createSkillStatWindow();
    this.createStatusWindow();
};

Scene_Skill.prototype.start = function () {
    Scene_ItemBase.prototype.start.call(this);
    this.refreshStatusWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Skill.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(900, 48, 354, 8, 288);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Skill.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_ItemCommand(24, 48, 354, 'Magic');
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Skill.prototype.createSkillWindow = function () {
    var wx = this._commandWindow.x + this._commandWindow.windowWidth();
    this._skillWindow = new Window_SkillList(wx, 48, 522, 411);
    this._skillWindow.setHelpWindow(this._helpWindow);
    // this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
    this._commandWindow.setAssociatedWindow(this._skillWindow);
};

Scene_Skill.prototype.createSkillStatWindow = function () {
    let x = this._helpWindow.x;
    let y = 336;
    this._skillStatWindow = new Window_SkillCost(x, y);
    this._skillStatWindow.hide();
    this.addWindow(this._skillStatWindow);
    this._skillWindow.setHelpWindow(this._skillStatWindow);
};

Scene_Skill.prototype.createStatusWindow = function () {
    Scene_MenuBase.prototype.createStatusWindow.call(this);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Skill.prototype.onCommandOk = function () {
    this._commandWindow.showBackgroundDimmer();
    this._skillWindow.activate();
    this._skillWindow.select(this._skillWindow._lastSelected);
    this._skillWindow.showAllHelpWindows();
};

Scene_Skill.prototype.onSkillCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._skillWindow.hideAllHelpWindows();
    this._skillWindow.setLastSelected(this._skillWindow.index());
    this._skillWindow.deselect();
    this._commandWindow.activate();
};