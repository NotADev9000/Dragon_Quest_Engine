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
// Scene_ItemBase
//-----------------------------------------------------------------------------

/**
 * Returns false if item is not useable in menu
 */
Scene_ItemBase.prototype.canUse = function () {
    var user = this.user();
    if (user) {
        return user.canUse(this.item());
    }
    return false;
};

//-----------------------------------------------------------------------------
// Scene_Item
//-----------------------------------------------------------------------------

Scene_Item.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCommandWindow();
    this.createItemWindow();
    this.createDoWhatWindow();
    this.createUseOnWhoWindow();
    this.createTransferToWhoWindow();
    this.createTransferItemWindow();
    this.createMessageWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

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
    this._doWhatWindow.setHandler('Use', this.onDoWhatUse.bind(this));
    this._doWhatWindow.setHandler('Transfer', this.onDoWhatTransfer.bind(this));
    this._doWhatWindow.setHandler('cancel', this.onDoWhatCancel.bind(this));
    this._doWhatWindow.setHandler('Cancel', this.onDoWhatCancel.bind(this));
    this._doWhatWindow.hide();
    this.addWindow(this._doWhatWindow);
};

Scene_Item.prototype.createUseOnWhoWindow = function () {
    this._useOnWhoWindow = new Window_TitledPartyCommand(24, 48, 354, 'On Who?');
    this._useOnWhoWindow.deactivate();
    this._useOnWhoWindow.setHandler('cancel', this.onUseOnWhoCancel.bind(this));
    this._useOnWhoWindow.hide();
    this.addWindow(this._useOnWhoWindow);
}

Scene_Item.prototype.createTransferToWhoWindow = function () {
    this._transferToWhoWindow = new Window_TitledPartyCommand(24, 48, 354, 'To Who?');
    this._transferToWhoWindow.deactivate();
    this._transferToWhoWindow.setHandler('ok', this.onTransferToWhoOk.bind(this));
    this._transferToWhoWindow.setHandler('cancel', this.onTransferToWhoCancel.bind(this));
    this._transferToWhoWindow.hide();
    this.addWindow(this._transferToWhoWindow);
}

Scene_Item.prototype.createTransferItemWindow = function () {
    mainItemWin = this._itemWindow;
    this._transferItemWindow = new Window_ItemList(mainItemWin.x, mainItemWin.y, mainItemWin._width, mainItemWin._height);
    this._transferItemWindow.setHandler('cancel', this.onTransferItemCancel.bind(this));
    this._transferItemWindow.hide();
    this.addWindow(this._transferItemWindow);
    this._transferToWhoWindow.setAssociatedWindow(this._transferItemWindow);
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

Scene_Item.prototype.onDoWhatUse = function () {
    if (this.canUse()) {
        this._doWhatWindow.showBackgroundDimmer();
        this._useOnWhoWindow.select(0);
        this._useOnWhoWindow.show();
        this._useOnWhoWindow.activate();
    } else {
        this.displayMessage('This item cannot be used.', Scene_Item.prototype.doWhatUseMessage);
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
    this._transferItemWindow.show();
    this._transferToWhoWindow.activate();
};

Scene_Item.prototype.onDoWhatCancel = function () {
    this._itemWindow.hideBackgroundDimmer();
    this._helpWindow.hideBackgroundDimmer();
    this._doWhatWindow.hide();
    this._itemWindow.activate();
};

Scene_Item.prototype.onUseOnWhoCancel = function () {
    this._doWhatWindow.hideBackgroundDimmer();
    this._useOnWhoWindow.hide();
    this._doWhatWindow.activate();
};

/**
 * If transferring to bag then immediately move item.
 * If transferring to actor then open item window so
 * they can select an item to swap
 */
Scene_Item.prototype.onTransferToWhoOk = function () {
    if (this.inBag(this._transferToWhoWindow)) {
        var actor = $gameParty.members()[this._commandWindow.index()];
        var itemIndex = this._itemWindow.index();
        this.displayMessage(actor.giveItemToBagMessage(itemIndex), Scene_Item.prototype.transferToBagMessage);
        actor.giveItemToBag(itemIndex);
    } else {
        this._transferToWhoWindow.showBackgroundDimmer();
        this._transferItemWindow.activate();
        this._transferItemWindow.select(this._transferItemWindow._lastSelected);
    }
}

Scene_Item.prototype.onTransferToWhoCancel = function () {
    this._doWhatWindow.hideBackgroundDimmer();
    this._transferItemWindow.hide();
    this._transferToWhoWindow.hide();
    this._doWhatWindow.activate();
};

Scene_Item.prototype.onTransferItemCancel = function () {
    this._transferToWhoWindow.hideBackgroundDimmer();
    this._transferItemWindow.setLastSelected(this._transferItemWindow.index());
    this._transferItemWindow.deselect();
    this._transferToWhoWindow.activate();
};

//////////////////////////////
// Functions - managers
//////////////////////////////

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

/**
 * Bag command doesn't appear when transferring an 
 * item that is already in the bag
 */
Scene_Item.prototype.manageTransferToWhoCommands = function () {
    this._transferToWhoWindow._commands = this.inBag(this._commandWindow) ? null : ['Bag'];
}

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
}

Scene_Item.prototype.transferToBagMessage = function () {
    this._transferItemWindow.hide();
    this._transferToWhoWindow.hide();
    this._doWhatWindow.hide();
    this._doWhatWindow.hideBackgroundDimmer();
    this._itemWindow.hideBackgroundDimmer();
    this._helpWindow.hideBackgroundDimmer();
    this._itemWindow.refresh();
    if (this._commandWindow.isCurrentItemEnabled()) {
        this._itemWindow.activate();
    } else {
        this._commandWindow.hideBackgroundDimmer();
        this._helpWindow.hide();
        this._itemWindow.deselect();
        this._commandWindow.activate();
    }
}

//////////////////////////////
// Functions - misc.
//////////////////////////////

/**
 * Returns true if player is selecting
 * an option that's in the bag
 */
Scene_Item.prototype.inBag = function (commandWindow) {
    return !Number.isInteger(commandWindow.commandSymbol(commandWindow.index()));
}
