//=============================================================================
// Dragon Quest Engine - Scene Battle
// DQE_Scene_Battle.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the battle - V0.1
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
Imported.DQEng_Scene_Battle = true;

var DQEng = DQEng || {};
DQEng.Scene_Battle = DQEng.Scene_Battle || {};

//-----------------------------------------------------------------------------
// Scene_Battle
//-----------------------------------------------------------------------------

Scene_Battle.prototype.update = function () {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Battle.prototype.stop = function () {
    Scene_Base.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.forEach(statusWindow => {
        statusWindow.close();
    });
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

Scene_Battle.prototype.updateStatusWindow = function () {
    if ($gameMessage.isBusy()) {
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    }
};

Scene_Battle.prototype.createAllWindows = function () {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createActorStatWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};

Scene_Battle.prototype.createStatusWindow = function () {
    this._statusWindow = [];
    var partyMembers = $gameParty.members();

    for (let i = 0; i < Math.min(partyMembers.length, 4); i++) {
        this._statusWindow[i] = new Window_BattleStatus(63 + (Window_MenuStatus.prototype.windowWidth() * i), -12, partyMembers[i]);
        this.addWindow(this._statusWindow[i]);
    }
};

Scene_Battle.prototype.createPartyCommandWindow = function () {
    this._partyCommandWindow = new Window_PartyCommand(63, 540);
    this._partyCommandWindow.setHandler('Fight', this.commandFight.bind(this));
    this._partyCommandWindow.setHandler('Escape', this.commandEscape.bind(this));
    this._partyCommandWindow.deselect();
    this.addWindow(this._partyCommandWindow);
};

Scene_Battle.prototype.createActorCommandWindow = function () {
    this._actorCommandWindow = new Window_ActorCommand(63, 498, 450);
    this._actorCommandWindow.setHandler('Attack', this.commandAttack.bind(this));
    this._actorCommandWindow.setHandler('Skill', this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler('Guard', this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler('Item', this.commandItem.bind(this));
    // this._actorCommandWindow.setHandler('Equipment', this.commandEquipment.bind(this));
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    this.addWindow(this._actorCommandWindow);
};

Scene_Battle.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_BattleSkillHelp(585, 540, 672);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Battle.prototype.createSkillWindow = function () {
    this._skillWindow = new Window_BattleSkill(63, 456, 522, 261);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.createItemWindow = function () {
    this._itemWindow = new Window_BattleItem(63, 468, 522, 249);
    // this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Battle.prototype.createActorWindow = function () {
    var x = 513;
    this._actorWindow = new Window_BattleActor(x, 0);
    this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

Scene_Battle.prototype.createActorStatWindow = function () {
    var x = this._actorWindow.x + this._actorWindow.windowWidth();
    var y = this._actorWindow.y;
    this._actorStatWindow = new Window_BattleActorStat(x, y);
    this._actorStatWindow.hide();
    this.addWindow(this._actorStatWindow);
};

Scene_Battle.prototype.createEnemyWindow = function () {
    this._enemyWindow = new Window_BattleEnemy(0, 0);
    this._enemyWindow.setHandler('ok', this.onEnemyOk.bind(this));
    this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
    this.addWindow(this._enemyWindow);
};

/**
 * Shows enemy window in certain positions
 * 
 * Default: party command (bottom & center)
 * 1:       actor command (bottom & right)
 * 2:       skill window (up & right)
 * 3:       item window (a little below skill window)
 * 
 * @param {Number} pos 
 */
Scene_Battle.prototype.showEnemyWindow = function (pos) {
    switch (pos) {
        case 1:
            this._enemyWindow.x = this._actorCommandWindow.x + this._actorCommandWindow.windowWidth();
            this._enemyWindow.y = this._partyCommandWindow.y;
            break;
        case 2:
            this._enemyWindow.x = this._actorCommandWindow.x + this._actorCommandWindow.windowWidth();
            this._enemyWindow.y = this._skillWindow.y;
            break;
        case 3:
            this._enemyWindow.x = this._actorCommandWindow.x + this._actorCommandWindow.windowWidth();
            this._enemyWindow.y = this._itemWindow.y;
            break;
        default:
            this._enemyWindow.x = this._partyCommandWindow.x + this._partyCommandWindow.windowWidth();
            this._enemyWindow.y = this._partyCommandWindow.y;
            break;
    }
    this._enemyWindow.show();
};

/**
 * Shows actor window in certain positions
 * 
 * Default: skill window (inline with top of skill window)
 * 1:       item window (inline with top of item window)
 * 
 * @param {Number} pos 
 */
Scene_Battle.prototype.showActorWindow = function (pos) {
    switch (pos) {
        case 1:
            this._actorWindow.y = this._itemWindow.y;
            break;
        default:
            this._actorWindow.y = this._skillWindow.y;
            break;
    }
    this._actorStatWindow.y = this._actorWindow.y;
    this._actorWindow.show();
};

Scene_Battle.prototype.refreshStatus = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.refresh();
    });
};

Scene_Battle.prototype.startPartyCommandSelection = function () {
    this.refreshStatus();
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
    this.showEnemyWindow(0);
};

Scene_Battle.prototype.startActorCommandSelection = function () {
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
    this.showEnemyWindow(1);
};

Scene_Battle.prototype.commandAttack = function () {
    BattleManager.inputtingAction().setAttack();
    this._actorCommandWindow.showBackgroundDimmer();
    this.selectEnemySelection(1);
};

Scene_Battle.prototype.commandSkill = function () {
    this._skillWindow.setActor(BattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    this._skillWindow.show();
    this._skillWindow.activate();
    this._skillWindow.refresh();
    this._enemyWindow.hide();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandItem = function () {
    this._itemWindow.setActor(BattleManager.actor());
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._enemyWindow.hide();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandGuard = function () {
    BattleManager.inputtingAction().setGuard();
    this.selectNextCommand();
};

/**
 * @param {Number} pos to move actor window to
 */
Scene_Battle.prototype.selectActorSelection = function (pos = 0) {
    this._actorWindow.refresh();
    this.showActorWindow(pos)
    this._actorWindow.activate();
};

Scene_Battle.prototype.selectActorStatWindow = function (action) {
    if (action.isHpRecover()) {
        this._actorStatWindow.setStat(0);
    }
    this._actorStatWindow.show();
};

Scene_Battle.prototype.onActorOk = function () {
    var action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this._actorWindow.hide();
    this._actorStatWindow.hide();
    this._skillWindow.hide();
    this._skillWindow.hideBackgroundDimmer();
    this._itemWindow.hide();
    this._itemWindow.hideBackgroundDimmer();
    this._helpWindow.hideBackgroundDimmer();
    this.selectNextCommand();
};

Scene_Battle.prototype.onActorCancel = function () {
    this._actorWindow.hide();
    this._actorStatWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'Skill':
            this._skillWindow.hideBackgroundDimmer();
            this._itemWindow.hideBackgroundDimmer();
            this._helpWindow.hideBackgroundDimmer();
            this._skillWindow.activate();
            break;
        case 'Item':
            this._skillWindow.hideBackgroundDimmer();
            this._itemWindow.hideBackgroundDimmer();
            this._helpWindow.hideBackgroundDimmer();
            this._itemWindow.activate();
            break;
    }
};

/**
 * @param {Number} pos to move enemy window to
 */
Scene_Battle.prototype.selectEnemySelection = function (pos = 0) {
    this._enemyWindow.refresh();
    this.showEnemyWindow(pos);
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
};

Scene_Battle.prototype.onEnemyOk = function () {
    var action = BattleManager.inputtingAction();
    action.setTarget(this._enemyWindow.enemyIndex());
    this._enemyWindow.hide();
    this._enemyWindow.deselect();
    this._actorCommandWindow.hideBackgroundDimmer();
    this._skillWindow.hide();
    this._skillWindow.hideBackgroundDimmer();
    this._itemWindow.hide();
    this._itemWindow.hideBackgroundDimmer();
    this._helpWindow.hideBackgroundDimmer();
    this.selectNextCommand();
};

Scene_Battle.prototype.onEnemyCancel = function () {
    this._enemyWindow.deselect();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'Attack':
            this._actorCommandWindow.hideBackgroundDimmer();
            this._actorCommandWindow.activate();
            break;
        case 'Skill':
            this._skillWindow.hideBackgroundDimmer();
            this._itemWindow.hideBackgroundDimmer();
            this._helpWindow.hideBackgroundDimmer();
            this._enemyWindow.hide();
            this._skillWindow.activate();
            break;
        case 'Item':
            this._skillWindow.hideBackgroundDimmer();
            this._itemWindow.hideBackgroundDimmer();
            this._helpWindow.hideBackgroundDimmer();
            this._enemyWindow.hide();
            this._itemWindow.activate();
            break;
    }
};

Scene_Battle.prototype.onSkillCancel = function () {
    this._skillWindow.hide();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
    this.showEnemyWindow(1);
};

Scene_Battle.prototype.onItemCancel = function () {
    this._itemWindow.hide();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
    this.showEnemyWindow(1);
};

Scene_Battle.prototype.onSelectAction = function () {
    var action = BattleManager.inputtingAction();
    if (!action.needsSelection()) {
        this._skillWindow.hide();
        this._itemWindow.hide();
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this._helpWindow.showBackgroundDimmer();
        this._skillWindow.showBackgroundDimmer();
        this._itemWindow.showBackgroundDimmer();
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'Skill':
                this.selectEnemySelection(2);
                break;
            case 'Item':
                this.selectEnemySelection(3);
                break;
        }
    } else {
        this._helpWindow.showBackgroundDimmer();
        this._skillWindow.showBackgroundDimmer();
        this._itemWindow.showBackgroundDimmer();
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'Skill':
                this.selectActorSelection(0);
                break;
            case 'Item':
                this.selectActorSelection(1);
                break;
        }
        if (action.isRecover()) {
            this.selectActorStatWindow(action);
        }
    }
};

Scene_Battle.prototype.endCommandSelection = function () {
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
    this._enemyWindow.hide();
};
