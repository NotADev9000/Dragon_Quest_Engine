//=============================================================================
// Dragon Quest Engine - Scene Bank
// DQE_Scene_Bank.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the bank - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_Bank = DQEng.Scene_Bank || {};

//-----------------------------------------------------------------------------
// Scene_Bank
//-----------------------------------------------------------------------------

function Scene_Bank() {
    this.initialize.apply(this, arguments);
}

Scene_Bank.DEPOSIT = 'Deposit';
Scene_Bank.WITHDRAW = 'Withdrawal';
Scene_Bank.TEXTSTYLE = 'generic';      // the messages to display when in the scene (check DQE_TextManager for more, check DQE_Plugin_Commands for changing style)

Scene_Bank.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Bank.prototype.constructor = Scene_Bank;

Scene_Bank.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._chosenCommand = Scene_Bank.DEPOSIT;
    this._goldTransfer = 0; // how much gold to be deposited/withdrawed
};

Scene_Bank.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createInputWindow();
    this.createGoldWindow();
    this.createChoiceWindow();
    this.createMessageWindow();
};

Scene_Bank.prototype.start = function () {
    this._messageWindow.setInput(true);
    this.displayMessage(this.welcomeMessage(), Scene_Bank.prototype.welcome_MessageCallback);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Bank.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledCommand(48, 48, 354, 'Do What?', [Scene_Bank.DEPOSIT, Scene_Bank.WITHDRAW, 'Leave']);
    this._commandWindow.setHandler(Scene_Bank.DEPOSIT, this.commandDeposit.bind(this));
    this._commandWindow.setHandler(Scene_Bank.WITHDRAW, this.commandWithdraw.bind(this));
    this._commandWindow.setHandler('Leave', this.commandCancel.bind(this));
    this._commandWindow.setHandler('cancel', this.commandCancel.bind(this));
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this.addWindow(this._commandWindow);
};

Scene_Bank.prototype.createGoldWindow = function () {
    this._goldWindow = new Window_Gold(0, 48);
    this._goldWindow.x = (Graphics.boxWidth - this._goldWindow.width) - 48;
    this.addWindow(this._goldWindow);
};

Scene_Bank.prototype.createInputWindow = function () {
    const x = this._commandWindow.x + this._commandWindow.width;
    const y = this._commandWindow.y;
    this._inputWindow = new Window_NumberInput(x, y, 8);
    this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
    this._inputWindow.setHandler('cancel', this.onInputCancel.bind(this));
    this._inputWindow.openness = 0;
    this.addWindow(this._inputWindow);
};

Scene_Bank.prototype.createChoiceWindow = function () {
    this._choiceWindow = new Window_CustomCommand(0, 0, 156, ['Yes', 'No'], true);
    this._choiceWindow.setHandler('Yes', this.onChoiceYes.bind(this));
    this._choiceWindow.setHandler('No', this.onChoiceCancel.bind(this));
    this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
    this._choiceWindow.openness = 0;
    this._choiceWindow.deactivate();
    this.addWindow(this._choiceWindow);
};

Scene_Bank.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageInputToggle();
    this._choiceWindow.x = (this._messageWindow.x + this._messageWindow.width) - this._choiceWindow.width;
    this._choiceWindow.y = this._messageWindow.y - this._choiceWindow.height - Window_ChoiceList.ChoiceYOffset;
    this.addWindow(this._messageWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Bank.prototype.commandDeposit = function () {
    this._commandWindow.showBackgroundDimmer();
    if ($gameParty.hasMaxBankGold()) {
        this._messageWindow.setInput(true);
        this.displayMessage(this.maxGoldInBankMessage(), Scene_Bank.prototype.errorGoldInBank_MessageCallback)
    } else {
        this.displayMessage(this.depositMessage(), Scene_Bank.prototype.deposit_MessageCallback);
    }
};

Scene_Bank.prototype.commandWithdraw = function () {
    this._commandWindow.showBackgroundDimmer();
    if ($gameParty.hasNoBankGold()) {
        this._messageWindow.setInput(true);
        this.displayMessage(this.noGoldInBankMessage(), Scene_Bank.prototype.errorGoldInBank_MessageCallback)
    } else {
        this.displayMessage(this.withdrawMessage(), Scene_Bank.prototype.withdraw_MessageCallback);
    }
};

Scene_Bank.prototype.commandCancel = function () {
    this._commandWindow.hide();
    this._messageWindow.setInput(true);
    this.displayMessage(this.leaveMessage(), Scene_Bank.prototype.popScene);
};

Scene_Bank.prototype.onInputOk = function () {
    this._goldTransfer = this._inputWindow.number();
    if (this._goldTransfer <= 0) {
        this.onInputCancel();
        return;
    }
    switch (this._chosenCommand) {
        case Scene_Bank.DEPOSIT:
            if (this._goldTransfer > $gameParty.gold()) {
                this._messageWindow.setInput(true);
                this.displayMessage(this.notEnoughGoldMessage(), Scene_Bank.prototype.notEnoughGold_MessageCallback);
            } else {
                this.displayMessage(this.depositChoiceMessage(), Scene_Bank.prototype.confirmChoice_MessageCallback);
            }
            break;
        case Scene_Bank.WITHDRAW:
            if (this._goldTransfer > $gameParty.bankGold()) {
                this._messageWindow.setInput(true);
                this.displayMessage(this.notEnoughGoldInBankMessage(), Scene_Bank.prototype.notEnoughGoldInBank_MessageCallback);
            } else {
                this.displayMessage(this.withdrawChoiceMessage(), Scene_Bank.prototype.confirmChoice_MessageCallback);
            }
            break;
    }
};

Scene_Bank.prototype.onInputCancel = function () {
    this._inputWindow.close();
    this.displayMessage(this.restartSceneMessage(), Scene_Bank.prototype.backToMain_MessageCallback);
};

Scene_Bank.prototype.onChoiceYes = function () {
    this._choiceWindow.close();
    this._inputWindow.close();
    this._messageWindow.setInput(true);
    switch (this._chosenCommand) {
        case Scene_Bank.DEPOSIT:
            $gameParty.depositGold(this._goldTransfer);
            this._goldWindow.refresh();
            this.displayMessage(this.depositStartMessage(), Scene_Bank.prototype.depositedOrWithdrawed_MessageCallback);
            break;
        case Scene_Bank.WITHDRAW:
            $gameParty.withdrawGold(this._goldTransfer);
            this._goldWindow.refresh();
            this.displayMessage(this.withdrawStartMessage(), Scene_Bank.prototype.depositedOrWithdrawed_MessageCallback);
            break;
    }
};

Scene_Bank.prototype.onChoiceCancel = function () {
    this._choiceWindow.close();
    this._inputWindow.close();
    this.displayMessage(this.restartSceneMessage(), Scene_Bank.prototype.backToMain_MessageCallback);
};

//////////////////////////////
// Functions - data
//////////////////////////////

Scene_Bank.prototype.goldDisplay = function (transfer = false) {
    const gold = transfer ? this._goldTransfer : $gameParty.bankGold();
    return `${gold}\\c[7]${TextManager.currencyUnit}\\c[1]`;
};

Scene_Bank.prototype.activateInputWindow = function () {
    this._inputWindow.initNumber();
    this._inputWindow.select(this._inputWindow.maxItems() - 1);
    this._inputWindow.open();
    this._inputWindow.activate();
};

//////////////////////////////
// Functions - messages
//////////////////////////////

// flavour

Scene_Bank.prototype.welcomeMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][0];
};

Scene_Bank.prototype.introMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][1].format(this.goldDisplay());
};

Scene_Bank.prototype.leaveMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][2].format(this.goldDisplay());
};

// deposit

Scene_Bank.prototype.maxGoldInBankMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][3];
};

Scene_Bank.prototype.depositMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][4];
};

Scene_Bank.prototype.notEnoughGoldMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][5];
};

Scene_Bank.prototype.depositChoiceMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][6].format(this.goldDisplay(true));
};

Scene_Bank.prototype.depositStartMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][7];
};

// withdraw

Scene_Bank.prototype.noGoldInBankMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][8];
};

Scene_Bank.prototype.withdrawMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][9].format(this.goldDisplay());
};

Scene_Bank.prototype.notEnoughGoldInBankMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][10];
};

Scene_Bank.prototype.withdrawChoiceMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][11].format(this.goldDisplay(true));
};

Scene_Bank.prototype.withdrawStartMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][12];
};

// flavour 2

Scene_Bank.prototype.restartSceneMessage = function () {
    return TextManager.terms.bankText[Scene_Bank.TEXTSTYLE][13].format(this.goldDisplay());
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Bank.prototype.welcome_MessageCallback = function () {
    this._messageWindow.setInput(false);
    this.displayMessage(this.introMessage(), Scene_Bank.prototype.intro_MessageCallback);
};

Scene_Bank.prototype.intro_MessageCallback = function () {
    this._commandWindow.show();
    this._commandWindow.activate();
};

Scene_Bank.prototype.errorGoldInBank_MessageCallback = function () {
    this._messageWindow.setInput(false);
    this.displayMessage(this.restartSceneMessage(), Scene_Bank.prototype.backToMain_MessageCallback);
};

Scene_Bank.prototype.deposit_MessageCallback = function () {
    this._chosenCommand = Scene_Bank.DEPOSIT;
    this.activateInputWindow();
};

Scene_Bank.prototype.notEnoughGold_MessageCallback = function () {
    this._messageWindow.setInput(false);
    this.displayMessage(this.depositMessage(), Scene_Bank.prototype.deposit_MessageCallback);
};

Scene_Bank.prototype.withdraw_MessageCallback = function () {
    this._chosenCommand = Scene_Bank.WITHDRAW;
    this.activateInputWindow();
};

Scene_Bank.prototype.notEnoughGoldInBank_MessageCallback = function () {
    this._messageWindow.setInput(false);
    this.displayMessage(this.withdrawMessage(), Scene_Bank.prototype.withdraw_MessageCallback);
};

Scene_Bank.prototype.confirmChoice_MessageCallback = function () {
    this._choiceWindow.open();
    this._choiceWindow.select(0);
    this._choiceWindow.activate();
};

Scene_Bank.prototype.depositedOrWithdrawed_MessageCallback = function () {
    this.displayMessage(this.leaveMessage(), Scene_Bank.prototype.popScene);
};

Scene_Bank.prototype.backToMain_MessageCallback = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};
