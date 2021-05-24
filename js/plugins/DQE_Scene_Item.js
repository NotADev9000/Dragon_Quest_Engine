//=============================================================================
// Dragon Quest Engine - Scene Item
// DQE_Scene_Item.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the item menu - V0.1
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
    this.createEquipStatsWindow();
    this.createItemSortWindow();
    this.createItemOrganiseWindow();
    this.createSendToBagWindow();
    this.createDoWhatWindow();
    this.createUseOnWhoWindow();
    this.createItemStatusWindow();
    this.createItemStatWindow();
    this.createTransferToWhoWindow();
    this.createTransferItemWindow();
    this.createHowManyWindow();
    this.createMessageWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Item.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(48, 639, 1344, 3);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Item.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand_ItemList(48, 48, 354, 'Items', ['Items', 'Equipment', 'Important']);
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._commandWindow.setCheckListIsEmpty(true);
    this.addWindow(this._commandWindow);
};

Scene_Item.prototype.createItemWindow = function () {
    var wx = this._commandWindow.x + this._commandWindow.windowWidth();
    this._itemWindow = new Window_ItemList_EquipStat(wx, 48, 594, 591, true);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._itemWindow.setHandler('sort', this.onSort.bind(this));
    this._itemWindow.setHandler('filter', this.onFilter.bind(this));
    this.addWindow(this._itemWindow);
    this._commandWindow.setHelpWindow(this._itemWindow);
};

Scene_Item.prototype.createEquipStatsWindow = function () {
    let x = this._itemWindow.x + this._itemWindow.width;
    let y = this._itemWindow.y;
    this._equipStatsWindow = new Window_EquipmentStats(x, y, 396, 468);
    this._equipStatsWindow.hide();
    this.addWindow(this._equipStatsWindow);
    this._commandWindow.setHelpWindow(this._equipStatsWindow);
    this._itemWindow.setHelpWindow(this._equipStatsWindow);
};

Scene_Item.prototype.createItemSortWindow = function () {
    const x = this._equipStatsWindow.x;
    const y = this._equipStatsWindow.y + this._equipStatsWindow.height;
    this._itemSortWindow = new Window_Sort(x, y, 396);
    this._itemSortWindow.hide();
    this.addWindow(this._itemSortWindow);
};

Scene_Item.prototype.createItemOrganiseWindow = function () {
    const x = this._equipStatsWindow.x;
    const y = this._equipStatsWindow.y + this._equipStatsWindow.height;
    this._itemOrganiseWindow = new Window_IconHelp(x, y, 396, 123, ['sort', 'filter'], ['Organise', 'Send to Bag'], 9, 15);
    this._itemOrganiseWindow.hide();
    this.addWindow(this._itemOrganiseWindow);
};

Scene_Item.prototype.createSendToBagWindow = function () {
    this._sendToBagWindow = new Window_TitledCommand(48, 48, 354, 'Send to Bag', ['Items', 'Equipment', 'Everything', 'Cancel']);
    this._sendToBagWindow.deactivate();
    this._sendToBagWindow.setHandler('ok', this.onSendToBagOk.bind(this));
    this._sendToBagWindow.setHandler('cancel', this.onSendToBagCancel.bind(this));
    this._sendToBagWindow.setHandler('Cancel', this.onSendToBagCancel.bind(this));
    this._sendToBagWindow.hide();
    this.addWindow(this._sendToBagWindow);
};

Scene_Item.prototype.createDoWhatWindow = function () {
    this._doWhatWindow = new Window_TitledCommand(120, 444, 282, 'Do What?');
    this._doWhatWindow.deactivate();
    this._doWhatWindow.setHandler('Use', this.onDoWhatUse.bind(this));
    this._doWhatWindow.setHandler('Transfer', this.onDoWhatTransfer.bind(this));
    this._doWhatWindow.setHandler('Equip', this.onDoWhatEquip.bind(this));
    this._doWhatWindow.setHandler('Unequip', this.onDoWhatUnequip.bind(this));
    this._doWhatWindow.setHandler('cancel', this.onDoWhatCancel.bind(this));
    this._doWhatWindow.setHandler('Cancel', this.onDoWhatCancel.bind(this));
    this._doWhatWindow.hide();
    this.addWindow(this._doWhatWindow);
};

Scene_Item.prototype.createUseOnWhoWindow = function () {
    this._useOnWhoWindow = new Window_TitledPartyCommand(48, 48, 354, 'On Who?');
    this._useOnWhoWindow.deactivate();
    this._useOnWhoWindow.setHandler('ok', this.onUseOnWhoOk.bind(this));
    this._useOnWhoWindow.setHandler('cancel', this.onUseOnWhoCancel.bind(this));
    this._useOnWhoWindow.hide();
    this.addWindow(this._useOnWhoWindow);
};

Scene_Item.prototype.createTransferToWhoWindow = function () {
    this._transferToWhoWindow = new Window_TitledPartyCommand_ItemList(48, 48, 354, 'To Who?');
    this._transferToWhoWindow.deactivate();
    this._transferToWhoWindow.setHandler('ok', this.onTransferToWhoOk.bind(this));
    this._transferToWhoWindow.setHandler('cancel', this.onTransferToWhoCancel.bind(this));
    this._transferToWhoWindow.hide();
    this.addWindow(this._transferToWhoWindow);
};

Scene_Item.prototype.createTransferItemWindow = function () {
    mainItemWin = this._itemWindow;
    this._transferItemWindow = new Window_ItemList(mainItemWin.x, mainItemWin.y, mainItemWin._width, mainItemWin._height, true);
    this._transferItemWindow.setHandler('ok', this.onTransferItemOk.bind(this));
    this._transferItemWindow.setHandler('cancel', this.onTransferItemCancel.bind(this));
    this._transferItemWindow.hide();
    this.addWindow(this._transferItemWindow);
    this._transferToWhoWindow.setHelpWindow(this._transferItemWindow);
};

Scene_Item.prototype.createHowManyWindow = function () {
    mainItemWin = this._itemWindow;
    this._howManyWindow = new Window_Number(mainItemWin.x, mainItemWin.y, 'How many?', 0, 0);
    this._howManyWindow.setHandler('ok', this.onHowManyOk.bind(this));
    this._howManyWindow.setHandler('cancel', this.onHowManyCancel.bind(this));
    this._howManyWindow.hide();
    this.addWindow(this._howManyWindow);
};

/**
 * Always call this window last so it's at front
 */
Scene_Item.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_Message();
    this.addWindow(this._messageWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Item.prototype.onCommandOk = function () {
    this._commandWindow.showBackgroundDimmer();
    this._itemWindow.activate();
    this._itemWindow.select(this._itemWindow._lastSelected);
    this._itemWindow.showHelpWindow();
    this.showSortWindows();
};

Scene_Item.prototype.onItemOk = function () {
    this.manageDoWhatCommands();
    this._doWhatWindow.clearCommandList();
    this._doWhatWindow.makeCommandList();
    this._doWhatWindow.updateWindowDisplay();
    this.manageDoWhatPosition();
    this._itemWindow.showBackgroundDimmer();
    this._itemWindow.showAllHelpWindowBackgroundDimmers();
    this.showSortWindowBackgroundDimmers();
    this._doWhatWindow.select(0);
    this._doWhatWindow.show();
    this._doWhatWindow.activate();
};

Scene_Item.prototype.onItemCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._itemWindow.hideAllHelpWindows();
    this.hideSortWindows();
    this._itemWindow.deselect();
    this._commandWindow.activate();
};

Scene_Item.prototype.onSort = function () {
    if (this.inBag(this._commandWindow)) {
        // sort bag items
        $gameParty.nextSortMethod();
        this._itemSortWindow.refresh();
    } else {
        // organise actor items
        const actor = $gameParty.members()[this._commandWindow.currentSymbol()];
        Data_Items.sortActorItems(actor);
    }
    this._itemWindow.refresh();
    this._itemWindow.callUpdateHelp();
};

Scene_Item.prototype.onFilter = function () {
    if (!this.inBag(this._commandWindow)) {
        this._itemWindow.deactivate();
        this._itemWindow.showBackgroundDimmer();
        this._itemWindow.showAllHelpWindowBackgroundDimmers();
        this.showSortWindowBackgroundDimmers();
        // open filter choice window
        this._sendToBagWindow.select(0);
        this._sendToBagWindow.show();
        this._sendToBagWindow.activate();
    }
};

Scene_Item.prototype.onSendToBagOk = function () {
    const actor = $gameParty.members()[this._commandWindow.currentSymbol()];
    const choice = this._sendToBagWindow.currentSymbol();
    let message;
    switch (choice) {
        case 'Items':
            actor.sendItemsOrEquipmentToBag();
            message = actor.sendItemsToBagMessage();
            break;
        case 'Equipment':
            actor.sendItemsOrEquipmentToBag(false);
            message = actor.sendEquipmentToBagMessage();
            break;
        default: // Everything
            actor.sendEverythingToBag();
            message = actor.sendEverythingToBagMessage();
            break;
    }
    this._itemWindow.refresh();
    this.displayMessage(message, Scene_Item.prototype.sentToBagMessage);
};

Scene_Item.prototype.onSendToBagCancel = function () {
    this._itemWindow.hideBackgroundDimmer();
    this._itemWindow.hideAllHelpWindowBackgroundDimmers();
    this.hideSortWindowBackgroundDimmers();
    this._sendToBagWindow.hide();
    this._itemWindow.activate();
};

Scene_Item.prototype.onDoWhatUse = function () {
    if (!this.canUse()) {
        this.displayMessage('This item cannot be used.', Scene_Item.prototype.doWhatUseMessage);
    } else if (this.action().isForAll()) {
        this.startItemUse(true);
    } else {
        this._doWhatWindow.showBackgroundDimmer();
        this._useOnWhoWindow.select(0);
        this._useOnWhoWindow.show();
        this._itemStatusWindow.show();
        this._itemStatWindow.setAction(this.action());
        this._itemStatWindow.show();
        this._useOnWhoWindow.activate();
    }
};

Scene_Item.prototype.onDoWhatTransfer = function () {
    this.manageTransferToWhoCommands();
    this._transferToWhoWindow._excludeActors = [this._commandWindow.currentSymbol()];
    this._transferToWhoWindow.clearCommandList();
    this._transferToWhoWindow.makeCommandList();
    this._transferToWhoWindow.updateWindowDisplay();
    this._doWhatWindow.showBackgroundDimmer();
    this._transferToWhoWindow.select(0);
    this._transferToWhoWindow.show();
    this._transferItemWindow.refresh();
    this._transferItemWindow.show();
    this._transferToWhoWindow.activate();
};

Scene_Item.prototype.onDoWhatEquip = function () {
    var actor = $gameParty.members()[this._commandWindow.currentSymbol()];
    var index = this._itemWindow.index();
    var item = this._itemWindow.item();

    if (actor.canEquip(item)) {
        SoundManager.playEquip();
        this.displayMessage(actor.equipItemMessage(index), Scene_Item.prototype.doWhatEquipMessage);
        actor.equipItemFromInv(index);
    } else {
        this.displayMessage(actor.cantEquipMessage(index), Scene_Item.prototype.doWhatEquipMessage);
    }
};

Scene_Item.prototype.onDoWhatUnequip = function () {
    var actor = $gameParty.members()[this._commandWindow.currentSymbol()];
    var index = this._itemWindow.index();
    var slotIndex = this._itemWindow.slotIndex();

    SoundManager.playEquip();
    this.displayMessage(actor.unequipItemMessage(index), Scene_Item.prototype.doWhatEquipMessage);
    actor.unequipItem(index, true, slotIndex);
};

Scene_Item.prototype.onDoWhatCancel = function () {
    this._itemWindow.hideBackgroundDimmer();
    this._itemWindow.hideAllHelpWindowBackgroundDimmers();
    this.hideSortWindowBackgroundDimmers();
    this._doWhatWindow.hide();
    this._itemWindow.activate();
};

Scene_Item.prototype.onUseOnWhoOk = function () {
    this.startItemUse();
};

Scene_Item.prototype.startItemUse = function (forAll = false) {
    var inBagInventory = this.inBag(this._commandWindow); // is the player looking in one of the three bag spaces?
    if (inBagInventory) {
        var takeFrom = this.user();
        var useByActor = takeFrom;
        var itemIndex = -1;
        var item = this.item();
    } else {
        var takeFrom = $gameParty.members()[this._commandWindow.currentSymbol()];
        var useByActor = this.user();
        var itemIndex = this._itemWindow.index();
        var item = takeFrom.item(itemIndex);
    }

    if (this.isItemEffectsValid()) {
        takeFrom.useItem(item, null, itemIndex);
        $gameMessage.add(useByActor.itemUsedMessage(item));
        this.applyItem();
        this.displayItemResultMessages(Scene_Item.prototype);
    } else if (forAll) {
        this.displayMessage(useByActor.triedToUseAllMessage(item), Scene_Item.prototype.triedToUseAll_MessageCallback);
    } else {
        let useOnActor = $gameParty.members()[this._useOnWhoWindow.currentSymbol()];
        this.displayMessage(useByActor.triedToUseMessage(item, useOnActor), Scene_Item.prototype.triedToUse_MessageCallback);
    }
};

Scene_Item.prototype.onUseOnWhoCancel = function () {
    this._doWhatWindow.hideBackgroundDimmer();
    this._useOnWhoWindow.hide();
    this._itemStatusWindow.hide();
    this._itemStatWindow.hide();
    this._doWhatWindow.activate();
};

/**
 * On confirmation of transferring an item
 * 
 * Moving an item to the bag or to an actor,
 * who has room, immediately transfers it.
 * 
 * If the actor's inventory is full then the
 * item window is opened and the player can
 * swap an item.
 */
Scene_Item.prototype.onTransferToWhoOk = function () {
    var inBagInventory = this.inBag(this._commandWindow); // is the player looking in one of the three bag spaces?
    var takeFrom = inBagInventory ? $gameParty : $gameParty.members()[this._commandWindow.currentSymbol()]; // where the item will be moved from
    var giveActor = $gameParty.members()[this._transferToWhoWindow.currentSymbol()]; // where the item will be moved to
    var item = inBagInventory ? this.item() : this._itemWindow.index(); // item to give
    var slotIndex = this._itemWindow.slotIndex();
    var itemAmount = inBagInventory ? takeFrom.numItems(item) : null;

    if (this.inBag(this._transferToWhoWindow)) { // transferring to bag
        this.displayMessage(takeFrom.giveItemToBagMessage(item), Scene_Item.prototype.transferredMessage);
        takeFrom.giveItemToBag(item, slotIndex);
    } else if (giveActor.hasMaxItems()) { // transferring to actor with a full inventory
        this.displayMessage(giveActor.inventoryFullMessage(item), Scene_Item.prototype.transferFullMessage);
    } else if (inBagInventory && giveActor.spaceLeft() > 1 && itemAmount > 1) { // transferring from bag to actor with inventory space
        this._transferToWhoWindow.showBackgroundDimmer();
        this._transferItemWindow.showBackgroundDimmer();
        this._howManyWindow.setup(1, Math.min(giveActor.spaceLeft(), itemAmount));
        this._howManyWindow.show();
        this._howManyWindow.activate();
    } else { // transferring from actor/bag to actor with inventory space
        this.displayMessage(takeFrom.giveItemToActorMessage(item, giveActor), Scene_Item.prototype.transferredMessage);
        if (inBagInventory) slotIndex = undefined;
        takeFrom.giveItemToActor(item, giveActor, slotIndex);
    }
};

Scene_Item.prototype.onTransferToWhoCancel = function () {
    this._doWhatWindow.hideBackgroundDimmer();
    this._transferItemWindow.hide();
    this._transferToWhoWindow.hide();
    this._doWhatWindow.activate();
};

Scene_Item.prototype.onTransferItemOk = function () {
    var inBagInventory = this.inBag(this._commandWindow); // is the player transferring from bag?
    var takeFrom = inBagInventory ? null : $gameParty.members()[this._commandWindow.currentSymbol()]; // where the item will be moved from
    var giveTo = $gameParty.members()[this._transferToWhoWindow.currentSymbol()]; // where the item will be moved to
    var item = inBagInventory ? this.item() : this._itemWindow.index(); // item to transfer
    var slotIndex = this._itemWindow.slotIndex();
    var swap = this._transferItemWindow.index(); // item to swap

    if (inBagInventory) {
        this.displayMessage(giveTo.tradeItemWithBagMessage(swap, item), Scene_Item.prototype.transferredMessage);
        giveTo.tradeItemWithBag(swap, item, slotIndex);
    } else {
        this.displayMessage(takeFrom.tradeItemWithActorMessage(item, swap, giveTo), Scene_Item.prototype.transferredMessage);
        let otherSlotIndex = this._transferItemWindow.slotIndex(); // the slot index for the actor being swapped with
        takeFrom.tradeItemWithActor(item, swap, giveTo, slotIndex, otherSlotIndex);
    }
};

Scene_Item.prototype.onTransferItemCancel = function () {
    this._transferToWhoWindow.hideBackgroundDimmer();
    this._transferItemWindow.deselect();
    this._transferToWhoWindow.activate();
};

Scene_Item.prototype.onHowManyOk = function () {
    var actor = $gameParty.members()[this._transferToWhoWindow.currentSymbol()];
    var amount = this._howManyWindow._number;
    this.displayMessage($gameParty.giveMultipleItemsToActorMessage(this.item(), actor, amount), Scene_Item.prototype.transferredMessage);
    $gameParty.giveItemToActor(this.item(), actor, -1, amount);
};

Scene_Item.prototype.onHowManyCancel = function () {
    this._transferToWhoWindow.hideBackgroundDimmer();
    this._transferItemWindow.hideBackgroundDimmer();
    this._howManyWindow.hide();
    this._transferToWhoWindow.activate();
};

//////////////////////////////
// Functions - managers
//////////////////////////////

Scene_Item.prototype.manageDoWhatCommands = function () {
    var inBag = this.inBag(this._commandWindow); // is the player looking in the bag space?
    var isEquipment = DataManager.isWeapon(this.item()) || DataManager.isArmor(this.item());

    this._doWhatWindow._commands = ['Use', 'Transfer', 'Cancel'];
    if (isEquipment && !inBag) {
        if (this._itemWindow.isEquippedItem(this._itemWindow.index())) {
            this._doWhatWindow._commands.splice(2, 0, 'Unequip');
        } else {
            this._doWhatWindow._commands.splice(2, 0, 'Equip');
        }
    }
};

Scene_Item.prototype.manageDoWhatPosition = function () {
    this._doWhatWindow.y = this._doWhatWindow._commands.length === 3 ? 444 : 408;
};

/**
 * Bag command doesn't appear when transferring
 * an item from the bag
 */
Scene_Item.prototype.manageTransferToWhoCommands = function () {
    this._transferToWhoWindow._commands = this.inBag(this._commandWindow) ? null : ['Bag'];
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

/**
 * This callback method is run when the player tries 
 * to use an unusable item and the corresponding
 * message box has closed
 */
Scene_Item.prototype.doWhatUseMessage = function () {
    this._doWhatWindow.activate();
};

Scene_Item.prototype.doWhatEquipMessage = function () {
    this._doWhatWindow.hide();
    this._itemWindow.hideBackgroundDimmer();
    this._itemWindow.hideAllHelpWindowBackgroundDimmers();
    this.hideSortWindowBackgroundDimmers();
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

Scene_Item.prototype.actionResolved_MessageCallback = function () {
    this.checkCommonEvent();
    this.checkGameover();
    this._useOnWhoWindow.hide();
    this._itemStatusWindow.hide();
    this._itemStatWindow.hide();
    this._itemWindow.hideBackgroundDimmer();
    this._itemWindow.hideAllHelpWindowBackgroundDimmers();
    this.hideSortWindowBackgroundDimmers();
    this._doWhatWindow.hideBackgroundDimmer();
    this._doWhatWindow.hide();
    this._itemWindow.refresh();
    if (this._commandWindow.isCurrentItemEnabled()) {
        this._itemWindow.activate();
    } else {
        this._commandWindow.hideBackgroundDimmer();
        this._itemWindow.hideAllHelpWindows();
        this.hideSortWindows();
        this._itemWindow.deselect();
        this._commandWindow.activate();
    }
};

/**
 * Used an item which failed
 */
Scene_Item.prototype.triedToUse_MessageCallback = function () {
    this._useOnWhoWindow.activate();
};

Scene_Item.prototype.triedToUseAll_MessageCallback = function () {
    this._doWhatWindow.activate();
};

Scene_Item.prototype.transferredMessage = function () {
    this._howManyWindow.hide();
    this._transferItemWindow.hide();
    this._transferItemWindow.hideBackgroundDimmer();
    this._transferItemWindow.deselect();
    this._transferToWhoWindow.hide();
    this._transferToWhoWindow.hideBackgroundDimmer();
    this._doWhatWindow.hide();
    this._doWhatWindow.hideBackgroundDimmer();
    this._itemWindow.hideBackgroundDimmer();
    this._itemWindow.hideAllHelpWindowBackgroundDimmers();
    this.hideSortWindowBackgroundDimmers();
    this._itemWindow.refresh();
    if (this._commandWindow.isCurrentItemEnabled()) {
        this._itemWindow.activate();
    } else {
        this._commandWindow.hideBackgroundDimmer();
        this._itemWindow.hideAllHelpWindows();
        this.hideSortWindows();
        this._itemWindow.deselect();
        this._commandWindow.activate();
    }
};

Scene_Item.prototype.transferFullMessage = function () {
    this._transferToWhoWindow.showBackgroundDimmer();
    this._transferItemWindow.activate();
    this._transferItemWindow.select(this._transferItemWindow._lastSelected);
};

Scene_Item.prototype.sentToBagMessage = function () {
    this.onSendToBagCancel();
};

//////////////////////////////
// Functions - misc.
//////////////////////////////

Scene_Item.prototype.user = function () {
    if (this.inBag(this._commandWindow)) {
        return $gameParty.movableMembers()[0];
    } else {
        let itemUser = $gameParty.members()[this._commandWindow.currentSymbol()];
        return itemUser.canMove() ? itemUser : $gameParty.movableMembers()[0];
    }
};

/**
 * Returns true if player is selecting
 * an option that's in the bag
 * 
 * @param {Window} selectionWindow checks if the current selection of this window is choosing the bag
 */
Scene_Item.prototype.inBag = function (selectionWindow) {
    return !Number.isInteger(selectionWindow.commandSymbol(selectionWindow.index()));
};

Scene_Item.prototype.refreshItemStatWindows = function () {
    this._itemStatusWindow.refresh();
    this._itemStatWindow.refresh();
};

Scene_Item.prototype.showSortWindows = function () {
    this.inBag(this._commandWindow) ? this._itemSortWindow.show() : this._itemOrganiseWindow.show();
};

Scene_Item.prototype.hideSortWindows = function () {
    this.inBag(this._commandWindow) ? this._itemSortWindow.hide() : this._itemOrganiseWindow.hide();
};

Scene_Item.prototype.showSortWindowBackgroundDimmers = function () {
    this.inBag(this._commandWindow) ? this._itemSortWindow.showBackgroundDimmer() : this._itemOrganiseWindow.showBackgroundDimmer();
};

Scene_Item.prototype.hideSortWindowBackgroundDimmers = function () {
    this.inBag(this._commandWindow) ? this._itemSortWindow.hideBackgroundDimmer() : this._itemOrganiseWindow.hideBackgroundDimmer();
};
