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
    this.createCommandWindow();
    this.createSkillWindow();
    
};

Scene_Skill.prototype.start = function () {
    Scene_ItemBase.prototype.start.call(this);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Skill.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_ItemCommand(24, 48, 354, 'Magic');
    // this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Skill.prototype.createSkillWindow = function () {
    var wx = this._commandWindow.x + this._commandWindow.windowWidth();
    this._skillWindow = new Window_SkillList(wx, 48, 522, 411);
    // this._skillWindow.setHelpWindow(this._helpWindow);
    // this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
    // this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
    this._commandWindow.setAssociatedWindow(this._skillWindow);
};
