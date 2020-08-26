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
// Window_Scene_Menu
//-----------------------------------------------------------------------------

Scene_Menu.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_MenuCommand(48, 48);
    this._commandWindow.setHandler('item', this.commandItem.bind(this));
    this._commandWindow.setHandler('skill', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    this._commandWindow.setHandler('save', this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};
