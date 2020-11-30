//=============================================================================
// Dragon Quest Engine - Scene Equip
// DQE_Scene_Equip.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the equip menu - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Equip = true;

var DQEng = DQEng || {};
DQEng.Scene_Equip = DQEng.Scene_Equip || {};

//-----------------------------------------------------------------------------
// Scene_Equip
//-----------------------------------------------------------------------------

Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCommandWindow();
    this.createEquipSlotWindow();
    this.createEquipItemWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Equip.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(24, 549, 1230, 3);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Equip.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand(24, 48, 354, 'Equipment');
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.createEquipSlotWindow = function () {
    var x = this._commandWindow.x + this._commandWindow.windowWidth();
    this._equipSlotWindow = new Window_EquipSlot(x, 48, 522, 501);
    this._equipSlotWindow.setHelpWindow(this._helpWindow);
    this._equipSlotWindow.setHandler('ok', this.onEquipSlotOk.bind(this));
    this._equipSlotWindow.setHandler('cancel', this.onEquipSlotCancel.bind(this));
    this.addWindow(this._equipSlotWindow);
    this._commandWindow.setAssociatedWindow(this._equipSlotWindow);
};

Scene_Equip.prototype.createEquipItemWindow = function () {
    var x = this._commandWindow.x + this._commandWindow.windowWidth();
    this._equipItemWindow = new Window_EquipmentList(x, 48, 522, 501);
    this._equipItemWindow.setHelpWindow(this._helpWindow);
    // this._equipItemWindow.setHandler('ok', this.onEquipItemOk.bind(this));
    this._equipItemWindow.setHandler('cancel', this.onEquipItemCancel.bind(this));
    this._equipItemWindow.hide();
    this.addWindow(this._equipItemWindow);
    this._commandWindow.setAssociatedWindow(this._equipItemWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Equip.prototype.onCommandOk = function () {
    this._commandWindow.showBackgroundDimmer();
    this._equipSlotWindow.select(0);
    this._equipSlotWindow.showHelpWindow();
    this._equipSlotWindow.activate();
};

Scene_Equip.prototype.onEquipSlotOk = function () {
    this._equipSlotWindow.hide();
    this._equipItemWindow.setSlot(this._equipSlotWindow.index());
    this._equipItemWindow.select(this._equipItemWindow._lastSelected);
    this._equipItemWindow.show();
    this._equipItemWindow.activate();
};

Scene_Equip.prototype.onEquipSlotCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._equipSlotWindow.deselect();
    this._equipSlotWindow.hideHelpWindow();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onEquipItemCancel = function () {
    this._equipItemWindow.setLastSelected(this._equipItemWindow.index());
    this._equipItemWindow.hide();
    this._equipSlotWindow.show();
    this._equipSlotWindow.activate();
};
