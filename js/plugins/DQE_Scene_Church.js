//=============================================================================
// Dragon Quest Engine - Scene Church
// DQE_Scene_Church.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the priest/statue menus - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_Church = DQEng.Scene_Church || {};

//-----------------------------------------------------------------------------
// Scene_Church
//-----------------------------------------------------------------------------

function Scene_Church() {
    this.initialize.apply(this, arguments);
}

Scene_Church.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Church.prototype.constructor = Scene_Church;

Scene_Church.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._windowsCreated = false; // have all windows in scene been created?
    this._chosenCommand = Scene_Church.RESURRECTION; // identifies which action to take when actor is selected in _onWho window
    this._goldCost = 0; // how much the task costs
};

Scene_Church.CONFESSION =   'Confession';
Scene_Church.RESURRECTION = 'Resurrection';
Scene_Church.PURIFICATION = 'Purification';
Scene_Church.BENEDICTION =  'Benediction';


Scene_Church.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createHelpWindow();
    this.createGoldWindow();
    this.createOnWhoWindow();
    this.createStatusWindow();
    this.createMessageWindow();
    // set windows created
    this._windowsCreated = true;
    this.changeHelp(Scene_Church.CONFESSION);
};

Scene_Church.prototype.start = function () {
    this.displayMessage(this.introMessage(), Scene_Church.prototype.introMessageCallback);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Church.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledCommand(
        48, 
        48, 
        354, 
        'Do What?', 
        [Scene_Church.CONFESSION, 
        Scene_Church.RESURRECTION, 
        Scene_Church.PURIFICATION, 
        Scene_Church.BENEDICTION, 
        'Cancel'], 
        Scene_Church.prototype.changeHelp
    );
    this._commandWindow.setHandler(Scene_Church.RESURRECTION, this.commandResurrection.bind(this));
    this._commandWindow.setHandler(Scene_Church.PURIFICATION, this.commandPurification.bind(this));
    this._commandWindow.setHandler(Scene_Church.BENEDICTION, this.commandBenediction.bind(this));
    this._commandWindow.setHandler('Cancel', this.commandCancel.bind(this));
    this._commandWindow.setHandler('cancel', this.commandCancel.bind(this));
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this.addWindow(this._commandWindow);
};

Scene_Church.prototype.createHelpWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    this._helpWindow = new Window_Help(x, 48, 684, 3);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Church.prototype.createGoldWindow = function () {
    this._goldWindow = new Window_Gold(0, 48);
    this._goldWindow.x = (Graphics.boxWidth - this._goldWindow.width) - 48;
    this.addWindow(this._goldWindow);
};

Scene_Church.prototype.createOnWhoWindow = function () {
    this._onWhoWindow = new Window_TitledPartyCommand(48, 48, 354, 'On Who?');
    this._onWhoWindow.setHandler('ok', this.onOnWhoOk.bind(this));
    this._onWhoWindow.setHandler('cancel', this.onOnWhoCancel.bind(this));
    this._onWhoWindow.hide();
    this._onWhoWindow.deactivate();
    this.addWindow(this._onWhoWindow);
};

Scene_Church.prototype.createStatusWindow = function () {
    let x = this._onWhoWindow.x + this._onWhoWindow.width;
    this._statusWindow = new Window_BattleStatus(x, 48, undefined, 'center');
    this._statusWindow.hide();
    this._onWhoWindow.setAssociatedWindow(this._statusWindow);
    this.addWindow(this._statusWindow);
};

Scene_Church.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageInputToggle();
    this.addWindow(this._messageWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Church.prototype.commandCancel = function () {
    this._commandWindow.hide();
    this._helpWindow.hide();
    this._messageWindow.setInput(true);
    this.displayMessage(this.leaveMessage(), Scene_Church.prototype.popScene);
};

Scene_Church.prototype.commandResurrection = function () {
    this._chosenCommand = Scene_Church.RESURRECTION;
    this._commandWindow.hide();
    this._helpWindow.hide();
    this.displayMessage(this.resurrectionMessage(), Scene_Church.prototype.commonMessageCallback);
};

Scene_Church.prototype.commandPurification = function () {
    this._chosenCommand = Scene_Church.PURIFICATION;
    this._commandWindow.hide();
    this._helpWindow.hide();
    this.displayMessage(this.purificationMessage(), Scene_Church.prototype.commonMessageCallback);
};

Scene_Church.prototype.commandBenediction = function () {
    this._chosenCommand = Scene_Church.BENEDICTION;
    this._commandWindow.hide();
    this._helpWindow.hide();
    this.displayMessage(this.benedictionMessage(), Scene_Church.prototype.commonMessageCallback);
};

Scene_Church.prototype.onOnWhoOk = function () {
    const actor = $gameParty.members()[this._onWhoWindow.index()];
    const chosen = this._chosenCommand;
    this._onWhoWindow.hide();
    this._statusWindow.hide();
    if (this.isActorAffected(actor, chosen)) {
        this.generateGoldCost(actor, chosen);
        this.displayMessage(this.goldCostMessage(), Scene_Church.prototype.confirmChoiceMessageCallback);
    } else {
        this._messageWindow.setInput(true);
        this.displayMessage(this.unaffectedMessage(actor, chosen), Scene_Church.prototype.unaffectedMessageCallback)
    }
};

Scene_Church.prototype.onOnWhoCancel = function () {
    this._onWhoWindow.hide();
    this._statusWindow.hide();
    this.displayMessage(this.restartSceneMessage(), Scene_Church.prototype.backToMainMessageCallback);
};

//////////////////////////////
// Functions - data
//////////////////////////////

/**
 * Is given actor affected by selected status condition
 * 
 * @param {Game_Actor} actor to check if affected
 * @param {String} type of status to check
 */
Scene_Church.prototype.isActorAffected = function (actor, type) {
    switch (type) {
        case Scene_Church.RESURRECTION:
            return actor.isDead();
        case Scene_Church.PURIFICATION:
            return actor.needsPurifying();
        case Scene_Church.BENEDICTION:
            return actor.needsBenediction();
        default:
            return false;
    }
};

Scene_Church.prototype.generateGoldCost = function (actor, type) {
    const lv = actor.level;
    let pow = 1.25;
    switch (type) {
        case Scene_Church.RESURRECTION:
            pow = 2;
            break;
        case Scene_Church.PURIFICATION:
            pow = 1.5;
            break;
    }
    this._goldCost = Math.max(2, Math.floor(Math.pow(lv, pow)));
};

//////////////////////////////
// Functions - selection callbacks
//////////////////////////////

/**
 * @param {String} symbol the command windows current selection
 */
Scene_Church.prototype.changeHelp = function (symbol) {
    if (this._windowsCreated) {
        switch (symbol) {
            case Scene_Church.CONFESSION:
                this._helpWindow.setItem('\\c[6]Save\\c[0] your game and record the details of your journey so far.');
                break;
            case Scene_Church.RESURRECTION:
                this._helpWindow.setItem('Bring a party member back from the dead.');
                break;
            case Scene_Church.PURIFICATION:
                this._helpWindow.setItem('Purify a poisoned or envenomated party member.');
                break;
            case Scene_Church.BENEDICTION:
                this._helpWindow.setItem('Cure a cursed party member.');
                break;
            case 'Cancel':
                this._helpWindow.setItem('Close the menu.');
                break;
        }
    }
};

//////////////////////////////
// Functions - messages
//////////////////////////////

Scene_Church.prototype.introMessage = function () {
    return `Welcome to our church, my child.\nHow may I help you?`;
};

Scene_Church.prototype.leaveMessage = function () {
    return `Great Goddess, may you watch over\nand protect this child!`;
};

Scene_Church.prototype.resurrectionMessage = function () {
    return `Whom do you wish brought back to the world of the living?`;
};

Scene_Church.prototype.purificationMessage = function () {
    return `Whom shall I treat for poison?`;
};

Scene_Church.prototype.benedictionMessage = function () {
    return `Who needs a curse lifted?`;
};

Scene_Church.prototype.goldCostMessage = function () {
    return `In order to carry out this task, I shall require a contribution of \\c[7]${this._goldCost}\\c[1] gold coins. Will you oblige, my child?`;
};

Scene_Church.prototype.unaffectedMessage = function (actor, type) {
    const name = actor.name();
    switch (type) {
        case Scene_Church.RESURRECTION:
            return `Surely you jest?\n${name} looks very much alive to me!`;
        case Scene_Church.PURIFICATION:
            return `${name} doesn't seem to have a trace of poison in their system!`;
        case Scene_Church.BENEDICTION:
            return `${name} may look tired but that doesn't mean they are cursed!`;
        default:
            return ``;
    }
};

Scene_Church.prototype.restartSceneMessage = function () {
    return `Is there any other way we can be of assistance?`;
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Church.prototype.introMessageCallback = function () {
    this._commandWindow.show();
    this._helpWindow.show();
    this._commandWindow.activate();
};

Scene_Church.prototype.commonMessageCallback = function () {
    this._onWhoWindow.select(0);
    this._onWhoWindow.show();
    this._statusWindow.show();
    this._onWhoWindow.activate();
};

Scene_Church.prototype.confirmChoiceMessageCallback = function () {
    
};

Scene_Church.prototype.unaffectedMessageCallback = function () {
    this._messageWindow.setInput(false);
    this.displayMessage(this.restartSceneMessage(), Scene_Church.prototype.backToMainMessageCallback);
};

Scene_Church.prototype.backToMainMessageCallback = function () {
    this._commandWindow.show();
    this._helpWindow.show();
    this._commandWindow.activate();
};
