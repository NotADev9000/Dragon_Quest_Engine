//=============================================================================
// Dragon Quest Engine - Scene Skill
// DQE_Scene_Skill.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the skill (aka magic) menu - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Skill = true;

var DQEng = DQEng || {};
DQEng.Scene_Skill = DQEng.Scene_Skill || {};

//-----------------------------------------------------------------------------
// Scene_Skill
//-----------------------------------------------------------------------------

Scene_Skill.Special_Zoom = 'zoom';

Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this._hasZoom = $gameParty.hasZoom();
    this.createHelpWindow();
    this.createCommandWindow();
    this.createQuickZoomWindow();
    this.createSkillWindow();
    this.createSkillStatWindow();
    this.createUseOnWhoWindow();
    this.createItemStatusWindow();
    this.createItemStatWindow();
    this.createZoomWindow();
    this.createMessageWindow();
    this._quickZoomMode = false;
};

Scene_Skill.prototype.start = function () {
    Scene_ItemBase.prototype.start.call(this);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Skill.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(0, 48, 444, 8, 360);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Skill.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand_ItemList(48, 48, 354, 'Magic');
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    if (this._hasZoom) this._commandWindow.setHandler('help', this.onCommandZoom.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._commandWindow.setCheckListIsEmpty(true);
    this.addWindow(this._commandWindow);
};

Scene_Skill.prototype.createQuickZoomWindow = function () {
    const x = this._commandWindow.x;
    const y = this._commandWindow.y + this._commandWindow.height;
    const width = this._commandWindow.width;
    this._quickZoomWindow = new Window_Icon_Help(x, y, width, ['help'], ['Quick Zoom']);
    if (!this._hasZoom) this._quickZoomWindow.hide();
    this.addWindow(this._quickZoomWindow);
};

Scene_Skill.prototype.createSkillWindow = function () {
    var x = this._commandWindow.x + this._commandWindow.windowWidth();
    var y = this._commandWindow.y;
    this._skillWindow = new Window_SkillList(x, y, 546, 483);
    this._helpWindow.x = this._skillWindow.x + this._skillWindow.width;
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
    this._commandWindow.setHelpWindow(this._skillWindow);
};

Scene_Skill.prototype.createSkillStatWindow = function () {
    let x = this._helpWindow.x;
    let y = 408;
    this._skillStatWindow = new Window_SkillCost(x, y);
    this._skillStatWindow.hide();
    this.addWindow(this._skillStatWindow);
    this._skillWindow.setHelpWindow(this._skillStatWindow);
};

Scene_Skill.prototype.createUseOnWhoWindow = function () {
    var x = this._commandWindow.x;
    var y = this._commandWindow.y;
    var width = this._commandWindow.width;
    this._useOnWhoWindow = new Window_TitledPartyCommand(x, y, width, 'On Who?');
    this._useOnWhoWindow.deactivate();
    this._useOnWhoWindow.setHandler('ok', this.onUseOnWhoOk.bind(this));
    this._useOnWhoWindow.setHandler('cancel', this.onUseOnWhoCancel.bind(this));
    this._useOnWhoWindow.hide();
    this.addWindow(this._useOnWhoWindow);
};

Scene_Skill.prototype.createZoomWindow = function () {
    const x = this._helpWindow.x;
    const y = this._helpWindow.y;
    const width = this._helpWindow.width;
    const height = Graphics.boxHeight - 96;
    this._zoomWindow = new Window_Zoom(x, y, width, height, 'Zoom Where?');
    this._zoomWindow.setHandler('ok', this.onZoomOk.bind(this));
    this._zoomWindow.setHandler('cancel', this.onZoomCancel.bind(this));
    this._zoomWindow.hide();
    this.addWindow(this._zoomWindow);
};

/**
 * Always call this window last so it's at front
 */
Scene_Skill.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_Message();
    this.addWindow(this._messageWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Skill.prototype.onCommandOk = function () {
    this._quickZoomWindow.hide();
    this._commandWindow.showBackgroundDimmer();
    this._skillWindow.activate();
    this._skillWindow.select(this._skillWindow._lastSelected);
    this._skillWindow.showAllHelpWindows();
};

Scene_Skill.prototype.onCommandZoom = function () {
    this._commandWindow.showBackgroundDimmer();
    this._quickZoomWindow.showBackgroundDimmer();
    this._skillWindow.showBackgroundDimmer();
    if ($gameParty.partyCanZoom()) {
        this._quickZoomMode = true;
        this.onSkillZoom();
    } else {
        this.displayMessage(this.nobodyToZoom_Message(), Scene_Skill.prototype.noZoomMembers_MessageCallback);
    }
};

Scene_Skill.prototype.onSkillOk = function () {
    if (this.isSpecialCase() && this.user().meetsUsableItemConditions(this.item())) {
        this.startSpecialCase();
    } else if (!this.canUse()) {
        this.displayMessage('This spell cannot currently be used.', Scene_Skill.prototype.triedToMagic_MessageCallback);
    } else if (this.action().isForOne()) {
        this._useOnWhoWindow.select(0);
        this._useOnWhoWindow.show();
        this._itemStatusWindow.show();
        this._itemStatWindow.setAction(this.action());
        this._itemStatWindow.show();
        this._skillWindow.showBackgroundDimmer();
        this._skillWindow.showAllHelpWindowBackgroundDimmers();
        this._useOnWhoWindow.activate();
    } else {
        this.startItemUse(true);
    }
};

Scene_Skill.prototype.onSkillCancel = function () {
    if (this._hasZoom) this._quickZoomWindow.show();
    this._commandWindow.hideBackgroundDimmer();
    this._skillWindow.hideAllHelpWindows();
    this._skillWindow.setLastSelected(this._skillWindow.index());
    this._skillWindow.deselect();
    this._commandWindow.activate();
};

Scene_Skill.prototype.onUseOnWhoOk = function () {
    this.startItemUse();
};

Scene_Skill.prototype.onUseOnWhoCancel = function () {
    this._useOnWhoWindow.hide();
    this._itemStatusWindow.hide();
    this._itemStatWindow.hide();
    this._skillWindow.hideBackgroundDimmer();
    this._skillWindow.hideAllHelpWindowBackgroundDimmers();
    this._skillWindow.activate();
};

Scene_Skill.prototype.onSkillZoom = function () {
    const item = this.item();
    const user = this.user();

    this._skillWindow.showBackgroundDimmer();
    this._skillWindow.showAllHelpWindowBackgroundDimmers();
    if ($gameParty.allowedZoom()) {
        // can zoom
        this._zoomWindow.select(0);
        this._zoomWindow.show();
        this._zoomWindow.activate();
    } else {
        // can't zoom
        this.displayMessage(user.triedToZoomMessage(item), Scene_Skill.prototype.triedToMagic_MessageCallback);
    }
};

Scene_Skill.prototype.onZoomOk = function () {
    const item = this.item();
    const user = this.user();
    $gameParty.setLastZoomPoint(this._zoomWindow.item());
    $gameSwitches.setValue(DQEng.Parameters.Game_System.StartZoomSwitch, 1);
    this.displayMessage(user.magicUsedMessage(item), Scene_Skill.prototype.zoom_MessageCallback);
};

Scene_Skill.prototype.onZoomCancel = function () {
    this._zoomWindow.hide();
    this._skillWindow.hideBackgroundDimmer();
    this._skillWindow.hideAllHelpWindowBackgroundDimmers();
    if (this._quickZoomMode) {
        this._commandWindow.hideBackgroundDimmer();
        this._quickZoomWindow.hideBackgroundDimmer();
        this._commandWindow.activate();
        this._quickZoomMode = false;
    } else {
        this._skillWindow.activate();
    }
};

//////////////////////////////
// Functions - messages
//////////////////////////////

Scene_Skill.prototype.nobodyToZoom_Message = function () {
    return `There's nobody in the party available!`;
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Skill.prototype.actionResolved_MessageCallback = function () {
    this.checkCommonEvent();
    this.checkGameover();
    this._useOnWhoWindow.hide();
    this._itemStatusWindow.hide();
    this._itemStatWindow.hide();
    this._skillWindow.hideBackgroundDimmer();
    this._skillWindow.hideAllHelpWindowBackgroundDimmers();
    this._skillWindow.refresh();
    this._skillWindow.activate();
};

Scene_Skill.prototype.triedToMagic_MessageCallback = function () {
    if (this._quickZoomMode) {
        this._quickZoomWindow.hideBackgroundDimmer();
        this._skillWindow.hideBackgroundDimmer();
        this._commandWindow.hideBackgroundDimmer();
        this._commandWindow.activate();
        this._quickZoomMode = false;
    } else {
        this._skillWindow.hideBackgroundDimmer();
        this._skillWindow.hideAllHelpWindowBackgroundDimmers();
        this._skillWindow.activate();
    }
};

Scene_Skill.prototype.triedToUse_MessageCallback = function () {
    this._useOnWhoWindow.activate();
};

Scene_Skill.prototype.triedToUseAll_MessageCallback = function () {
    this._skillWindow.activate();
};

Scene_Skill.prototype.zoom_MessageCallback = function () {
    SceneManager.goto(Scene_Map);
};

Scene_Skill.prototype.noZoomMembers_MessageCallback = function () {
    this._quickZoomWindow.hideBackgroundDimmer();
    this._skillWindow.hideBackgroundDimmer();
    this._commandWindow.hideBackgroundDimmer();
    this._commandWindow.activate();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Scene_Skill.prototype.user = function () {
    return this._quickZoomMode ? $gameParty.zoomMember() : $gameParty.members()[this._commandWindow.currentSymbol()];
};

Scene_Skill.prototype.item = function () {
    return this._quickZoomMode ? $dataSkills[DQEng.Parameters.Game_BattlerBase.zoomSkillId] : this._skillWindow.item();
};

Scene_Skill.prototype.startItemUse = function (forAll = false) {
    const item = this.item();
    const user = this.user();

    if (this.isItemEffectsValid()) {
        user.useSkill(item);
        $gameMessage.add(user.magicUsedMessage(item));
        this.applyItem();
        this.displayItemResultMessages(Scene_Skill.prototype);
    } else if (forAll) {
        this.displayMessage(user.triedToMagicAllMessage(item), Scene_Skill.prototype.triedToUseAll_MessageCallback);
    } else {
        const useOnActor = $gameParty.members()[this._useOnWhoWindow.currentSymbol()];
        this.displayMessage(user.triedToMagicMessage(item, useOnActor), Scene_Skill.prototype.triedToUse_MessageCallback);
    }
};

Scene_Skill.prototype.isSpecialCase = function () {
    return this.item().meta.special;
};

Scene_Skill.prototype.startSpecialCase = function () {
    switch (this.item().meta.special) {
        case Scene_Skill.Special_Zoom:
            this.onSkillZoom();
            break;
    }
};

Scene_Skill.prototype.refreshItemStatWindows = function () {
    this._itemStatusWindow.refresh();
    this._itemStatWindow.refresh();
};
