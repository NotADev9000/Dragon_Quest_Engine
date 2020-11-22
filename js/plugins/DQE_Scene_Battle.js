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

Scene_Battle.prototype.createAllWindows = function () {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createSkillHelpWindow();
    this.createSkillWindow();
    this.createItemHelpWindow();
    this.createItemWindow();
    this.createEquipmentHelpWindow();
    this.createEquipmentWindow();
    this.createEquipmentDoWhatWindow();
    this.createActorWindow();
    this.createActorStatWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

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
    this._actorCommandWindow.setHandler('Equipment', this.commandEquipment.bind(this));
    this._actorCommandWindow.setHandler('Disabled', this.commandActorDisabled.bind(this));
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    this.addWindow(this._actorCommandWindow);
};

Scene_Battle.prototype.createSkillHelpWindow = function () {
    this._skillHelpWindow = new Window_BattleSkillHelp(585, 540, 672);
    this._skillHelpWindow.hide();
    this.addWindow(this._skillHelpWindow);
};

Scene_Battle.prototype.createSkillWindow = function () {
    this._skillWindow = new Window_BattleSkill(63, 456, 522, 261);
    this._skillWindow.setHelpWindow(this._skillHelpWindow);
    this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.createItemHelpWindow = function () {
    this._itemHelpWindow = new Window_BattleItemHelp(585, 540, 672);
    this._itemHelpWindow.hide();
    this.addWindow(this._itemHelpWindow);
};

Scene_Battle.prototype.createItemWindow = function () {
    this._itemWindow = new Window_BattleItem(63, 468, 522, 249);
    this._itemWindow.setHelpWindow(this._itemHelpWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Battle.prototype.createEquipmentHelpWindow = function () {
    this._equipmentHelpWindow = new Window_BattleItemHelp(585, 588, 672, 3, false);
    this._equipmentHelpWindow.hide();
    this.addWindow(this._equipmentHelpWindow);
};

Scene_Battle.prototype.createEquipmentWindow = function () {
    this._equipmentWindow = new Window_BattleEquipment(63, 468, 522, 249);
    this._equipmentWindow.setHelpWindow(this._equipmentHelpWindow);
    this._equipmentWindow.setHandler('ok', this.onEquipmentOk.bind(this));
    this._equipmentWindow.setHandler('cancel', this.onEquipmentCancel.bind(this));
    this.addWindow(this._equipmentWindow);
};

Scene_Battle.prototype.createEquipmentDoWhatWindow = function () {
    let x = this._equipmentWindow.x + this._equipmentWindow._width;
    let y = this._equipmentWindow.y;
    this._equipmentDoWhatWindow = new Window_TitledCommand(x, y, 282, 'Do What?');
    this._equipmentDoWhatWindow.deactivate();
    // this._equipmentDoWhatWindow.setHandler('Equip', this.onEquipmentDoWhatEquip.bind(this));
    // this._equipmentDoWhatWindow.setHandler('Unequip', this.onEquipmentDoWhatUnequip.bind(this));
    this._equipmentDoWhatWindow.setHandler('cancel', this.onEquipmentDoWhatCancel.bind(this));
    this._equipmentDoWhatWindow.setHandler('Cancel', this.onEquipmentDoWhatCancel.bind(this));
    this._equipmentDoWhatWindow.hide();
    this.addWindow(this._equipmentDoWhatWindow);
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

Scene_Battle.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_BattleMessage();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function (window) {
        this.addWindow(window);
    }, this);
};

//////////////////////////////
// Functions - moving windows
//////////////////////////////

/**
 * Shows enemy window in certain positions/states
 * 
 * pos
 * Default: party command (bottom & center)
 * 1:       actor command (bottom & right)
 * 2:       skill window (up & right)
 * 3:       item window (a little below skill window)
 * 
 * @param {Number} pos position of window
 * @param {Number} state state of the window
 */
Scene_Battle.prototype.showEnemyWindow = function (pos, state) {
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
    if (state) this._enemyWindow.setState(state);
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

//////////////////////////////
// Functions - command handlers
//////////////////////////////

Scene_Battle.prototype.commandAttack = function () {
    BattleManager.inputtingAction().setAttack();
    this._actorCommandWindow.showBackgroundDimmer();
    this.selectEnemySelection(1, Window_BattleEnemy.STATE_SINGLE);
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

Scene_Battle.prototype.commandEquipment = function () {
    this._equipmentWindow.setActor(BattleManager.actor());
    this._equipmentWindow.refresh();
    this._equipmentWindow.show();
    this._equipmentWindow.activate();
    this._enemyWindow.hide();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandGuard = function () {
    BattleManager.inputtingAction().setGuard();
    this.selectNextCommand();
};

Scene_Battle.prototype.commandActorDisabled = function () {
    this._actorCommandWindow.showBackgroundDimmer();
    this._enemyWindow.showBackgroundDimmer();
    this.displayMessage(this.actorCommandDisabledMessage(), 
    Scene_Battle.prototype.actorCommandDisabledCallback);
};

Scene_Battle.prototype.onActorOk = function () {
    var action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this._actorWindow.hide();
    this._actorStatWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'Skill':
            this._skillWindow.hide();
            this._skillWindow.hideBackgroundDimmer();
            break;
        case 'Item':
            this._itemWindow.hide();
            this._itemWindow.hideBackgroundDimmer();
            break;
    }
    this.selectNextCommand();
};

Scene_Battle.prototype.onActorCancel = function () {
    this._actorWindow.hide();
    this._actorStatWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'Skill':
            this._skillWindow.hideBackgroundDimmer();
            this._skillWindow.activate();
            break;
        case 'Item':
            this._itemWindow.hideBackgroundDimmer();
            this._itemWindow.activate();
            break;
    }
};

Scene_Battle.prototype.onEnemyOk = function () {
    var action = BattleManager.inputtingAction();
    var targetIndex = action.isForGroup() ? this._enemyWindow.groupIndex() : this._enemyWindow.enemyIndex();
    action.setTarget(targetIndex);
    this._enemyWindow.hide();
    this._enemyWindow.deselect();
    this._enemyWindow.setState(Window_BattleEnemy.STATE_GROUP);
    this._actorCommandWindow.hideBackgroundDimmer();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'Skill':
            this._skillWindow.hide();
            this._skillWindow.hideBackgroundDimmer();
            break;
        case 'Item':
            this._itemWindow.hide();
            this._itemWindow.hideBackgroundDimmer();
            break;
    }
    this.selectNextCommand();
};

Scene_Battle.prototype.onEnemyCancel = function () {
    this._enemyWindow.deselect();
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'Attack':
            this._enemyWindow.setState(Window_BattleEnemy.STATE_GROUP);
            this._enemyWindow.refresh();
            this._actorCommandWindow.hideBackgroundDimmer();
            this._actorCommandWindow.activate();
            break;
        case 'Skill':
            this._skillWindow.hideBackgroundDimmer();
            this._enemyWindow.hide();
            this._skillWindow.activate();
            break;
        case 'Item':
            this._itemWindow.hideBackgroundDimmer();
            this._enemyWindow.hide();
            this._itemWindow.activate();
            break;
    }
};

Scene_Battle.prototype.onSkillCancel = function () {
    this._skillWindow.hide();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
    this.showEnemyWindow(1, Window_BattleEnemy.STATE_GROUP);
};

Scene_Battle.prototype.onItemOk = function () {
    var item = this._itemWindow.item();
    var action = BattleManager.inputtingAction();
    action.setItem(item, this._itemWindow.index());
    $gameParty.setLastItem(item);
    this.onSelectAction();
};

Scene_Battle.prototype.onItemCancel = function () {
    this._itemWindow.hide();
    this.itemWindowClosed();
};

Scene_Battle.prototype.onEquipmentOk = function () {
    this.manageDoWhatCommands();
    this._equipmentDoWhatWindow.clearCommandList();
    this._equipmentDoWhatWindow.makeCommandList();
    this._equipmentDoWhatWindow.updateWindowDisplay();
    this._equipmentWindow.showBackgroundDimmer();
    this._equipmentWindow.showHelpWindowBackgroundDimmer();
    this._equipmentDoWhatWindow.select(0);
    this._equipmentDoWhatWindow.show();
    this._equipmentDoWhatWindow.activate();
};

Scene_Battle.prototype.onEquipmentCancel = function () {
    this._equipmentWindow.hide();
    this.itemWindowClosed();
};

Scene_Battle.prototype.itemWindowClosed = function () {
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
    this.showEnemyWindow(1, Window_BattleEnemy.STATE_GROUP);
};

Scene_Battle.prototype.onEquipmentDoWhatCancel = function () {
    this._equipmentWindow.hideBackgroundDimmer();
    this._equipmentDoWhatWindow.hide();
    this._equipmentWindow.activate();
};

//////////////////////////////
// Functions - change input
//////////////////////////////

Scene_Battle.prototype.changeInputWindow = function () {
    if (BattleManager.isInputting()) {
        this._logWindow.opacity = 0;
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            this.startPartyCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};

Scene_Battle.prototype.startPartyCommandSelection = function () {
    this.refreshStatus();
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
    this.showEnemyWindow(0, Window_BattleEnemy.STATE_GROUP);
};

Scene_Battle.prototype.startActorCommandSelection = function () {
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
    this.showEnemyWindow(1, Window_BattleEnemy.STATE_GROUP);
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

/**
 * @param {Number} pos to move enemy window to
 */
Scene_Battle.prototype.selectEnemySelection = function (pos = 0, state = null) {
    this.showEnemyWindow(pos, state);
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
};

Scene_Battle.prototype.onSelectAction = function () {
    var action = BattleManager.inputtingAction();
    if (!action.needsSelection()) {
        this._skillWindow.hide();
        this._itemWindow.hide();
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        let enemyWindowState = action.isForGroup() ? Window_BattleEnemy.STATE_GROUP : Window_BattleEnemy.STATE_SINGLE;
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'Skill':
                this._skillHelpWindow.showBackgroundDimmer();
                this._skillWindow.showBackgroundDimmer();
                this.selectEnemySelection(2, enemyWindowState);
                break;
            case 'Item':
                this._itemHelpWindow.showBackgroundDimmer();
                this._itemWindow.showBackgroundDimmer();
                this.selectEnemySelection(3, enemyWindowState);
                break;
        }
    } else {
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'Skill':
                this._skillHelpWindow.showBackgroundDimmer();
                this._skillWindow.showBackgroundDimmer();
                this.selectActorSelection(0);
                break;
            case 'Item':
                this._itemHelpWindow.showBackgroundDimmer();
                this._itemWindow.showBackgroundDimmer();
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

DQEng.Scene_Battle.isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive = function () {
    return this._equipmentWindow.active ||
           this._equipmentDoWhatWindow.active ||
           DQEng.Scene_Battle.isAnyInputWindowActive.call(this);
}

//////////////////////////////
// Functions - in-battle messages
//////////////////////////////

Scene_Battle.prototype.actorCommandDisabledMessage = function () {
    var actor = BattleManager.actor();
    var msg = `${actor._name} has no`;
    switch (this._actorCommandWindow.currentSymbol()) {
        case 'Skill':
            if (this._actorCommandWindow.currentExt() === 1) {
                msg += ` battle abilities!`;
            } else {
                msg += ` battle spells!`;
            }
            break;
        case 'Item':
            msg += ` items!`;
            break;
    }
    return msg;
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Battle.prototype.actorCommandDisabledCallback = function () {
    this._actorCommandWindow.hideBackgroundDimmer();
    this._enemyWindow.hideBackgroundDimmer();
    this._actorCommandWindow.activate();
};

//////////////////////////////
// Functions - scene actions
//////////////////////////////

Scene_Battle.prototype.isBusy = function () {
    return this._fadeDuration > 0 || this._activeMessage != null;
};

Scene_Battle.prototype.refreshStatus = function () {
    this._statusWindow.forEach(statusWindow => {
        statusWindow.refresh();
    });
};

Scene_Battle.prototype.stop = function () {
    Scene_Base.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

//////////////////////////////
// Functions - managers
//////////////////////////////

Scene_Battle.prototype.manageDoWhatCommands = function () {
    this._equipmentDoWhatWindow._commands = ['Cancel'];
    if (this._equipmentWindow.isEquippedItem(this._equipmentWindow.index())) {
        this._equipmentDoWhatWindow._commands.unshift('Unequip');
    } else {
        this._equipmentDoWhatWindow._commands.unshift('Equip');
    }
};

//////////////////////////////
// Functions - scene updates
//////////////////////////////

Scene_Battle.prototype.update = function () {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Battle.prototype.updateBattleProcess = function () {
    if ((!this.isAnyInputWindowActive() || BattleManager.isAborting() ||
        BattleManager.isBattleEnd()) && !BattleManager.isBusy()) {
        BattleManager.update();
        this.changeInputWindow();
    }
};
