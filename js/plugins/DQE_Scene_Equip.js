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
    this.createEquipSlotDoWhatWindow();
    this.createEquipItemWindow();
    this.createEquipLocationWindow();
    this.createMessageWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Equip.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(48, 621, 1344, 3);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Equip.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand(48, 48, 354, 'Equipment');
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.createEquipSlotWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.windowWidth();
    this._equipSlotWindow = new Window_EquipSlot(x, 48, 571, 573);
    this._equipSlotWindow.setHandler('ok', this.onEquipSlotOk.bind(this));
    this._equipSlotWindow.setHandler('cancel', this.onEquipSlotCancel.bind(this));
    this.addWindow(this._equipSlotWindow);
    this._equipSlotWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setAssociatedWindow(this._equipSlotWindow);
};

Scene_Equip.prototype.createEquipSlotDoWhatWindow = function () {
    let x = this._commandWindow.x;
    let y = this._commandWindow.y;
    let width = this._commandWindow.width;
    this._equipSlotDoWhatWindow = new Window_TitledCommand(x, y, width, 'Do What?', ['Change Equip', 'Unequip', 'Cancel']);
    this._equipSlotDoWhatWindow.deactivate();
    this._equipSlotDoWhatWindow.setHandler('Change Equip', this.onChangeEquip.bind(this));
    this._equipSlotDoWhatWindow.setHandler('Unequip', this.onEquipSlotDoWhatUnequip.bind(this));
    this._equipSlotDoWhatWindow.setHandler('Cancel', this.onEquipSlotDoWhatCancel.bind(this));
    this._equipSlotDoWhatWindow.setHandler('cancel', this.onEquipSlotDoWhatCancel.bind(this));
    this._equipSlotDoWhatWindow.hide();
    this.addWindow(this._equipSlotDoWhatWindow);
};

Scene_Equip.prototype.createEquipItemWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.windowWidth();
    this._equipItemWindow = new Window_EquipmentList(x, 48, 571, 573);
    this._equipItemWindow.setHelpWindow(this._helpWindow);
    // this._equipItemWindow.setHandler('ok', this.onEquipItemOk.bind(this));
    this._equipItemWindow.setHandler('cancel', this.onEquipItemCancel.bind(this));
    this._equipItemWindow.hide();
    this.addWindow(this._equipItemWindow);
    this._commandWindow.setAssociatedWindow(this._equipItemWindow);
};

Scene_Equip.prototype.createEquipLocationWindow = function () {
    let x = this._commandWindow.x;
    this._equipLocationWindow = new Window_ItemLocation(x, 0);
    this._equipLocationWindow.hide();
    this._equipLocationWindow.y = this._equipItemWindow.y + this._equipItemWindow.height - this._equipLocationWindow.windowHeight();
    this.addWindow(this._equipLocationWindow);
    this._equipItemWindow.setHelpWindow(this._equipLocationWindow);
};

/**
 * Always call this window last so it's at front
 */
Scene_Equip.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_Message();
    this.addWindow(this._messageWindow);
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
    if (this._equipSlotWindow.dataItem()) {
        this._equipSlotDoWhatWindow.select(0);
        this._equipSlotWindow.showBackgroundDimmer();
        this._helpWindow.showBackgroundDimmer();
        this._equipSlotDoWhatWindow.show();
        this._equipSlotDoWhatWindow.activate();
    } else {
        this.onChangeEquip();
    }
};

Scene_Equip.prototype.onEquipSlotCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._equipSlotWindow.deselect();
    this._equipSlotWindow.hideHelpWindow();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onChangeEquip = function () {
    if (this._equipItemWindow.setSlot(this._equipSlotWindow.index())) { // if there's items to equip
        this._equipSlotDoWhatWindow.hide();
        this._equipSlotWindow.hide();
        this._equipSlotWindow.hideBackgroundDimmer();
        this._equipSlotWindow.hideAllHelpWindowBackgroundDimmers();
        this._equipItemWindow.select(this._equipItemWindow._lastSelected);
        this._equipItemWindow.show();
        this._equipItemWindow.showHelpWindow(1);
        this._equipItemWindow.activate();
    } else {
        this._equipSlotDoWhatWindow.showBackgroundDimmer();
        this._equipSlotWindow.showAllHelpWindowBackgroundDimmers();
        this._equipSlotWindow.showBackgroundDimmer();
        this.displayMessage(this.noEquipItemsMessage(), Scene_Equip.prototype.noEquipItemsMessageCallback);
    }
};

Scene_Equip.prototype.onEquipSlotDoWhatUnequip = function () {
    let actor = this._equipSlotWindow._actor;
    let slotIndex = this._equipSlotWindow.slotIndex();
    let index = this._equipSlotWindow.orderInInventory()[slotIndex];

    this._equipSlotDoWhatWindow.hide();
    this.displayMessage(actor.unequipItemMessage(index), Scene_Equip.prototype.doWhatUnequipMessageCallback);
    actor.unequipItem(index, true, slotIndex);
};

Scene_Equip.prototype.onEquipSlotDoWhatCancel = function () {
    this._equipSlotDoWhatWindow.hide();
    this._helpWindow.hideBackgroundDimmer();
    this._equipSlotWindow.hideBackgroundDimmer();
    this._equipSlotWindow.activate();
};

Scene_Equip.prototype.onEquipItemCancel = function () {
    this._equipItemWindow.setLastSelected(this._equipItemWindow.index());
    this._equipItemWindow.hideHelpWindow(1);
    this._equipItemWindow.hide();
    this._equipSlotWindow.show();
    this._equipSlotWindow.activate();
};

//////////////////////////////
// Functions - messages
//////////////////////////////

Scene_Equip.prototype.noEquipItemsMessage = function () {
    return 'There are no items to equip!';
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Equip.prototype.noEquipItemsMessageCallback = function () {
    this._equipSlotDoWhatWindow.hide();
    this._equipSlotDoWhatWindow.hideBackgroundDimmer();
    this._equipSlotWindow.hideBackgroundDimmer();
    this._equipSlotWindow.hideAllHelpWindowBackgroundDimmers();
    this._equipSlotWindow.activate();
};

Scene_Equip.prototype.doWhatUnequipMessageCallback = function () {
    this._equipSlotWindow.refresh();
    this._equipSlotWindow.hideBackgroundDimmer();
    this._equipSlotWindow.hideAllHelpWindowBackgroundDimmers();
    this._equipSlotWindow.activate();
};
