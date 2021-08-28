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

Scene_SkillSystem.prototype.updateBackgroundScroll = function () {
    // moving the origin x/y allows the tiling sprite to tile the image properly
    this._backgroundSprite.origin.x -= 2;
    this._backgroundSprite.origin.y -= 2;
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_SkillSystem.prototype.createBackground = function() {
    this._backgroundSprite = new TilingSprite();
    this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
    this._backgroundSprite.bitmap = ImageManager.loadSystem('SkillSystem_BG');
    this.addChild(this._backgroundSprite);
};

Scene_SkillSystem.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand(0, 0, 354, 'Party');
    // this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};
