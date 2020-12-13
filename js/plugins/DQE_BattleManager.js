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
    let expiredState = subject.currentExpiringState(2);

    if (expiredState) {
        subject.removeStateAuto(2, expiredState);
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
        // this.startPostTurnAction();
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
