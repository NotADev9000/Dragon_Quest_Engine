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

BattleManager.refreshStatus = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.refresh();
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
    } else {
        this.endTurn();
    }
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

DQEng.Battle_Manager.updateBattleEnd = BattleManager.updateBattleEnd;
BattleManager.updateBattleEnd = function () {
    this._logWindow.opacity = 0;
    DQEng.Battle_Manager.updateBattleEnd.call(this);
};
