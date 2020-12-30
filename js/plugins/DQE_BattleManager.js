//=============================================================================
// Dragon Quest Engine - Battle Manager
// DQE_Battle_Manager.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Static class for managing the battle - V0.1
*
*
* @param Defeat Music Wait
* @desc How many seconds the game waits, when the party is wiped out, before ending the battle. Default: 7.
* @default 7
* 
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Battle_Manager = true;

var DQEng = DQEng || {};
DQEng.Battle_Manager = DQEng.Battle_Manager || {};

var parameters = PluginManager.parameters('DQE_BattleManager');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.BattleManager = {};
DQEng.Parameters.BattleManager.defeatWait = Number(parameters["Defeat Music Wait"]) || 7;

//-----------------------------------------------------------------------------
// Battle_Manager
//-----------------------------------------------------------------------------

BattleManager.setup = function (troopId, canEscape, canLose) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
};

DQEng.Battle_Manager.initMembers = BattleManager.initMembers;
BattleManager.initMembers = function () {
    DQEng.Battle_Manager.initMembers.call(this);
    this._preTurn = false;
    this._escapeRatio = 0.25;
};

/**
 * Displays emerge messages depending on enemy size & type
 * 
 * NOTE: If an 'appear halfway' enemy is first in the troop
 * these messages may not display correctly so always add hidden
 * enemies last
 */
BattleManager.displayStartMessages = function () {
    var groups = $gameTroop.groups();
    if (groups.length > 1) {
        $gameMessage.add('A group of enemies appears!');
    } else if (groups[0].enemies.length > 1) {
        $gameMessage.add(`A group of ${groups[0].name}s appears!`);
    } else {
        $gameMessage.add(TextManager.emerge.format(groups[0].name));
    }

    if (this._preemptive) {
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};

BattleManager.refreshSingleStatus = function (i) {
    this._statusWindow[i].refresh();
};

BattleManager.refreshStatus = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.refresh();
    });
};

BattleManager.startAction = function () {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item(), action._modifiedItem, action._itemIndex);
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
};

DQEng.Battle_Manager.displayDefeatMessage = BattleManager.displayDefeatMessage;
BattleManager.displayDefeatMessage = function () {
    DQEng.Battle_Manager.displayDefeatMessage.call(this);
    let wait = DQEng.Parameters.BattleManager.defeatWait;
    let text = '';
    for (let i = 0; i < wait; i++) {
        text += '\\|';
    }
    $gameMessage.add(text);
};

BattleManager.gainExp = function () {
    var exp = this._rewards.exp;
    var playSound = true; // play lv up sound
    $gameParty.allMembers().forEach(function (actor) {
        let lastLevel = actor._level;
        actor.gainExp(exp, playSound);
        if (actor._level > lastLevel) playSound = false;
    });
};

BattleManager.updateTurn = function () {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
        this._preTurn = false;
    }
    if (this._subject) {
        this._logWindow.opacity = 255;
        this.processTurn();
    } else if (!this.isForcedTurn()) {
        this.startPostTurn(1);
    } else {
        this.endTurn();
    }
};

BattleManager.processTurn = function () {
    var subject = this._subject;
    var action = subject.currentAction();
    if (!this._preTurn) {
        this._logWindow.displayCurrentState(subject);
        this._preTurn = true;
    }
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._subject = this.getNextSubject();
        this._preTurn = false;
    }
};

BattleManager.endTurn = function () {
    this._phase = 'turnEnd';
    this.allBattleMembers().forEach(battler => {
        battler.clearResult();
    }, this);
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
    this._logWindow.push('clear', true);
};

/**
 * formula: escape chance + (deftness/2000)
 * 
 * escape chance = 25% * (1 + times player has tried to escape)
 */
BattleManager.makeEscapeRatio = function () {
    return this._escapeRatio + ($gameParty.movableMembers()[0].param(7)/2000);
};

BattleManager.processEscape = function () {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : (Math.random() < this.makeEscapeRatio());
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.25;
        $gameParty.clearActions();
        this.startTurn();
    }
    return success;
};

DQEng.Battle_Manager.updateBattleEnd = BattleManager.updateBattleEnd;
BattleManager.updateBattleEnd = function () {
    this._logWindow.opacity = 0;
    this._logWindow.clear(true);
    DQEng.Battle_Manager.updateBattleEnd.call(this);
};

BattleManager.update = function () {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
            case 'start':
                this.startInput();
                break;
            case 'turn':
                this.updateTurn();
                break;
            case 'action':
                this.updateAction();
                break;
            case 'postTurn1':
                this.updatePostTurn(1);
                break;
            case 'postTurn2':
                this.updatePostTurn(2);
                break;
            case 'postTurnAction':
                this.updatePostTurnAction();
                break;
            case 'turnEnd':
                this.updateTurnEnd();
                break;
            case 'battleEnd':
                this.updateBattleEnd();
                break;
        }
    }
};

//////////////////////////////
// Functions - post turn
//////////////////////////////

BattleManager.startPostTurn = function (turnNum) {
    switch (turnNum) {
        case 1:
            this._phase = 'postTurn1';
            this._preemptive = false;
            this._surprise = false;
            this.allBattleMembers().forEach(function (battler) {
                battler.onPostTurn1(); // update state/buff turn counts
            });
            break;
        case 2:
            this._phase = 'postTurn2';
            this.allBattleMembers().forEach(function (battler) {
                battler.onPostTurn2(); // get states/regen to activate
            });
            break;
    }
    this._actionBattlers = this.allBattleMembers();
};

BattleManager.updatePostTurn = function (turnNum) {
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        turnNum === 1 ? this.processPostTurn1() : this.processPostTurn2();
    } else {
        turnNum === 1 ? this.startPostTurn(2) : this.endTurn();
    }
};

BattleManager.processPostTurn1 = function () {
    let subject = this._subject;
    let isActor = subject instanceof Game_Actor;
    let expiredState = subject.currentExpiringState();

    if (expiredState) {
        subject.removeStateAuto(0, expiredState);
        this._logWindow.displayAutoAffectedStatus(subject);
        if (isActor) this.refreshStatus();
        subject.clearResult();
    } else {
        this._subject = this.getNextSubject();
    }
};

BattleManager.processPostTurn2 = function () {
    let subject = this._subject;
    let isActor = subject instanceof Game_Actor;
    let action = subject.currentAction();

    subject.clearResult();
    if (action > 0) { // state effect
        this.startPostTurnAction();
        subject.removeCurrentAction();
    } else if (action) { // stat regen
        subject.invokeRegen(action);
        this._logWindow.displayRegeneration(subject);
        if (isActor) this.refreshStatus();
        subject.removeCurrentAction();
    } else {
        this._subject = this.getNextSubject();
    }
};

BattleManager.startPostTurnAction = function () {
    let subject = this._subject;
    let action = subject.currentAction();
    
    this._action = action;
    this._phase = 'postTurnAction';
    this._logWindow.displayTurnEndState(subject, action);
};

BattleManager.updatePostTurnAction = function () {
    let subject = this._subject;
    let isActor = subject instanceof Game_Actor;

    subject.invokeStateEffects(this._action);
    this._logWindow.displayDamage(subject);
    this._logWindow.displayAffectedStatus(subject);
    this._logWindow.push('waitForNewLine');
    this._logWindow.push('clear');
    this._phase = 'postTurn2';
    if (isActor) this.refreshStatus();
};
