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
    this.createHelpWindow();
    this.createCommandWindow();
    this.createItemWindow();
    this.createDoWhatWindow();
};

Scene_Item.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(24, 567, 1230, 3);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Item.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_ItemCommand(24, 48, 354, 'Items', ['Items', 'Equipment', 'Important']);
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
}

Scene_Item.prototype.createItemWindow = function () {
    var wx = this._commandWindow.x + this._commandWindow.windowWidth();
    this._itemWindow = new Window_ItemList(wx, 48, 570, 519);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._commandWindow.setAssociatedWindow(this._itemWindow);
};

Scene_Item.prototype.createDoWhatWindow = function () {
    this._doWhatWindow = new Window_TitledCommand(96, 372, 282, 'Do What?', ['Use', 'Transfer', 'Cancel']);
    this._doWhatWindow.deactivate();
    this._doWhatWindow.setHandler('cancel', this.onDoWhatCancel.bind(this));
    this._doWhatWindow.setHandler('Cancel', this.onDoWhatCancel.bind(this));
    this._doWhatWindow.hide();
    this.addWindow(this._doWhatWindow);
};

Scene_Item.prototype.onCommandOk = function () {
    this._commandWindow.showBackgroundDimmer();
    this._itemWindow.activate();
    this._itemWindow.select(this._itemWindow._lastSelected);
    this._helpWindow.show();
};

Scene_Item.prototype.onItemOk = function () {
    this.manageDoWhatCommands();
    this._doWhatWindow.clearCommandList();
    this._doWhatWindow.makeCommandList();
    this._doWhatWindow.updateWindowDisplay();
    this.manageDoWhatPosition();
    this._itemWindow.showBackgroundDimmer();
    this._helpWindow.showBackgroundDimmer();
    this._doWhatWindow.select(0);
    this._doWhatWindow.show();
    this._doWhatWindow.activate();
};

Scene_Item.prototype.onItemCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._helpWindow.hide();
    this._itemWindow.setLastSelected(this._itemWindow.index());
    this._itemWindow.deselect();
    this._commandWindow.activate();
};

Scene_Item.prototype.onDoWhatCancel = function () {
    this._itemWindow.hideBackgroundDimmer();
    this._helpWindow.hideBackgroundDimmer();
    this._doWhatWindow.hide();
    this._itemWindow.activate();
};

Scene_Item.prototype.manageDoWhatCommands = function () {
    var isEquipment = DataManager.isWeapon(this.item()) || DataManager.isArmor(this.item());
    var equipIndex = this._doWhatWindow._commands.indexOf('Equip');
    var hasEquip = equipIndex > -1;

    if (isEquipment && !hasEquip) {
        this._doWhatWindow._commands.splice(2, 0, 'Equip');
    } else if (!isEquipment && hasEquip) {
        this._doWhatWindow._commands.splice(equipIndex, 1);
    }
};

Scene_Item.prototype.manageDoWhatPosition = function () {
    this._doWhatWindow.y = this._doWhatWindow._commands.length === 3 ? 372 : 336;
};
