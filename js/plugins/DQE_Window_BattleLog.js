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
    this.playActSound(subject);
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

/**
 * Plays the sound effect before a move is used
 */
Window_BattleLog.prototype.playActSound = function (subject, stypeId = 0, animId = 1) {
    if (animId != 0) { // no act sound if there is no animation
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
    } else {
        return 10;
    }
};

Window_BattleLog.prototype.animationNextDelay = function () {
    return 12;
};

Window_BattleLog.prototype.drawLineText = function (index) {
    var rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};

Window_BattleLog.prototype.startAction = function (subject, action, targets) {
    var item = action.item();
    this.push('performActionStart', subject, action);
    this.push('waitForMovement');
    this.push('performAction', subject, action);
    this.push('showAnimation', subject, targets.clone(), item.animationId, item.stypeId);
    this.displayAction(subject, item);
};

Window_BattleLog.prototype.refresh = function () {
    this.contents.clear();
    for (var i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};