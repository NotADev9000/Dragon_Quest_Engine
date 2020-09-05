//=============================================================================
// Dragon Quest Engine - Scene Item
// DQE_Scene_Item.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the item menu - V0.1
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
Imported.DQEng_Scene_Item = true;

var DQEng = DQEng || {};
DQEng.Scene_Item = DQEng.Scene_Item || {};

//-----------------------------------------------------------------------------
// Scene_Item
//-----------------------------------------------------------------------------

Scene_Item.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createCommandWindow();
};

Scene_Item.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand(24, 48, 354, 'Items', ['Items', 'Equipment', 'Important']);
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
}
