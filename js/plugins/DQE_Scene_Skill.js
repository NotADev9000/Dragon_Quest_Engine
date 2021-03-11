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

Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCommandWindow();
    this.createSkillWindow();
    this.createSkillStatWindow();
    this.createUseOnWhoWindow();
    this.createItemStatusWindow();
    this.createItemStatWindow();
    this.createMessageWindow();
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
    this._commandWindow = new Window_ItemCommand(48, 48, 354, 'Magic');
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
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
    this._commandWindow.setAssociatedWindow(this._skillWindow);
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
    this._commandWindow.showBackgroundDimmer();
    this._skillWindow.activate();
    this._skillWindow.select(this._skillWindow._lastSelected);
    this._skillWindow.showAllHelpWindows();
};

Scene_Skill.prototype.onSkillOk = function () {
    if (!this.canUse()) {
        this.displayMessage('This spell cannot currently be used.', Scene_Skill.prototype.triedToMagicMessage);
    } else if (this.action().isForOne()) {
        this._useOnWhoWindow.select(0);
        this._useOnWhoWindow.show();
        this._itemStatusWindow.show();
        // this._itemStatWindow.setAction(this.action());
        // this._itemStatWindow.show();
        this._skillWindow.showBackgroundDimmer();
        this._skillWindow.showAllHelpWindowBackgroundDimmers();
        this._useOnWhoWindow.activate();
    } else {
        this.startItemUse(true);
    }
};

Scene_Skill.prototype.onSkillCancel = function () {
    this._commandWindow.hideBackgroundDimmer();
    this._skillWindow.hideAllHelpWindows();
    this._skillWindow.setLastSelected(this._skillWindow.index());
    this._skillWindow.deselect();
    this._commandWindow.activate();
};

Scene_Skill.prototype.onUseOnWhoOk = function () {
    this.startItemUse();
};

Scene_Skill.prototype.startItemUse = function (forAll = false) {
    var item = this.item();
    var user = this.user();

    if (this.isItemEffectsValid()) {
        user.useItem(item);
        $gameMessage.add(user.magicUsedMessage(item));
        this.applyItem();
        this.displayItemResultMessages(Scene_Skill.prototype);
    } else if (forAll) {
        this.displayMessage(user.triedToMagicAllMessage(item), Scene_Skill.prototype.triedToUseAllMessage);
    } else {
        let useOnActor = $gameParty.members()[this._useOnWhoWindow.currentSymbol()];
        this.displayMessage(user.triedToMagicMessage(item, useOnActor), Scene_Skill.prototype.triedToUseMessage);
    }
};

Scene_Skill.prototype.onUseOnWhoCancel = function () {
    this._useOnWhoWindow.hide();
    this._itemStatusWindow.hide();
    this._itemStatWindow.hide();
    this._skillWindow.hideBackgroundDimmer();
    this._skillWindow.hideAllHelpWindowBackgroundDimmers();
    this._skillWindow.activate();
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_Skill.prototype.actionResolvedMessage = function () {
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

Scene_Skill.prototype.triedToMagicMessage = function () {
    this._skillWindow.activate();
};

Scene_Skill.prototype.triedToUseMessage = function () {
    this._useOnWhoWindow.activate();
};

Scene_Skill.prototype.triedToUseAllMessage = function () {
    this._skillWindow.activate();
};

//////////////////////////////
// Functions - misc.
//////////////////////////////

Scene_Skill.prototype.user = function () {
    return $gameParty.members()[this._commandWindow.currentSymbol()];
};

Scene_Skill.prototype.refreshItemStatWindows = function () {
    this._itemStatusWindow.refresh();
    this._itemStatWindow.refresh();
};
