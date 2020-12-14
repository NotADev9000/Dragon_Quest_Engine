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

Game_Battler.prototype.removeStateAuto = function (timing, state) {
    if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
        this.removeState(state.id);
    }
};

Game_Battler.prototype.currentExpiringState = function (timing = 0) {
    let expiredState = null;
    this.states().some((state) => {
        if (this.isStateExpired(state.id) && (timing === 0 || state.autoRemovalTiming === timing)) {
            expiredState = state;
            return true;   
        }
        return false;
    });
    return expiredState;
};

/**
 * Clears result & updates the state & buff turn counts
 */
Game_Battler.prototype.onPostTurn1 = function () {
    this.clearResult();
    this.updateStateTurns();
    this.updateBuffTurns();
};

Game_Battler.prototype.onPostTurn2 = function () {
    // get list of all states that invoke an effect on turn end
    this.states().filter(state => {
        return state.meta.onTurnEnd;
    }).forEach(state => {
        this._actions.push(state.id);
    });
    // get stat regenrations
    if (this.hrg !== 0) this._actions.push('hrg');
    if (this.mrg !== 0) this._actions.push('mrg');
};

Game_Battler.prototype.invokeStateEffects = function (stateId) {
    let state = $dataStates[stateId];
    if (state.meta.formula) {
        let damage = -Math.max(eval(state.meta.formula),0);
        this.gainHp(damage);
    }
};

Game_Battler.prototype.invokeRegen = function (type) {
    switch (type) {
        case 'hrg':
            this.regenerateHp();
            break;
        case 'mrg':
            this.regenerateMp();
            break;
    }
};
