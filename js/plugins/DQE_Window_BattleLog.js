//=============================================================================
// Dragon Quest Engine - Window Battle Log
// DQE_Window_BattleLog.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying battle progress - V0.1
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
Imported.DQEng_Window_BattleLog = true;

var DQEng = DQEng || {};
DQEng.Window_BattleLog = DQEng.Window_BattleLog || {};

//-----------------------------------------------------------------------------
// Window_BattleLog
//-----------------------------------------------------------------------------

Window_BattleLog.prototype.initialize = function () {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    this._lines = [];
    this._methods = [];
    this._waitCount = 0;
    this._waitMode = '';
    this._baseLineStack = [];
    this._spriteset = null;
    this.updatePlacement();
    this.refresh();
};

Window_BattleLog.prototype.lineHeight = function () {
    return Window_BattleMessage.prototype.lineHeight.call(this);;
};

Window_BattleLog.prototype.lineGap = function () {
    return Window_BattleMessage.prototype.lineGap.call(this);;
};

Window_BattleLog.prototype.windowWidth = function () {
    return Window_BattleMessage.prototype.windowWidth.call(this);
};

Window_BattleLog.prototype.standardPadding = function () {
    return Window_BattleMessage.prototype.standardPadding.call(this);
};

Window_BattleLog.prototype.maxLines = function () {
    return Window_BattleMessage.prototype.numVisibleRows.call(this);
};

Window_BattleLog.prototype.updatePlacement = function () {
    this.x = $gameSystem.makeDivisibleBy((Graphics.boxWidth - this.windowWidth()) / 2);
    return Window_BattleMessage.prototype.updatePlacement.call(this);
};

Window_BattleLog.prototype.critSpeed = function () {
    return 36;
};

Window_BattleLog.prototype.clear = function (refresh = false) {
    this._lines = [];
    this._baseLineStack = [];
    if (refresh) this.refresh();
};

Window_BattleLog.prototype.wait = function (waitType = 'msg') {
    switch (waitType) {
        case 'crit':
            this._waitCount = this.critSpeed();
            break;
        default:
            this._waitCount = this.messageSpeed();
            break;
    }
};

Window_BattleLog.prototype.showAnimation = function (subject, targets, animationId, stypeId) {
    if (animationId < 0) {
        this.showAttackAnimation(subject, targets);
    } else {
        this.showNormalAnimation(targets, animationId, undefined, subject, stypeId);
    }
};

Window_BattleLog.prototype.showActorAttackAnimation = function (subject, targets) {
    this.playActSound(subject);
    this.showNormalAnimation(targets, subject.attackAnimationId1(), false, subject);
    this.showNormalAnimation(targets, subject.attackAnimationId2(), true, subject);
};

Window_BattleLog.prototype.showEnemyAttackAnimation = function (subject, targets) {
    this.playActSound(subject, 0, 1);
};

Window_BattleLog.prototype.showNormalAnimation = function (targets, animationId, mirror, subject, stypeId) {
    var animation = $dataAnimations[animationId];
    this.playActSound(subject, stypeId, animationId);
    if (animation) {
        var delay = this.animationBaseDelay(stypeId);
        var nextDelay = this.animationNextDelay();
        targets.forEach(function (target) {
            target.startAnimation(animationId, mirror, delay);
            delay += nextDelay;
        });
    }
};

Window_BattleLog.prototype.showCriticalAnimation = function (targets, animationId) {
    this.showNormalAnimation(targets, animationId, false, undefined, -1);
};

/**
 * Plays the sound effect before a move is used
 */
Window_BattleLog.prototype.playActSound = function (subject, stypeId = 0, animId = 0) {
    if (animId != 0 && stypeId >= 0) { // no act sound if there is no animation or skill type
        if (stypeId === 2) { // magic
            SoundManager.playUseSkill();
        } else if (subject.isActor()) {
            SoundManager.playPlayerAttack();
        } else {
            SoundManager.playEnemyAttack();
        }
    }
};

Window_BattleLog.prototype.animationBaseDelay = function (stypeId = 0) {
    if (stypeId === 2) { // magic
        return 24;
    } else if (stypeId === -1) { // item that invokes skill
        return 20;
    }
    return 10;
};

Window_BattleLog.prototype.animationNextDelay = function () {
    return 12;
};

Window_BattleLog.prototype.performRevival = function (target) {
    target.performRevival();
};

Window_BattleLog.prototype.drawLineText = function (index) {
    var rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};

Window_BattleLog.prototype.startAction = function (subject, action, targets) {
    var item = action.item();
    var skillType = action._modifiedItem ? -1 : item.stypeId;
    var isEnemyUser = subject.enemyId;
    var animationId = isEnemyUser ? item.meta.enemyAnimId : item.animationId;
    var animTargets = isEnemyUser ? [subject] : targets.clone();
    this.push('performActionStart', subject, action);
    this.push('waitForMovement');
    this.push('performAction', subject, action);
    this.push('showAnimation', subject, animTargets, animationId, skillType);
    this.displayAction(subject, item, action._modifiedItem);
};

Window_BattleLog.prototype.displayAction = function (subject, item, modifiedItem) {
    var numMethods = this._methods.length;
    if (DataManager.isSkill(item)) {
        var name = modifiedItem && modifiedItem.name ? modifiedItem.name : item.name;
        var msg1 = modifiedItem && modifiedItem.message1 ? modifiedItem.message1 : item.message1;
        var msg2 = modifiedItem && modifiedItem.message2 ? modifiedItem.message2 : item.message2;
        if (msg1) {
            this.push('addText', subject.name() + msg1.format(name));
        }
        if (msg2) {
            this.push('addText', msg2.format(name));
        }
    } else {
        this.push('addText', TextManager.useItem.format(subject.name(), item.name));
    }
    if (this._methods.length === numMethods) {
        this.push('wait');
    }
};

Window_BattleLog.prototype.displayRegeneration = function (subject) {
    this.push('pushBaseLine');
    this.displayDamage(subject);
    this.push('waitForNewLine');
    this.push('popBaseLine');
};

Window_BattleLog.prototype.displayActionResults = function (subject, target) {
    if (target.result().used) {
        this.push('clear');
        this.push('pushBaseLine');
        this.displayCritical(target);
        this.push('popupDamage', target);
        this.push('popupDamage', subject);
        this.displayDamage(target);
        this.displayAffectedStatus(target);
        this.displayFailure(target);
        this.push('waitForNewLine');
        this.push('popBaseLine');
    }
};

Window_BattleLog.prototype.displayCritical = function (target) {
    if (target.result().critical) {
        if (target.isActor()) {
            this.push('addText', TextManager.criticalToActor);
        } else {
            this.push('showCriticalAnimation', [target], 3);
            this.push('addText', TextManager.criticalToEnemy);
        }
        this.push('wait', 'crit');
        this.push('clear');
    }
};

Window_BattleLog.prototype.displayDamage = function (target) {
    if (target.result().missed) {
        this.displayMiss(target);
    } else if (target.result().evaded) {
        this.displayEvasion(target);
    } else if (!this.targetWasRevived(target)) {
        this.displayHpDamage(target);
        this.displayMpDamage(target);
        this.displayTpDamage(target);
    }
};

Window_BattleLog.prototype.displayMiss = function (target) {
    var fmt;
    if (target.result().physical) {
        fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
        this.push('performMiss', target);
    } else {
        fmt = TextManager.actionFailure;
        this.push('performMiss', target);
    }
    this.push('addText', fmt.format(target.name()));
};

Window_BattleLog.prototype.displayHpDamage = function (target) {
    if (target.result().hpAffected) {
        if (target.result().hpDamage > 0 && !target.result().drain) {
            this.push('performDamage', target);
        }
        if (target.result().hpDamage < 0) {
            this.push('performRecovery', target);
        }
        if (target.result().hpDamage === 0) {
            this.push('performMiss', target);
        }
        this.push('addText', this.makeHpDamageText(target));
    }
};

Window_BattleLog.prototype.displayTurnEndState = function (target, stateId) {
    let msg = $dataStates[stateId].meta.onTurnEnd;
    this.push('addText', target.name() + msg);
    this.push('waitForNewLine');
};

Window_BattleLog.prototype.displayAutoAffectedStatus = function (target) {
    if (target.result().isStatusAffected()) {
        this.displayAffectedStatus(target, null);
    }
};

Window_BattleLog.prototype.displayChangedStates = function (target) {
    this.displayAddedStates(target);
    this.displayStackedStates(target);
    this.displayRemovedStates(target);
};

Window_BattleLog.prototype.displayStackedStates = function (target) {
    target.result().stackedStateObjects().forEach(function (state) {
        let stateMsg = state.meta.stack;
        if (stateMsg) {
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', target.name() + stateMsg);
            this.push('waitForEffect');
        }
    }, this);
};

Window_BattleLog.prototype.displayRemovedStates = function (target) {
    target.result().removedStateObjects().forEach(function (state) {
        if (state.message4) {
            this.push('popBaseLine');
            this.push('pushBaseLine');
            state.id === target.deathStateId() && this.push('performRevival', target);
            this.push('addText', target.name() + state.message4);
        }
    }, this);
};

Window_BattleLog.prototype.targetWasRevived = function (target) {
    return target.result().removedStateObjects().some(
        state => state.id === target.deathStateId()
    )
};

Window_BattleLog.prototype.refresh = function () {
    this.contents.clear();
    for (var i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};
