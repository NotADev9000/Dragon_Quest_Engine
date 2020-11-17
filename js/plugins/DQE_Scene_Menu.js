//=============================================================================
// Dragon Quest Engine - Scene Menu
// DQE_Scene_Menu.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the main menu - V0.1
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
Imported.DQEng_Scene_Menu = true;

var DQEng = DQEng || {};
DQEng.Scene_Menu = DQEng.Scene_Menu || {};

//-----------------------------------------------------------------------------
// Scene_Menu
//-----------------------------------------------------------------------------

Scene_Menu.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.forEach(statusWindow => {
        statusWindow.refresh();
    });
};

Scene_Menu.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_MenuCommand(24, 48);
    this._commandWindow.setHandler('item', this.commandItem.bind(this));
    this._commandWindow.setHandler('skill', this.commandSkill.bind(this));
    this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    this._commandWindow.setHandler('save', this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.createGoldWindow = function () {
    this._goldWindow = new Window_Gold(0, 48);
    this._goldWindow.x = (Graphics.boxWidth - this._goldWindow.width) - 48;
    this.addWindow(this._goldWindow);
};

Scene_Menu.prototype.createStatusWindow = function () {
    this._statusWindow = [];
    var partyMembers = $gameParty.members();

    for (let i = 0; i < Math.min(partyMembers.length, 4); i++) {
        this._statusWindow[i] = new Window_MenuStatus(63 + (Window_MenuStatus.prototype.windowWidth() * i), 480, partyMembers[i]);
        this.addWindow(this._statusWindow[i]);
    }
};

Scene_Menu.prototype.commandSkill = function () {
    SceneManager.push(Scene_Skill);
};
