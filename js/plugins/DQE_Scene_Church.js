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
    this._actor = undefined;
    this._wait = null; // wait time for playing ME
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
    this.createSavefileList();
    this.createOnWhoWindow();
    this.createStatusWindow();
    this.createChoiceWindow();
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
    this._commandWindow.setHandler(Scene_Church.CONFESSION, this.commandConfession.bind(this));
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

Scene_Church.prototype.createSavefileList = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    this._saveWindow = new Window_SavefileList(x, 48, 924);
    this._saveWindow.setHandler('ok', this.onSaveOk.bind(this));
    this._saveWindow.setHandler('cancel', this.onSaveCancel.bind(this));
    this._saveWindow.hide();
    this.addWindow(this._saveWindow);
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

Scene_Church.prototype.createChoiceWindow = function () {
    this._choiceWindow = new Window_CustomCommand(0, 0, 156, ['Yes', 'No'], true);
    this._choiceWindow.setHandler('Yes', this.onChoiceYes.bind(this));
    this._choiceWindow.setHandler('No', this.onChoiceCancel.bind(this));
    this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
    this._choiceWindow.openness = 0;
    this._choiceWindow.deactivate();
    this.addWindow(this._choiceWindow);
};

Scene_Church.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageInputToggle();
    this._choiceWindow.x = (this._messageWindow.x + this._messageWindow.width) - this._choiceWindow.width;
    this._choiceWindow.y = this._messageWindow.y - this._choiceWindow.height - DQEng.Parameters.Windows.ChoiceList_ChoiceYOffset;
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

Scene_Church.prototype.commandConfession = function () {
    this._chosenCommand = Scene_Church.CONFESSION;
    this._helpWindow.hide();
    this._goldWindow.hide();
    this.displayMessage(this.saveMessage(), Scene_Church.prototype.confessionMessageCallback);
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

Scene_Church.prototype.onSaveOk = function () {
    this._saveWindow.showBackgroundDimmer();
    this.displayMessage(this.saveHereMessage(), Scene_Church.prototype.confirmChoiceMessageCallback);
};

Scene_Church.prototype.onSaveCancel = function () {
    this._saveWindow.hide();
    this._commandWindow.hideBackgroundDimmer();
    this.displayMessage(this.restartSceneMessage(), Scene_Church.prototype.backToMainMessageCallback);
};

Scene_Church.prototype.onOnWhoOk = function () {
    const actor = this._actor = $gameParty.members()[this._onWhoWindow.index()];
    const chosen = this._chosenCommand;
    this._onWhoWindow.hide();
    this._statusWindow.hide();
    if (this.isActorAffected(actor, chosen)) {
        this.generateGoldCost(actor, chosen);
        this.displayMessage(this.goldCostMessage(), Scene_Church.prototype.confirmChoiceMessageCallback);
    } else {
        this._messageWindow.setInput(true);
        this.displayMessage(this.unaffectedMessage(actor.name(), chosen), Scene_Church.prototype.unaffectedMessageCallback)
    }
};

Scene_Church.prototype.onOnWhoCancel = function () {
    this._onWhoWindow.hide();
    this._statusWindow.hide();
    this.displayMessage(this.restartSceneMessage(), Scene_Church.prototype.backToMainMessageCallback);
};

Scene_Church.prototype.onChoiceYes = function () {
    let msg = '';
    this._choiceWindow.close();
    if (this._chosenCommand === Scene_Church.CONFESSION) {
        this.onChoiceSave();
        return;
    }
    this._messageWindow.setInput(true);
    if ($gameParty.gold() >= this._goldCost) { // can afford gold contribution
        $gameParty.loseGold(this._goldCost);
        this._goldWindow.refresh();
        switch (this._chosenCommand) {
            case Scene_Church.RESURRECTION:
                msg = this.startResurrectionMessage(this._actor.name());
                break;
            case Scene_Church.PURIFICATION:
                msg = this.startPurificationMessage(this._actor.name());
                break;
            case Scene_Church.BENEDICTION:
                msg = this.startBenedictionMessage(this._actor.name());
                break;
        }
        this.displayMessage(msg, Scene_Church.prototype.doTaskMessageCallback);
    } else {
        msg = this.cantAffordMessage();
        this.displayMessage(msg, Scene_Church.prototype.unaffectedMessageCallback);
    }
};

Scene_Church.prototype.onChoiceSave = function () {
    SoundManager.playMeByName('Save');
    this.displayMessage(this.startSaveMessage(), Scene_Church.prototype.startSave)
};

Scene_Church.prototype.onChoiceCancel = function () {
    this._choiceWindow.close();
    if (this._chosenCommand === Scene_Church.CONFESSION) {
        this._saveWindow.hideBackgroundDimmer();
        this.displayMessage(this.saveMessage(), Scene_Church.prototype.activateSaveWindowCallback);
    } else {
        this.displayMessage(this.restartSceneMessage(), Scene_Church.prototype.backToMainMessageCallback);
    }
};

//////////////////////////////
// Functions - data
//////////////////////////////

Scene_Church.prototype.startSave = function () {
    const timeStart = Date.now();
    this._messageWindow.setInput(true);
    $gameSystem.onBeforeSave();
    if (DataManager.saveGame(this._saveWindow.savefileId())) {
        let timeTaken = Math.floor((Date.now() - timeStart) / 1000);
        this._wait = 330 - timeTaken;
    } else { // save failed
        AudioManager.stopMe();
        this.displayMessage(this.saveFailedMessage(), Scene_Church.prototype.popScene);
    }
};

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
    let pow = 1.25; // defaults to benediction cost
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

Scene_Church.prototype.healActor = function (actor) {
    switch (this._chosenCommand) {
        case Scene_Church.RESURRECTION:
            actor.removeState(this._actor.deathStateId());
            break;
        case Scene_Church.PURIFICATION:
            actor.removeState(this._actor.poisonStateId());
            actor.removeState(this._actor.envenomStateId());
            break;
        case Scene_Church.BENEDICTION:
            actor.removeState(this._actor.cursedStateId());
            break;
    }
    this._statusWindow.refresh();
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
    return `*: Welcome to our church, my child.\nHow may I help you?`;
};

Scene_Church.prototype.leaveMessage = function () {
    return `*: Great Goddess, may you watch over\nand protect this child!`;
};

Scene_Church.prototype.saveMessage = function () {
    return `*: Confess all that you have done before the almighty Goddess, child.`;
};

Scene_Church.prototype.saveHereMessage = function () {
    return `*: Do you wish me to make a record in this adventure log?`;
};

Scene_Church.prototype.startSaveMessage = function () {
    return `Saving adventure log...`;
};

Scene_Church.prototype.saveSuccessfulMessage = function () {
    return `*: I have successfully recorded your adventure log.`;
};

Scene_Church.prototype.saveFailedMessage = function () {
    return `SAVE FAILED! Please try again...\nIf the problem persists, please contact the developer.`;
};

Scene_Church.prototype.resurrectionMessage = function () {
    return `*: Whom do you wish brought back to the world of the living?`;
};

Scene_Church.prototype.startResurrectionMessage = function (name) {
    return `*: O great and benevolent Goddess!\nI beseech you to breathe life once more into your faithful servant, ${name}!`;
};

Scene_Church.prototype.purificationMessage = function () {
    return `*: Whom shall I treat for poison?`;
};

Scene_Church.prototype.startPurificationMessage = function (name) {
    return `*: O great and benevolent Goddess!\nPlease rid your faithful servant ${name} of this unholy poison!`;
};

Scene_Church.prototype.benedictionMessage = function () {
    return `*: Who needs a curse lifted?`;
};

Scene_Church.prototype.startBenedictionMessage = function (name) {
    return `*: O great and benevolent Goddess!\nPlease rid your faithful servant ${name} of this wretched curse!`;
};

Scene_Church.prototype.goldCostMessage = function () {
    return `*: In order to carry out this task, I shall require a contribution of \\c[7]${this._goldCost}\\c[1] gold coins. Will you oblige, my child?`;
};

Scene_Church.prototype.cantAffordMessage = function () {
    return `*: It seems that you cannot afford to make this humble donation.`;
};

Scene_Church.prototype.unaffectedMessage = function (name, type) {
    switch (type) {
        case Scene_Church.RESURRECTION:
            return `*: Surely you jest?\n${name} looks very much alive to me!`;
        case Scene_Church.PURIFICATION:
            return `*: ${name} doesn't seem to have a trace of poison in their system!`;
        case Scene_Church.BENEDICTION:
            return `*: ${name} may look tired but that doesn't mean they are cursed!`;
        default:
            return ``;
    }
};

Scene_Church.prototype.restartSceneMessage = function () {
    return `*: Is there any other way we can be of assistance?`;
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Church.prototype.introMessageCallback = function () {
    this._commandWindow.show();
    this._helpWindow.show();
    this._commandWindow.activate();
};

Scene_Church.prototype.confessionMessageCallback = function () {
    this._commandWindow.showBackgroundDimmer();
    this._saveWindow.select(0);
    this.activateSaveWindowCallback();
};

Scene_Church.prototype.activateSaveWindowCallback = function () {
    this._saveWindow.show();
    this._saveWindow.activate();
};

Scene_Church.prototype.saveEndMessageCallback = function () {
    this._commandWindow.hide();
    this._saveWindow.hide();
    this.displayMessage(this.leaveMessage(), Scene_Church.prototype.popScene);
};

Scene_Church.prototype.commonMessageCallback = function () {
    this._onWhoWindow.select(0);
    this._onWhoWindow.show();
    this._statusWindow.show();
    this._onWhoWindow.activate();
};

Scene_Church.prototype.confirmChoiceMessageCallback = function () {
    this._choiceWindow.open();
    this._choiceWindow.select(0);
    this._choiceWindow.activate();
};

Scene_Church.prototype.unaffectedMessageCallback = function () {
    this._messageWindow.setInput(false);
    this.displayMessage(this.restartSceneMessage(), Scene_Church.prototype.backToMainMessageCallback);
};

Scene_Church.prototype.doTaskMessageCallback = function () {
    this._wait = 300;
    this._messageWindow.setInput(false);
    SoundManager.playMeByName('Resurrection');
};

Scene_Church.prototype.backToMainMessageCallback = function () {
    this._commandWindow.show();
    this._helpWindow.show();
    this._goldWindow.show();
    this._commandWindow.activate();
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Scene_Church.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._wait !== null && this._wait-- <= 0)  {
        this._wait = null
        if (this._chosenCommand === Scene_Church.CONFESSION) {
            this._saveWindow.refresh();
            this._saveWindow.hideBackgroundDimmer();
            this.displayMessage(this.saveSuccessfulMessage(), Scene_Church.prototype.saveEndMessageCallback);
        } else {
            this.healActor(this._actor);
            this.displayMessage(this.restartSceneMessage(), Scene_Church.prototype.backToMainMessageCallback);
        }
    }
};