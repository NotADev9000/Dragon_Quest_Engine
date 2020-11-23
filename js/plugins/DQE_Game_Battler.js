//=============================================================================
// Dragon Quest Engine - Game Battler
// DQE_Game_Battler.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass of Game_Actor and Game_Enemy - V0.1
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
Imported.DQEng_Game_Battler = true;

var DQEng = DQEng || {};
DQEng.Game_Battler = DQEng.Game_Battler || {};

//-----------------------------------------------------------------------------
// Game_Battler
//-----------------------------------------------------------------------------

Game_Battler.prototype.performRevival = function () {
    SoundManager.playRevival();
};

Game_Battler.prototype.useItem = function (item, modifiedSkill, itemIndex = -1) {
    if (DataManager.isSkill(item)) {
        var skill = modifiedSkill ? modifiedSkill : item;
        this.paySkillCost(skill);
    } else if (DataManager.isItem(item)) {
        if (itemIndex >= 0) {
            this.consumeActorItem(itemIndex);
        } else {
            this.consumeItem(item); // consume item from bag
        }
    }
};

Game_Battler.prototype.addState = function (stateId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId)) {
            this.addNewState(stateId);
            this.refresh();
            stateId === this.deathStateId() && $gamePlayer.refresh();
        }
        this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    }
};

Game_Battler.prototype.removeState = function (stateId) {
    if (this.isStateAffected(stateId)) {
        let removeDeath = stateId === this.deathStateId();
        removeDeath && this.revive();
        this.eraseState(stateId);
        $gamePlayer.refresh();
        removeDeath && this.refresh();
        this._result.pushRemovedState(stateId);
    }
};
