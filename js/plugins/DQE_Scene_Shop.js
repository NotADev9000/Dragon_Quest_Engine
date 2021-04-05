//=============================================================================
// Dragon Quest Engine - Scene Shop
// DQE_Scene_Shop.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the Shop menu - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_Shop = DQEng.Scene_Shop || {};

//-----------------------------------------------------------------------------
// Scene_Shop
//-----------------------------------------------------------------------------

Scene_Shop.TEXTSTYLE = 'generic';      // the messages to display when in the scene (check DQE_TextManager for more, check DQE_Plugin_Commands for changing style)

DQEng.Scene_Shop.prepare = Scene_Shop.prototype.prepare;
Scene_Shop.prototype.prepare = function (goods, purchaseOnly) {
    DQEng.Scene_Shop.prepare.call(this, goods, purchaseOnly);
    this._amount = 0; // amount player wants to buy/sell
    this._price = 0; // cost of transaction
};

Scene_MenuBase.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
};

Scene_Shop.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    // shop windows
    this.createCommandWindow();
    // gold
    this.createGoldWindow();
    // buy windows
    this.createBuyWindow();
    this.createMiscWindow();
    this.createItemStatsWindow();
    this.createActorStatsWindow();
    this.createCarryWindow();
    // misc windows
    this.createHelpWindow();
    this.createHowManyWindow();
    // party windows
    this.createPartyWindow();
    this.createInventoryWindow();
    // messages
    this.createChoiceWindow();
    this.createMessageWindow();
};

Scene_Shop.prototype.start = function () {
    this.displayMessage(this.welcomeMessage(), Scene_Shop.prototype.welcome_MessageCallback);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Shop.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledCommand(48, 48, 354, 'Do What?', ['Buy', 'Sell', 'Cancel']);
    this._commandWindow.setHandler('Buy', this.commandBuy.bind(this));
    this._commandWindow.setHandler('Cancel', this.commandCancel.bind(this));
    this._commandWindow.setHandler('cancel', this.commandCancel.bind(this));
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this.addWindow(this._commandWindow);
};

// gold

Scene_Shop.prototype.createGoldWindow = function () {
    this._goldWindow = new Window_Gold(0, 48);
    this._goldWindow.x = (Graphics.boxWidth - this._goldWindow.width) - 48;
    this.addWindow(this._goldWindow);
};

// buy windows

Scene_Shop.prototype.createBuyWindow = function () {
    const x = this._commandWindow.x;
    const y = this._commandWindow.y;
    this._buyWindow = new Window_ShopBuy(x, y, 714, 267, this._goods);
    this._buyWindow.hide();
    this._buyWindow.setHandler('ok', this.onBuyOk.bind(this));
    this._buyWindow.setHandler('next', this.onBuyNextStat.bind(this));
    this._buyWindow.setHandler('previous', this.onBuyNextStat.bind(this, true));
    this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
    this.addWindow(this._buyWindow);
};

Scene_Shop.prototype.createMiscWindow = function () {
    const x = this._buyWindow.x + this._buyWindow.width;
    const y = this._goldWindow.y + this._goldWindow.height;
    this._miscWindow = new Window_ShopMisc(x, y, 630, 108);
    this._miscWindow.hide();
    this._buyWindow.setHelpWindow(this._miscWindow);
    this.addWindow(this._miscWindow);
};

Scene_Shop.prototype.createItemStatsWindow = function () {
    const x = this._buyWindow.x;
    const y = this._buyWindow.y + this._buyWindow.height;
    const width = this._buyWindow.width;
    this._itemStatsWindow = new Window_ShopItemStats(x, y, width, 318);
    this._itemStatsWindow.hide();
    this._buyWindow.setHelpWindow(this._itemStatsWindow);
    this.addWindow(this._itemStatsWindow);
};

Scene_Shop.prototype.createActorStatsWindow = function () {
    const x = this._itemStatsWindow.x + this._itemStatsWindow.width;
    this._actorStatsWindow = new Window_ShopActorStats(x, 0, 630, 372);
    this._actorStatsWindow.y = this._itemStatsWindow.y - this._actorStatsWindow.titleBlockHeight();
    this._actorStatsWindow.hide();
    this._buyWindow.setHelpWindow(this._actorStatsWindow);
    this.addWindow(this._actorStatsWindow);
};

Scene_Shop.prototype.createCarryWindow = function () {
    const x = this._buyWindow.x;
    const y = this._buyWindow.y + this._buyWindow.height;
    this._carryWindow = new Window_ShopCarry(x, y, 1344, 318);
    this._carryWindow.hide();
    this._buyWindow.setHelpWindow(this._carryWindow);
    this.addWindow(this._carryWindow);
};

// misc windows

Scene_Shop.prototype.createHelpWindow = function () {
    const x = this._itemStatsWindow.x;
    const y = this._itemStatsWindow.y + this._itemStatsWindow.height;
    this._helpWindow = new Window_Help(x, y, 1344, 3);
    this._helpWindow.hide();
    this._buyWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._helpWindow);
};

Scene_Shop.prototype.createHowManyWindow = function () {
    this._howManyWindow = new Window_Number(this._buyWindow.x, this._buyWindow.y, 'How many?', 0, 0);
    this._howManyWindow.setHandler('ok', this.onHowManyOk.bind(this));
    this._howManyWindow.setHandler('cancel', this.onHowManyCancel.bind(this));
    this._howManyWindow.hide();
    this.addWindow(this._howManyWindow);
};

// party windows

Scene_Shop.prototype.createPartyWindow = function () {
    this._partyWindow = new Window_TitledPartyCommand(48, 48, 354, 'Who?', ['Bag']);
    this._partyWindow.setHandler('ok', this.onPartyOk.bind(this));
    this._partyWindow.setHandler('cancel', this.onPartyCancel.bind(this));
    this._partyWindow.hide();
    this._partyWindow.deactivate();
    this.addWindow(this._partyWindow);
};

Scene_Shop.prototype.createInventoryWindow = function () {
    const x = this._partyWindow.x + this._partyWindow.width;
    const y = this._partyWindow.y;
    this._inventoryWindow = new Window_ItemList(x, y, 594, 483);
    this._inventoryWindow.hide();
    this.addWindow(this._inventoryWindow);
    this._partyWindow.setAssociatedWindow(this._inventoryWindow);
};

// messages

Scene_Shop.prototype.createChoiceWindow = function () {
    this._choiceWindow = new Window_CustomCommand(0, 0, 156, ['Yes', 'No'], true);
    this._choiceWindow.setHandler('Yes', this.onChoiceYes.bind(this));
    this._choiceWindow.setHandler('No', this.onChoiceCancel.bind(this));
    this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
    this._choiceWindow.openness = 0;
    this._choiceWindow.deactivate();
    this.addWindow(this._choiceWindow);
};

Scene_Shop.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageInputToggle();
    this._choiceWindow.x = (this._messageWindow.x + this._messageWindow.width) - this._choiceWindow.width;
    this._choiceWindow.y = this._messageWindow.y - this._choiceWindow.height - DQEng.Parameters.Windows.ChoiceList_ChoiceYOffset;
    this.addWindow(this._messageWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Shop.prototype.commandBuy = function () {
    this._buyWindow.refresh();
    this._buyWindow.select(0);
    this._messageWindow.close();
    this._commandWindow.hide();
    this._buyWindow.show();
    this._miscWindow.show();
    this._helpWindow.show();
    this._buyWindow.activate();
};

Scene_Shop.prototype.commandCancel = function () {
    this._commandWindow.hide();
    this._messageWindow.setInput(true);
    this.displayMessage(this.leaveMessage(), Scene_Shop.prototype.popScene);
};

Scene_Shop.prototype.onBuyOk = function () {
    this._price = this._buyWindow.priceAtCurrentIndex();
    if ($gameParty.gold() >= this._price) {
        // can afford item
        this._item = this.item();
        this._buyWindow.showBackgroundDimmer();
        const maxAfford = this._buyWindow.maxAfford();
        if (maxAfford > 1) {
            // can afford > 1 of item
            this._howManyWindow.setup(1, maxAfford);
            this._howManyWindow.show();
            this._howManyWindow.activate();
        } else {
            // can only afford 1 of item
            this._amount = 1;
            this.dimBuyWindows();
            this.displayMessage(this.buyItemMessage(), Scene_Shop.prototype.confirmChoice_MessageCallback);
        }
    } else {
        // can't afford item
        this._messageWindow.setInput(true);
        this.dimBuyWindows();
        this.displayMessage(this.notEnoughGoldMessage(), Scene_Shop.prototype.backToBuy_MessageCallback)
    }
};

Scene_Shop.prototype.onBuyNextStat = function (backwards = false) {
    backwards ? this._actorStatsWindow.backwardIndex() : this._actorStatsWindow.forwardIndex();
};

Scene_Shop.prototype.onBuyCancel = function () {
    this._buyWindow.hideAllHelpWindows();
    this._buyWindow.hide();
    this.displayMessage(this.restartSceneMessage(), Scene_Shop.prototype.backToMain_MessageCallback);
};

Scene_Shop.prototype.onHowManyOk = function () {
    this._amount = this._howManyWindow.number();
    this._price *= this._amount;
    this.dimBuyWindows();
    this.displayMessage(this.buyItemMessage(), Scene_Shop.prototype.confirmChoice_MessageCallback);
};

Scene_Shop.prototype.onHowManyCancel = function () {
    this._howManyWindow.hide();
    this._buyWindow.hideBackgroundDimmer();
    this._buyWindow.activate();
};

Scene_Shop.prototype.onChoiceYes = function () {
    // hide buy windows
    this._choiceWindow.close();
    this._messageWindow.close();
    this._howManyWindow.hide();
    this._buyWindow.hideAllHelpWindows();
    this._buyWindow.hide();
    this.unDimBuyWindows();
    // display message
    this.displayMessage(this.carryPurchaseMessage(), Scene_Shop.prototype.carryPurchase_MessageCallback);
};

Scene_Shop.prototype.onChoiceCancel = function () {
    this._messageWindow.close();
    this._choiceWindow.close();
    this._howManyWindow.hide();
    this.unDimBuyWindows();
    this._buyWindow.activate();
};

/**
 * Confirmation of BUYING items
 */
Scene_Shop.prototype.onPartyOk = function () {
    if (this.inBag()) {
        // PLACE PURCHASE IN BAG
        this._partyWindow.hide();
        this._inventoryWindow.hide();
        this.takeGold();
        const message = Game_Interpreter.prototype.giveItems_Bag(this._item, this._amount);
        this._messageWindow.setInput(true);
        this.displayMessage(message, Scene_Shop.prototype.postPurchase_MessageCallback);
    } else {
        // GIVE PURCHASE TO ACTOR
        this.updateActor();
        if (this._actor.hasMaxItems()) {
            // ACTOR DOESN'T HAVE ROOM
            this._partyWindow.showBackgroundDimmer();
            this._inventoryWindow.showBackgroundDimmer();
            this.displayMessage(this._actor.inventoryFullCarryMessage(), Scene_Shop.prototype.fullInventory_MessageCallback);
        } else {
            // PLACE PURCHASE IN ACTOR INVENTORY
            this._partyWindow.hide();
            this._inventoryWindow.hide();
            this.takeGold();
            let message = Game_Interpreter.prototype.giveItems_Actor(this._item, this._amount, this._actor);
            message = Game_Interpreter.prototype.concat_Messages(message);
            this._messageWindow.setInput(true);
            this.displayMessage(message, Scene_Shop.prototype.postPurchase_MessageCallback);
        }
    }
};

Scene_Shop.prototype.onPartyCancel = function () {
    this._partyWindow.hide();
    this._inventoryWindow.hide();
    this.displayMessage(this.cancelBuyMessage(), Scene_Shop.prototype.backToMain_MessageCallback);
};

//////////////////////////////
// Functions - messages
//////////////////////////////

// flavour

Scene_Shop.prototype.welcomeMessage = function () {
    return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][0];
};

Scene_Shop.prototype.leaveMessage = function () {
    return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][1];
};

Scene_Shop.prototype.restartSceneMessage = function () {
    return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][2];
};

// buy

Scene_Shop.prototype.notEnoughGoldMessage = function () {
    return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][3];
};

Scene_Shop.prototype.buyItemMessage = function () {
    if (this._amount < 2) {
        return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][4].format(this._item.name, this._price);
    } else {
        return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][5].format(this._amount, this._item.name, this._price);
    }
};

Scene_Shop.prototype.carryPurchaseMessage = function () {
    return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][6];
};

Scene_Shop.prototype.cancelBuyMessage = function () {
    return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][7];
};

Scene_Shop.prototype.postPurchaseMessage = function () {
    return TextManager.terms.shopText[Scene_Shop.TEXTSTYLE][8];
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Shop.prototype.welcome_MessageCallback = function () {
    this._messageWindow.setInput(false);
    this._commandWindow.show();
    this._commandWindow.activate();
};

Scene_Shop.prototype.backToMain_MessageCallback = function () {
    this._commandWindow.show();
    this._commandWindow.activate();
};

Scene_Shop.prototype.backToBuy_MessageCallback = function () {
    this._messageWindow.setInput(false);
    this._messageWindow.close();
    this.unDimBuyWindows();
    this._buyWindow.activate();
};

Scene_Shop.prototype.confirmChoice_MessageCallback = function () {
    this._choiceWindow.select(0);
    this._choiceWindow.open();
    this._choiceWindow.activate();
};

Scene_Shop.prototype.carryPurchase_MessageCallback = function () {
    this._partyWindow.select(0);
    this._partyWindow.show();
    this._inventoryWindow.refresh();
    this._inventoryWindow.show();
    this._partyWindow.activate();
};

Scene_Shop.prototype.fullInventory_MessageCallback = function () {
    this._partyWindow.hideBackgroundDimmer();
    this._inventoryWindow.hideBackgroundDimmer();
    this._partyWindow.activate();
};

Scene_Shop.prototype.postPurchase_MessageCallback = function () {
    this._messageWindow.setInput(false);
    this.displayMessage(this.postPurchaseMessage(), Scene_Shop.prototype.backToMain_MessageCallback);
};

//////////////////////////////
// Functions - misc
//////////////////////////////

Scene_Shop.prototype.item = function () {
    return this._buyWindow.item();
};

Scene_Shop.prototype.takeGold = function () {
    $gameParty.loseGold(this._price);
    this._goldWindow.refresh();
};

// party options

Scene_Shop.prototype.inBag = function () {
    return !Number.isInteger(this._partyWindow.currentSymbol());
};

Scene_Shop.prototype.updateActor = function () {
    this._actor = $gameParty.members()[this._partyWindow.currentSymbol()];
};

// window dimmers

Scene_Shop.prototype.dimBuyWindows = function () {
    this._buyWindow.showBackgroundDimmer();
    this._buyWindow.showAllHelpWindowBackgroundDimmers();
};

Scene_Shop.prototype.unDimBuyWindows = function () {
    this._buyWindow.hideBackgroundDimmer();
    this._buyWindow.hideAllHelpWindowBackgroundDimmers();
};
