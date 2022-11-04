//=============================================================================
// Dragon Quest Engine - Scene Skill System
// DQE_Scene_SkillSystem.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the skill system where skills are unlocked - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_SkillSystem = DQEng.Scene_SkillSystem || {};

//-----------------------------------------------------------------------------
// Scene_SkillSystem
//-----------------------------------------------------------------------------

function Scene_SkillSystem() {
    this.initialize.apply(this, arguments);
}

Scene_SkillSystem.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillSystem.prototype.constructor = Scene_SkillSystem;

Scene_SkillSystem.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SkillSystem.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createSkillSetsListWindow();
    this.createSkillSetsWindow();
    this.createSkillPointsWindow();
    this.createStatsWindow();
    this.createSkillDescriptionWindow();
    // messages
    this.createChoiceWindow();
    this.createMessageWindow();
};

Scene_SkillSystem.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this.startFadeIn(this.fadeSpeed(), false);
};

Scene_SkillSystem.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    this.updateBackgroundScroll();
};

//////////////////////////////
// Functions - visuals
//////////////////////////////

Scene_SkillSystem.prototype.createBackground = function () {
    this._backgroundSprite = new TilingSprite();
    this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
    this._backgroundSprite.bitmap = ImageManager.loadSystem('SkillSystem_BG');
    this.addChild(this._backgroundSprite);
};

Scene_SkillSystem.prototype.updateBackgroundScroll = function () {
    // moving the origin x/y allows the tiling sprite to tile the image properly
    this._backgroundSprite.origin.x -= 2;
    this._backgroundSprite.origin.y -= 2;
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_SkillSystem.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand_ItemList(0, 0, 354, 'Party');
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));

    // next skill set list
    this._commandWindow.setHandler('pageup', this.onCommandNextSkillSetPage.bind(this));
    this._commandWindow.setHandler('pagedown', this.onCommandPreviousSkillSetPage.bind(this));

    // next skill set
    this._commandWindow.setHandler('next', this.onNextSkillSet.bind(this));
    this._commandWindow.setHandler('previous', this.onPreviousSkillSet.bind(this));

    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._commandWindow.setCheckListIsEmpty(true);

    // cursor right and left should change skillSets window
    this._commandWindow.cursorLeft = this.onCursorLeft.bind(this);
    this._commandWindow.cursorRight = this.onCursorRight.bind(this);

    this.addWindow(this._commandWindow);
};

/**
 * Holds the actors' list of skill sets
 */
Scene_SkillSystem.prototype.createSkillSetsListWindow = function () {
    const x = this._commandWindow.x + this._commandWindow.width;
    this._skillSetsListWindow = new Window_SkillSetsList(x, 0, 1086, 231);
    this._skillSetsListWindow.setHandler('ok', this.onSkillSetListOk.bind(this));

    // next skill set
    this._skillSetsListWindow.setHandler('next', this.onNextSkillSet.bind(this));
    this._skillSetsListWindow.setHandler('previous', this.onPreviousSkillSet.bind(this));

    this._skillSetsListWindow.setHandler('cancel', this.onSkillSetListCancel.bind(this));

    // cursor right and left should change skillSets window
    this._skillSetsListWindow.cursorLeft = this.onCursorLeft.bind(this);
    this._skillSetsListWindow.cursorRight = this.onCursorRight.bind(this);

    this._skillSetsListWindow.setHideCursor(true);

    this.addWindow(this._skillSetsListWindow);
    this._commandWindow.setHelpWindow(this._skillSetsListWindow);
};

/**
 * Displays a skill sets' layers and nodes
 * Used by player to select and unlock nodes
 */
Scene_SkillSystem.prototype.createSkillSetsWindow = function () {
    const x = this._skillSetsListWindow.x;
    const y = this._skillSetsListWindow.y + this._skillSetsListWindow.height;
    this._skillSetsWindow = new Window_SkillSets(x, y, 1086, 555, false);
    this._skillSetsWindow.setHandler('ok', this.onSkillSetOk.bind(this));

    // next actor
    this._skillSetsWindow.setHandler('pageup', this.onNextActor.bind(this));
    this._skillSetsWindow.setHandler('pagedown', this.onPreviousActor.bind(this));

    // next skill set
    this._skillSetsWindow.setHandler('next', this.onNextSkillSet.bind(this));
    this._skillSetsWindow.setHandler('previous', this.onPreviousSkillSet.bind(this));

    this._skillSetsWindow.setHandler('disabled', this.onSkillSetLayerLocked.bind(this));
    this._skillSetsWindow.setHandler('cancel', this.onSkillSetCancel.bind(this));

    this.addWindow(this._skillSetsWindow);
    this._skillSetsListWindow.setHelpWindow(this._skillSetsWindow);
};

Scene_SkillSystem.prototype.createSkillPointsWindow = function () {
    const y = this._commandWindow.y + this._commandWindow.height;
    this._skillPointsWindow = new Window_SkillPoints(0, y, 354);

    this.addWindow(this._skillPointsWindow);
    this._commandWindow.setHelpWindow(this._skillPointsWindow);
};

Scene_SkillSystem.prototype.createStatsWindow = function () {
    this._statsWindow = new Window_Stats(0, 0, 513, true, true);
    this._statsWindow.hide();

    this.addWindow(this._statsWindow);
    this._commandWindow.setHelpWindow(this._statsWindow);
};

Scene_SkillSystem.prototype.createSkillDescriptionWindow = function () {
    const x = this._statsWindow.x + this._statsWindow.width;
    const y = 0 + this._skillSetsWindow.height;
    this._skillDescriptionWindow = new Window_SkillSetDescription(x, y, 927);
    this._skillDescriptionWindow.hide();

    this.addWindow(this._skillDescriptionWindow);
    this._skillSetsWindow.setHelpWindow(this._skillDescriptionWindow);
};

// messages

Scene_SkillSystem.prototype.createChoiceWindow = function () {
    this._choiceWindow = new Window_CustomCommand(0, 0, 156, ['Yes', 'No'], true);
    this._choiceWindow.setHandler('Yes', this.onChoiceYes.bind(this));
    this._choiceWindow.setHandler('No', this.onChoiceCancel.bind(this));
    this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
    this._choiceWindow.openness = 0;
    this._choiceWindow.deactivate();
    this.addWindow(this._choiceWindow);
};

Scene_SkillSystem.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageInputToggle();
    this._messageWindow.setInput(true);
    this._choiceWindow.x = (this._messageWindow.x + this._messageWindow.width) - this._choiceWindow.width;
    this._choiceWindow.y = this._messageWindow.y - this._choiceWindow.height - Window_ChoiceList.ChoiceYOffset;
    this.addWindow(this._messageWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

// command window

Scene_SkillSystem.prototype.onCommandOk = function () {
    this._commandWindow.showBackgroundDimmer();
    this._skillSetsListWindow.setHideCursor(false);
    this._skillSetsListWindow.select(this._skillSetsListWindow._lastSelected);
    this._skillSetsListWindow.activate();
};

Scene_SkillSystem.prototype.onCommandNextSkillSetPage = function () {
    this._skillSetsListWindow.setHideCursor(true);
    this._skillSetsListWindow.gotoNextPage();
    this._commandWindow.activate();
};

Scene_SkillSystem.prototype.onCommandPreviousSkillSetPage = function () {
    this._skillSetsListWindow.setHideCursor(true);
    this._skillSetsListWindow.gotoNextPage(-1);
    this._commandWindow.activate();
};

// changing skill set

Scene_SkillSystem.prototype.onNextSkillSet = function () {
    this._skillSetsListWindow.moveToNextSkillSet();
};

Scene_SkillSystem.prototype.onPreviousSkillSet = function () {
    this._skillSetsListWindow.moveToPreviousSkillSet();
};

// changing actor

Scene_SkillSystem.prototype.onNextActor = function () {
    this._commandWindow.cursorDown();
    this.afterActorChange();
};

Scene_SkillSystem.prototype.onPreviousActor = function () {
    this._commandWindow.cursorUp();
    this.afterActorChange();
};

Scene_SkillSystem.prototype.afterActorChange = function () {
    this._commandWindow.updateHelp();
    this._skillSetsWindow.select(0);
    this._skillSetsWindow.activate();
};

// cursor movement

Scene_SkillSystem.prototype.onCursorLeft = function () { 
    this._skillSetsWindow.cursorLeft.call(this._skillSetsWindow);
};

Scene_SkillSystem.prototype.onCursorRight = function () {
    this._skillSetsWindow.cursorRight.call(this._skillSetsWindow);
};

// skill set list window

Scene_SkillSystem.prototype.onSkillSetListOk = function () {
    this._commandWindow.hide();
    this._skillSetsListWindow.hide();
    this._statsWindow.show();
    // move/resize skill points
    this._skillPointsWindow.width = 513;
    this._skillPointsWindow.y = this._statsWindow.y + this._statsWindow.height;
    this._skillPointsWindow.refresh();
    // move/resize/activate skill sets
    this._skillSetsWindow.x = this._statsWindow.x + this._statsWindow.width;
    this._skillSetsWindow.y = 0;
    this._skillSetsWindow.width = 927;
    this._skillSetsWindow.setSelectable(true);
    this._skillSetsWindow.refresh();
    this._skillSetsWindow.select(this._skillSetsWindow._lastSelected);
    this._skillSetsWindow.activate();
};

Scene_SkillSystem.prototype.onSkillSetListCancel = function () {
    this._skillSetsListWindow.setHideCursor(true);
    this._skillSetsListWindow.updateCursor();
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};

// skill set window

Scene_SkillSystem.prototype.onSkillSetOk = function () {
    const actor = this.actor();
    const node = this.node();
    const cost = node.cost;
    let message = '';
    let callback = Scene_SkillSystem.prototype.nodeDisabled_MessageCallback;
    let canAfford = true;

    // check currency and if player can afford
    if (cost.miniMedals) {
        if ($gameParty.medalCurrent() < cost.miniMedals) {
            canAfford = false;
            message = this.notEnoughMedalsMessage();
        }
    } else if (cost.gold) {
        if ($gameParty.gold() < cost.gold) {
            canAfford = false;
            message = this.notEnoughGoldMessage();
        }
    } else if (cost.skillPoints) {
        if (actor.skillPoints() < cost.skillPoints) {
            canAfford = false;
            message = this.notEnoughSkillPointsMessage(actor);
        }
    }

    // change message and callback if can afford
    if (canAfford) {
        message = this.SpendMessage(node);
        this._messageWindow.setInput(false);
        callback = Scene_SkillSystem.prototype.confirmChoice_MessageCallback;
    }
    
    this.dimSkillWindows();
    this.displayMessage(message, callback);
};

Scene_SkillSystem.prototype.onSkillSetCancel = function () {
    this._statsWindow.hide();
    this._commandWindow.show();
    this._skillSetsListWindow.show();
    // move/resize skill points
    this._skillPointsWindow.width = 354;
    this._skillPointsWindow.y = this._commandWindow.y + this._commandWindow.height;
    this._skillPointsWindow.refresh();
    // move/resize skill sets
    this._skillSetsWindow.x = this._skillSetsListWindow.x;
    this._skillSetsWindow.y = this._skillSetsListWindow.y + this._skillSetsListWindow.height;
    this._skillSetsWindow.width = 1086;
    this._skillSetsWindow.setSelectable(false);
    this._skillSetsWindow.deselect();
    this._skillSetsWindow.refresh();
    // hide skill description window
    this._skillDescriptionWindow.hide();

    if (this._skillSetsListWindow.hasSkillSets()) {
        // activate skill sets list
        this._skillSetsListWindow.activate();
    } else {
        // back to command window
        this.onSkillSetListCancel();
    }
};

Scene_SkillSystem.prototype.onSkillSetLayerLocked = function () {
    this.dimSkillWindows();
    this.displayMessage(this.layerLockedMessage(), Scene_SkillSystem.prototype.nodeDisabled_MessageCallback);
};

// choice window

Scene_SkillSystem.prototype.onChoiceYes = function () {
    this.closeTextWindows();
    this.unlockNode();
    this.undimSkillWindows();
    this.refreshWindows(false);
    // play unlock animation on window THEN run passed in callback function
    SoundManager.playNodeUnlock();
    this._skillSetsWindow.showUnlockHighlight(this.choiceYes_HighlightCallback, 8);
};

Scene_SkillSystem.prototype.onChoiceCancel = function () {
    this.closeTextWindows();
    this.undimSkillWindows();
    this._skillSetsWindow.activate();
};

//////////////////////////////
// Functions - messages
//////////////////////////////

Scene_SkillSystem.prototype.layerLockedMessage = function () {
    return 'This layer is locked!';
};

Scene_SkillSystem.prototype.notEnoughMedalsMessage = function () {
    return `You don't have enough Mini Medals!`;
};

Scene_SkillSystem.prototype.notEnoughGoldMessage = function () {
    return `You don't have enough gold!`;
};

Scene_SkillSystem.prototype.notEnoughSkillPointsMessage = function (actor) {
    return `${actor.name()} doesn't have enough Skill Points!`;
};

Scene_SkillSystem.prototype.SpendMessage = function (node) {
    return `Spend ${$gameSystem.getNodeCostDetails(node, true, true, false)} to unlock?`;
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_SkillSystem.prototype.nodeDisabled_MessageCallback = function () {
    this._messageWindow.close();
    this.undimSkillWindows();
    this._skillSetsWindow.activate();
};

Scene_SkillSystem.prototype.confirmChoice_MessageCallback = function () {
    this._choiceWindow.select(0);
    this._choiceWindow.open();
    this._choiceWindow.activate();
};

//////////////////////////////
// Functions - highlight callbacks
//////////////////////////////

Scene_SkillSystem.prototype.choiceYes_HighlightCallback = function () {
    this.refreshWindows();
    this._skillSetsWindow.activate();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Scene_SkillSystem.prototype.unlockNode = function () {
    const actor = this.actor();
    const node = this.node();
    
    $gameSystem.chargeActor(node, actor);
    $gameSystem.triggerNodeUnlocks(node, actor);
    $gameSystem.updateSkillSetUnlocks(this.skillSet(), this.layerIndex(), node);
};

Scene_SkillSystem.prototype.actor = function () {
    return $gameParty.members()[this._commandWindow.currentSymbol()];
};

/*
 * Data below is retrieved by reference so editing the values
 * will change the actors' skillset
 */

Scene_SkillSystem.prototype.skillSet = function () {
    return this._skillSetsWindow.data();
};

Scene_SkillSystem.prototype.layerIndex = function () {
    return this._skillSetsWindow.getLayerIndex();
};

Scene_SkillSystem.prototype.node = function () {
    return this._skillSetsWindow.item();
};

//////////////////////////////
// Functions - misc
//////////////////////////////

// windows

Scene_SkillSystem.prototype.closeTextWindows = function () {
    this._messageWindow.setInput(true);
    this._messageWindow.close();
    this._choiceWindow.close();
};

Scene_SkillSystem.prototype.dimSkillWindows = function () {
    this._statsWindow.showBackgroundDimmer();
    this._skillPointsWindow.showBackgroundDimmer();
    this._skillSetsWindow.showBackgroundDimmer();
    this._skillDescriptionWindow.showBackgroundDimmer();
};

Scene_SkillSystem.prototype.undimSkillWindows = function () {
    this._statsWindow.hideBackgroundDimmer();
    this._skillPointsWindow.hideBackgroundDimmer();
    this._skillSetsWindow.hideBackgroundDimmer();
    this._skillDescriptionWindow.hideBackgroundDimmer();
};

Scene_SkillSystem.prototype.refreshWindows = function (refreshSkillSet = true) {
    this._statsWindow.refresh();
    this._skillPointsWindow.refresh();
    if (refreshSkillSet) this._skillSetsWindow.refresh();
    this._skillSetsListWindow.refresh();
};
