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
    this.createEquipStatsWindow();
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
    this._equipItemWindow.setHandler('ok', this.onEquipItemOk.bind(this));
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

Scene_Equip.prototype.createEquipStatsWindow = function () {
    let x = this._equipSlotWindow.x + this._equipSlotWindow.width;
    let y = this._equipSlotWindow.y;
    this._equipStatsWindow = new Window_EquipmentStats(x, y, 420, 450);
    this._equipStatsWindow.hide();
    this.addWindow(this._equipStatsWindow);
    this._commandWindow.setAssociatedWindow(this._equipStatsWindow);
    this._equipSlotWindow.setHelpWindow(this._equipStatsWindow);
    this._equipItemWindow.setHelpWindow(this._equipStatsWindow);
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
    this._equipSlotWindow.showAllHelpWindows();
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
    this._equipSlotWindow.hideAllHelpWindows();
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

Scene_Equip.prototype.onEquipItemOk = function () {
    // slot window
    let actor = this._equipSlotWindow._actor;
    let swapOut = actor.hasMaxItems() ? true : false;
    let slotIndex = this._equipSlotWindow.slotIndex(); // slot index for the currently equipped item
    let itemIndex = this._equipSlotWindow.orderInInventory()[slotIndex]; // index of item in actor inventory
    if (itemIndex === null && swapOut) itemIndex = actor.numItems()-1; // if an actor's inventory is full & there's no item to unequip, swap the last item in inventory
    // item window
    let data = this._equipItemWindow.data();
    let inBag = data.heldBy < 0;
    if (!inBag) var otherActor = $gameParty.members()[data.heldBy];
    let dataSlotIndex = slotIndex >= 4 ? slotIndex : actor.whichEquipSlot(data.item, this._equipSlotWindow.index()); // which slot the newly equipped item should go

    // messages & dimmers
    this.equipItemOkMessages(actor, swapOut, slotIndex, itemIndex, data, inBag, otherActor);

    // if equipping item from own inventory
    if (actor === otherActor) {
        actor.equipItemFromInv(data.index, dataSlotIndex);
    } else {
        // if there's an item to unequip
        if (itemIndex !== null) {
            var swapItem = actor.item(itemIndex);
            actor.unequipItem(itemIndex, !swapOut, slotIndex);
        }
        // other item needing to be removed/unequipped
        if (inBag) {
            $gameParty.loseItem(data.item, 1);
        } else {
            if (data.equipped) {
                otherActor.unequipItem(data.index, false, otherActor.getSlotData()[data.index]);
            } else {
                otherActor.removeItemAtIndex(data.index);
            }
        }
        // give actor item and equip it
        actor.giveItems(data.item, 1);
        actor.equipItemFromInv(actor.numItems() - 1, dataSlotIndex);
        // swap item if needed
        if (swapOut) {
            if (inBag) {
                $gameParty.gainItem(swapItem, 1);
            } else {
                otherActor.giveItems(swapItem, 1);
            }
        }
    }
};

Scene_Equip.prototype.onEquipItemCancel = function () {
    this._equipItemWindow.setLastSelected(this._equipItemWindow.index());
    this._equipItemWindow.hideHelpWindow(1);
    this._equipSlotWindow.show();
    this._equipItemWindow.hide();
    this._equipSlotWindow.activate();
};

//////////////////////////////
// Functions - messages
//////////////////////////////

Scene_Equip.prototype.noEquipItemsMessage = function () {
    return 'There are no items to equip!';
};

Scene_Equip.prototype.equipItemOkMessages = function (actor, swapOut, slotIndex, itemIndex, data, inBag, otherActor) {
    let message = '';
    this._equipItemWindow.showBackgroundDimmer();
    this._equipItemWindow.showAllHelpWindowBackgroundDimmers();
    if (inBag) {
        if (swapOut) {
            message = actor.tradeItemWithBagAndEquipMessage(itemIndex, data.item);
        } else {
            message = $gameParty.giveItemToActorAndEquipMessage(data.item, actor);
        }
    } else if (actor === otherActor) {
        message = actor.equipItemMessage(data.index);
    } else {
        if (swapOut) {
            message = actor.tradeItemWithActorAndEquipMessage(itemIndex, data.index, otherActor);
        } else {
            message = actor.getItemFromActorAndEquipMessage(data.index, otherActor);
        } 
    }
    this.displayMessage(message, Scene_Equip.prototype.onEquipItemMessageCallback);
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

Scene_Equip.prototype.onEquipItemMessageCallback = function () {
    this._equipSlotWindow.refresh();
    this._equipItemWindow.hideHelpWindow(1);
    this._equipSlotWindow.show();
    this._equipItemWindow.hide();
    this._equipItemWindow.hideBackgroundDimmer();
    this._equipItemWindow.hideAllHelpWindowBackgroundDimmers();
    this._equipSlotWindow.activate();
};
