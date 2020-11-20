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

/**
 * Returns false if item is not useable in menu
 */
Scene_ItemBase.prototype.canUse = function () {
    var user = this.user();
    if (user) {
        return user.canUse(this.item());
    }
    return false;
};

Scene_ItemBase.prototype.item = function () {
    return this._itemWindow ? this._itemWindow.item() : this._skillWindow.item();
};

Scene_ItemBase.prototype.action = function () {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    return action;
};

Scene_ItemBase.prototype.itemTargetActors = function () {
    var action = this.action();
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
    let refresh = '\\func[SceneManager._scene.refreshItemStatWindow]';
    $gameMessage.add(refresh + text);
};

Scene_ItemBase.prototype.displayItemResultMessages = function (scene) {
    this.itemTargetActors().forEach(target => {
        if (target.result().used) {
            $gameMessage.newPage();
            this.getResultTexts(target);
        }
    });
    this.displayMessage('', scene.actionResolvedMessage);
};

Scene_ItemBase.prototype.getResultTexts = function (target) {
    if (!this.getRevived(target)) {
        this.getDamage(target);
    }
};

Scene_ItemBase.prototype.getRevived = function (target) {
    var result = target.result();
    var revived = false;
    result.removedStateObjects().forEach(function (state) {
        if (state.id === target.deathStateId()) {
            this.addToMessage('\\sfx[Revive]' + target.name() + state.message4);
            revived = true;
        }
    }, this);
    return revived;
};
 
Scene_ItemBase.prototype.getDamage = function (target) {
    var result = target.result();
    if (result.missed) {
        // this.displayMiss(target);
    } else if (result.hpAffected) {
        this.addToMessage(this.getHpRecover(target));
    }
};

Scene_ItemBase.prototype.getHpRecover = function (target) {
    var damage = target.result().hpDamage;
    return '\\sysx[16]' + TextManager.actorRecovery.format(target.name(), TextManager.hp, -damage);
};
