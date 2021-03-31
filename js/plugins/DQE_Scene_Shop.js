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

Scene_Shop.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    // gold
    this.createGoldWindow();
    // item lists
    this.createBuyWindow();
    this.createMiscWindow();
    this.createItemStatsWindow();
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

// item lists

Scene_Shop.prototype.createBuyWindow = function () {
    const x = this._commandWindow.x;
    const y = this._commandWindow.y;
    this._buyWindow = new Window_ShopBuy(x, y, 714, 267, this._goods);
    this._buyWindow.hide();
    // this._buyWindow.setHandler('ok', this.onBuyOk.bind(this));
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

// messages

Scene_Shop.prototype.createChoiceWindow = function () {
    this._choiceWindow = new Window_CustomCommand(0, 0, 156, ['Yes', 'No'], true);
    // this._choiceWindow.setHandler('Yes', this.onChoiceYes.bind(this));
    // this._choiceWindow.setHandler('No', this.onChoiceCancel.bind(this));
    // this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
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
    this._buyWindow.activate();
};

Scene_Shop.prototype.commandCancel = function () {
    this._commandWindow.hide();
    this._messageWindow.setInput(true);
    this.displayMessage(this.leaveMessage(), Scene_Shop.prototype.popScene);
};

Scene_Shop.prototype.onBuyCancel = function () {
    this._buyWindow.hideAllHelpWindows();
    this._buyWindow.hide();
    this.displayMessage(this.restartSceneMessage(), Scene_Shop.prototype.backToMain_MessageCallback);
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
