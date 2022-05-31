//=============================================================================
// Dragon Quest Engine - Scene ItemBase
// DQE_Scene_ItemBase.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass of Scene_Item and Scene_Skill - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_ItemBase = true;

var DQEng = DQEng || {};
DQEng.Scene_ItemBase = DQEng.Scene_ItemBase || {};

//-----------------------------------------------------------------------------
// Scene_ItemBase
//-----------------------------------------------------------------------------

DQEng.Scene_ItemBase.initialize = Scene_ItemBase.prototype.initialize;
Scene_ItemBase.prototype.initialize = function () {
    this._itemTarget = 0;
    DQEng.Scene_ItemBase.initialize.call(this);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_ItemBase.prototype.createItemStatusWindow = function () {
    const x = this._useOnWhoWindow.x + this._useOnWhoWindow.width;
    const y = this._useOnWhoWindow.y;
    this._itemStatusWindow = new Window_MenuStatus(x, y, undefined, undefined, true);
    this._itemStatusWindow.hide();
    this.addWindow(this._itemStatusWindow);
    this._useOnWhoWindow.setHelpWindow(this._itemStatusWindow);
};

Scene_ItemBase.prototype.createItemStatWindow = function () {
    const x = this._itemStatusWindow.x + this._itemStatusWindow.width;
    const y = this._itemStatusWindow.y;
    this._itemStatWindow = new Window_ItemActorStat(x, y);
    this._itemStatWindow.hide();
    this.addWindow(this._itemStatWindow);
    this._useOnWhoWindow.setHelpWindow(this._itemStatWindow);
};

//////////////////////////////
// Functions - item use
//////////////////////////////

/**
 * Returns false if item is not useable in menu
 */
Scene_ItemBase.prototype.canUse = function () {
    const user = this.user();
    if (user) {
        return user.canUse(this.item());
    }
    return false;
};

Scene_ItemBase.prototype.item = function () {
    return this._itemWindow.item();
};

Scene_ItemBase.prototype.action = function () {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    return action;
};

Scene_ItemBase.prototype.itemTargetActors = function () {
    const action = this.action();
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[this._useOnWhoWindow.currentSymbol()]];
    }
};

//////////////////////////////
// Functions - item use messages
//////////////////////////////

Scene_ItemBase.prototype.addToMessage = function (text) {
    const refresh = '\\FUNC[SceneManager,_scene,refreshItemStatWindows,]';
    $gameMessage.add(refresh + text);
};

Scene_ItemBase.prototype.displayItemResultMessages = function (scene) {
    this.itemTargetActors().forEach(target => {
        if (target.result().used) {
            $gameMessage.newPage();
            this.getResultTexts(target);
        }
    });
    this.displayMessage('', scene.actionResolved_MessageCallback);
};

Scene_ItemBase.prototype.getResultTexts = function (target) {
    if (!this.getRevived(target)) {
        this.getDamage(target);
        this.getStatus(target);
    }
    this.getGrow(target);
    this.getLearnSkillSets(target);
};

Scene_ItemBase.prototype.getRevived = function (target) {
    const result = target.result();
    let revived = false;
    result.removedStateObjects().forEach(function (state) {
        if (state.id === target.deathStateId()) {
            this.addToMessage('\\sfx[Revive]' + target.name() + state.message4);
            revived = true;
        }
    }, this);
    return revived;
};

Scene_ItemBase.prototype.getDamage = function (target) {
    const result = target.result();
    if (result.hpAffected) {
        this.addToMessage(this.getHpRecover(target));
    }
};

Scene_ItemBase.prototype.getHpRecover = function (target) {
    const damage = target.result().hpDamage;
    return '\\sysx[16]' + TextManager.actorRecovery.format(target.name(), TextManager.hp, -damage);
};

Scene_ItemBase.prototype.getStatus = function (target) {
    const result = target.result();
    result.removedStateObjects().forEach(state => {
        this.addToMessage(target.name() + state.message4);
    });
};

Scene_ItemBase.prototype.getGrow = function (target) {
    target.result().grow.forEach((value, index) => {
        if (value) {
            const stat = index < 9 ? TextManager.param(index) : TextManager.baseparam(index - 7);
            const dir = value > 0 ? `increases` : `decreases`;
            this.addToMessage(`${target.name()}'s ${stat} ${dir} by ${value}!`);
        }
    });
};

Scene_ItemBase.prototype.getLearnSkillSets = function (target) {
    const skillset = target.result().learnedSkillSet;
    if (skillset) this.addToMessage(`\\sfx[SkillSet_Unlock]${target.name()} learns ${skillset}!`);
};
